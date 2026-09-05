"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { ref, onValue, set, get, push, runTransaction } from "firebase/database";
import { db, ensureAuthUser } from "@/lib/firebase";
import Confetti from "react-confetti";
import { Inter, Outfit } from "next/font/google";

import PlayerCard from "@/components/PlayerCard";
import BiddingPad from "@/components/BiddingPad";
import CircularTimer from "@/components/CircularTimer";
import CricketPitch from "@/components/CricketPitch";
import RoomChat from "@/components/RoomChat";
import BroadcastMarquee from "@/components/BroadcastMarquee";
import LandingPage from "@/components/LandingPage";
import PrivateRoomModal from "@/components/PrivateRoomModal";
import JoinCodeModal from "@/components/JoinCodeModal";
import ActivityFeed from "@/components/ActivityFeed";
import BidBattleBar from "@/components/BidBattleBar";
import SoundTestModal from "@/components/SoundTestModal";
import {
  SoundSpeakerIcon,
  AudioEqualizer,
  CrownIcon,
  CricketBatIcon,
  ClockIcon,
  CheckIcon,
  GavelIcon,
  DiceIcon,
  NextTrackIcon,
  StarIcon,
  CopyIcon,
  WhatsAppIcon,
  ChevronRightIcon,
} from "@/components/AuctionIcons";
import { playersList } from "@/data/players";
import { sounds } from "@/lib/soundEffects";
import { formatLakhsAndCrores } from "@/lib/formatCurrency";

const outfit = Outfit({ subsets: ["latin"], weight: ["500", "600", "700", "800", "900"] });
const inter = Inter({ subsets: ["latin"] });

const DEFAULT_BUDGET = 10000;
const TIMER_DURATION_MS = 60 * 1000;
const WARNING_THRESHOLD_S = 15;

const getFranchiseName = (uniqueTeamId = "") => uniqueTeamId.split(" - ")[0];

export default function Home() {
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Auth & Role State
  const [currentUser, setCurrentUser] = useState(null);
  const [hostUid, setHostUid] = useState(null);

  // Multi-Room State
  const [roomId, setRoomId] = useState("MAIN-ARENA");
  const [roomCapacity, setRoomCapacity] = useState(8);
  const [roomAllowPlayerHammer, setRoomAllowPlayerHammer] = useState(false);
  const [rotateAuctioneer, setRotateAuctioneer] = useState(false);
  const [isAuctioneerBusy, setIsAuctioneerBusy] = useState(false);
  const [optOuts, setOptOuts] = useState({});
  const [autoNextSeconds, setAutoNextSeconds] = useState(null);

  useEffect(() => {
    if (!roomId) return;
    const unsubHammer = onValue(
      ref(db, `rooms/${roomId}/allowPlayerHammer`),
      (snap) => {
        if (snap.exists()) setRoomAllowPlayerHammer(!!snap.val());
      },
      (err) => console.warn("Listener allowPlayerHammer notice:", err)
    );
    const unsubRotate = onValue(
      ref(db, `rooms/${roomId}/rotateAuctioneer`),
      (snap) => {
        if (snap.exists()) setRotateAuctioneer(!!snap.val());
      },
      (err) => console.warn("Listener rotateAuctioneer notice:", err)
    );
    const unsubBusy = onValue(
      ref(db, `rooms/${roomId}/auctioneerBusy`),
      (snap) => {
        if (snap.exists()) setIsAuctioneerBusy(!!snap.val());
        else setIsAuctioneerBusy(false);
      },
      (err) => console.warn("Listener auctioneerBusy notice:", err)
    );
    return () => {
      unsubHammer();
      unsubRotate();
      unsubBusy();
    };
  }, [roomId]);

  // Ensure seamless anonymous authentication on client mount
  useEffect(() => {
    ensureAuthUser().then((u) => setCurrentUser(u)).catch(console.error);
  }, []);

  const isHost = useMemo(() => {
    if (!currentUser?.uid || !hostUid) return false;
    return currentUser.uid === hostUid;
  }, [currentUser?.uid, hostUid]);

  // Sync Room ID from URL on client mount + Auto-open Join modal for remote friends + Session Recovery
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlRoom = params.get("room");
      if (urlRoom && urlRoom.trim()) {
        const cleanRoom = urlRoom.trim().toUpperCase();
        setRoomId(cleanRoom);
        // Automatically pop open the join modal for friends clicking the invite link!
        const timer = setTimeout(() => {
          setIsJoinCodeModalOpen(true);
        }, 150);
        return () => clearTimeout(timer);
      } else {
        // Recover active draft session if page is reloaded by accident
        try {
          const savedRoom = sessionStorage.getItem("vrun11_active_room");
          const savedTeam = sessionStorage.getItem("vrun11_active_team");
          if (savedRoom && savedTeam) {
            setRoomId(savedRoom);
            setTeamName(savedTeam);
            setHasJoined(true);
          }
        } catch (e) {
          console.warn("Session restore error:", e);
        }
      }
    }
  }, []);

  // Modal States
  const [isPrivateModalOpen, setIsPrivateModalOpen] = useState(false);
  const [isJoinCodeModalOpen, setIsJoinCodeModalOpen] = useState(false);

  // Authentication / Room State
  const [teamName, setTeamName] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [myBudget, setMyBudget] = useState(DEFAULT_BUDGET);
  const [isMuted, setIsMuted] = useState(false);
  const [isSoundTestOpen, setIsSoundTestOpen] = useState(false);
  const [wasOutbid, setWasOutbid] = useState(false);
  const prevHighestBidderRef = useRef("No Bids Yet");

  // Active View Tab
  const [activeTab, setActiveTab] = useState("auction"); // 'auction', 'squad', or 'chat'
  const [cockpitTab, setCockpitTab] = useState("pool"); // 'pool', 'purses', 'chat'

  // Auction State
  const [activePlayerId, setActivePlayerId] = useState(playersList[0].id);
  const [auctionData, setAuctionData] = useState({});
  const [allTeams, setAllTeams] = useState({});
  const [currentBid, setCurrentBid] = useState(playersList[0].basePrice);
  const [highestBidder, setHighestBidder] = useState("No Bids Yet");

  // Live Activity Logs & Room Chat Messages
  const [activityLogs, setActivityLogs] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Squad State
  const [squad, setSquad] = useState([]);
  const [captainId, setCaptainId] = useState(null);
  const [viceCaptainId, setViceCaptainId] = useState(null);
  const [viewport, setViewport] = useState({ width: 1200, height: 900 });

  // Timer State & Rate Limiting
  const [timerEndsAt, setTimerEndsAt] = useState(null);
  const [now, setNow] = useState(0);
  const unsoldFiredRef = useRef(false);
  const prevBidRef = useRef(0);
  const lastBidTimeRef = useRef(0);

  const activePlayer = useMemo(() => {
    return playersList.find((p) => p.id === activePlayerId) || playersList[0];
  }, [activePlayerId]);

  const isSold = useMemo(() => {
    return auctionData[activePlayer.id]?.status === "sold";
  }, [auctionData, activePlayer.id]);

  const isUnsold = useMemo(() => {
    return auctionData[activePlayer.id]?.status === "unsold";
  }, [auctionData, activePlayer.id]);

  const secondsLeft = useMemo(() => {
    if (timerEndsAt === null || now === 0) return null;
    return Math.max(0, Math.ceil((timerEndsAt - now) / 1000));
  }, [timerEndsAt, now]);

  const isWarning = secondsLeft !== null && secondsLeft > 0 && secondsLeft <= WARNING_THRESHOLD_S;
  const isTimeUp = secondsLeft === 0;

  // Initialize clock and loading
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    const timer = setTimeout(() => setIsAppLoading(false), 500);
    return () => {
      clearInterval(tick);
      clearTimeout(timer);
    };
  }, []);

  // Viewport tracking for confetti
  useEffect(() => {
    const updateViewport = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  // Audio countdown ticks in final 5 seconds & Fair warning at 10s
  useEffect(() => {
    if (secondsLeft !== null && secondsLeft > 0 && secondsLeft <= 5) {
      sounds.playTick();
    } else if (secondsLeft === 10) {
      sounds.playFairWarning();
    }
  }, [secondsLeft]);

  // Join Room Handler (Used by PrivateModal, JoinCodeModal, QuickJoin)
  const handleJoinRoom = async ({
    roomId: targetRoom,
    managerName,
    franchise,
    capacity = 8,
    isNeutralAuctioneer = false,
    allowPlayerHammer = true,
  }) => {
    let user = currentUser;
    if (!user) {
      try {
        user = await ensureAuthUser();
        setCurrentUser(user);
      } catch (err) {
        console.error("Auth error:", err);
      }
    }
    const userUid = user?.uid || `anon-${Date.now()}`;
    const uniqueTeamId = isNeutralAuctioneer
      ? `Auctioneer - ${managerName}`
      : `${franchise} - ${managerName}`;

    // Establish or read host and room capacity
    const hostRef = ref(db, `rooms/${targetRoom}/hostUid`);
    const hostSnap = await get(hostRef);
    if (!hostSnap.exists()) {
      await set(hostRef, userUid);
      setHostUid(userUid);
      await set(ref(db, `rooms/${targetRoom}/capacity`), capacity);
      setRoomCapacity(capacity);
      await set(ref(db, `rooms/${targetRoom}/allowPlayerHammer`), !!allowPlayerHammer);
    } else {
      setHostUid(hostSnap.val());
      const capSnap = await get(ref(db, `rooms/${targetRoom}/capacity`));
      if (capSnap.exists()) setRoomCapacity(capSnap.val());
    }

    const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
    const currentCapSnap = await get(ref(db, `rooms/${targetRoom}/capacity`));
    const effectiveCap = currentCapSnap.exists() ? currentCapSnap.val() : capacity;

    const teamsSnap = await get(ref(db, `rooms/${targetRoom}/teams`));
    const rawTeams = teamsSnap.exists() ? teamsSnap.val() : {};

    // 🌟 Prune stale claims older than 2 hours to relieve backend pressure & release franchises
    const activeTeams = {};
    const nowTime = Date.now();
    for (const [teamKey, teamData] of Object.entries(rawTeams)) {
      const lastActive = teamData?.lastActiveAt || teamData?.joinedAt || 0;
      if (nowTime - lastActive < TWO_HOURS_MS) {
        activeTeams[teamKey] = teamData;
      } else {
        // Auto-release stale/expired claim from Firebase Realtime Database
        await set(ref(db, `rooms/${targetRoom}/teams/${teamKey}`), null);
      }
    }

    // 🌟 If re-joining or reclaiming a franchise, clear previous disconnect entry so player can enter immediately
    if (!isNeutralAuctioneer) {
      const conflictingTeamEntry = Object.entries(rawTeams).find(
        ([t]) => getFranchiseName(t) === franchise && t !== uniqueTeamId
      );
      if (conflictingTeamEntry) {
        await set(ref(db, `rooms/${targetRoom}/teams/${conflictingTeamEntry[0]}`), null);
      }
    }

    setRoomId(targetRoom);

    const teamRef = ref(db, `rooms/${targetRoom}/teams/${uniqueTeamId}`);
    const teamSnap = await get(teamRef);
    if (!teamSnap.exists()) {
      await set(teamRef, {
        budget: isNeutralAuctioneer ? 0 : DEFAULT_BUDGET,
        ownerUid: userUid,
        managerName,
        franchise: isNeutralAuctioneer ? "Auctioneer" : franchise,
        isNeutralAuctioneer: !!isNeutralAuctioneer,
        joinedAt: Date.now(),
        lastActiveAt: Date.now(),
      });
    } else {
      await set(ref(db, `rooms/${targetRoom}/teams/${uniqueTeamId}/lastActiveAt`), Date.now());
    }

    setTeamName(uniqueTeamId);
    setHasJoined(true);
    setIsPrivateModalOpen(false);
    setIsJoinCodeModalOpen(false);
    try {
      sessionStorage.setItem("vrun11_active_room", targetRoom);
      sessionStorage.setItem("vrun11_active_team", uniqueTeamId);
    } catch {}
  };

  // Heartbeat to keep active sessions alive (prevents expiration during active auction)
  useEffect(() => {
    if (!hasJoined || !roomId || !teamName) return;
    const interval = setInterval(() => {
      set(ref(db, `rooms/${roomId}/teams/${teamName}/lastActiveAt`), Date.now()).catch(() => {});
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [hasJoined, roomId, teamName]);

  const handleQuickJoin = () => {
    setIsPrivateModalOpen(true);
  };

  const handleLeaveRoom = async () => {
    // If leaving user is the host, proactively pass host authority to next player
    if (isHost && roomId) {
      const teamsArr = Object.values(allTeams).filter((t) => !t.isNeutralAuctioneer && t.ownerUid !== hostUid);
      if (teamsArr.length > 0) {
        const nextHost = teamsArr[0];
        if (nextHost && nextHost.ownerUid) {
          try {
            await set(ref(db, `rooms/${roomId}/hostUid`), nextHost.ownerUid);
            logEvent("info", `👑 Auctioneer departed. Gavel Authority transferred to ${nextHost.managerName} (${nextHost.franchise})!`);
          } catch (err) {
            console.warn("Error handing over host:", err);
          }
        }
      }
    }

    try {
      sessionStorage.removeItem("vrun11_active_room");
      sessionStorage.removeItem("vrun11_active_team");
    } catch {}
    if (roomId && teamName) {
      try {
        await set(ref(db, `rooms/${roomId}/teams/${teamName}`), null);
      } catch (err) {
        console.warn("Leave room cleanup error:", err);
      }
    }
    setHasJoined(false);
    setTeamName("");
    setActiveTab("auction");
  };

  const toggleSound = () => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
  };

  const logEvent = useCallback((type, message, subtext = "") => {
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const logItem = {
      type,
      message,
      text: message, // 🌟 Dual compatibility for Firebase rules requiring 'text' or 'message'
      subtext,
      time: nowTime,
      timestamp: Date.now(),
    };
    push(ref(db, `rooms/${roomId}/global/activityLog`), logItem).catch((err) => {
      console.warn("Activity log sync notice:", err);
    });
  }, [roomId]);

  const handleSendMessage = useCallback((msgText) => {
    if (!msgText || !teamName) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const chatItem = {
      sender: teamName.split(" - ")[1] || "Manager",
      franchise: getFranchiseName(teamName),
      message: msgText.slice(0, 150),
      text: msgText.slice(0, 150),
      time: nowTime,
      timestamp: Date.now(),
    };
    push(ref(db, `rooms/${roomId}/chat`), chatItem).catch((err) => {
      console.warn("Chat sync notice:", err);
    });
  }, [roomId, teamName]);

  const startNewTimer = useCallback(() => {
    const target = Date.now() + TIMER_DURATION_MS;
    set(ref(db, `rooms/${roomId}/global/timerEndsAt`), target).catch((err) => {
      console.warn("Timer sync notice:", err);
    });
  }, [roomId]);

  useEffect(() => {
    if (!hasJoined) return;
    get(ref(db, `rooms/${roomId}/global/timerEndsAt`)).then((s) => {
      if (!s.exists()) {
        startNewTimer();
      }
    });
  }, [hasJoined, startNewTimer, roomId]);

  // Room-Scoped Firebase Sync Listeners
  useEffect(() => {
    if (!hasJoined) return;

    const onErr = (name) => (err) => console.warn(`Listener ${name} sync notice:`, err);

    const unsubs = [
      onValue(ref(db, `rooms/${roomId}/hostUid`), (s) => setHostUid(s.exists() ? s.val() : null), onErr("hostUid")),
      onValue(ref(db, `rooms/${roomId}/capacity`), (s) => s.exists() && setRoomCapacity(s.val()), onErr("capacity")),
      onValue(ref(db, `rooms/${roomId}/global/activePlayerId`), (s) => s.exists() && setActivePlayerId(s.val()), onErr("activePlayerId")),
      onValue(ref(db, `rooms/${roomId}/global/timerEndsAt`), (s) => setTimerEndsAt(s.exists() ? s.val() : null), onErr("timerEndsAt")),
      onValue(ref(db, `rooms/${roomId}/auction`), (s) => s.exists() && setAuctionData(s.val()), onErr("auction")),
      onValue(ref(db, `rooms/${roomId}/teams`), (s) => s.exists() && setAllTeams(s.val()), onErr("teams")),
      onValue(ref(db, `rooms/${roomId}/auction/${activePlayer.id}/optOuts`), (s) => {
        setOptOuts(s.exists() ? s.val() : {});
      }, onErr("optOuts")),
      onValue(ref(db, `rooms/${roomId}/auction/${activePlayer.id}/currentBid`), (s) => {
        const val = s.val() !== null ? s.val() : activePlayer.basePrice;
        if (prevBidRef.current > 0 && val > prevBidRef.current) {
          sounds.playBid();
        }
        prevBidRef.current = val;
        setCurrentBid(val);
      }, onErr("currentBid")),
      onValue(ref(db, `rooms/${roomId}/auction/${activePlayer.id}/highestBidder`), (s) => {
        const val = s.val() !== null ? s.val() : "No Bids Yet";
        if (
          prevHighestBidderRef.current &&
          prevHighestBidderRef.current === teamName &&
          val !== teamName &&
          val !== "No Bids Yet"
        ) {
          sounds.playOutbid();
          setWasOutbid(true);
        } else if (val === teamName) {
          setWasOutbid(false);
        }
        prevHighestBidderRef.current = val;
        setHighestBidder(val);
      }, onErr("highestBidder")),
      onValue(ref(db, `rooms/${roomId}/teams/${teamName}/budget`), (s) =>
        setMyBudget(s.val() !== null ? s.val() : DEFAULT_BUDGET),
        onErr("budget")
      ),
      onValue(ref(db, `rooms/${roomId}/teams/${teamName}/squad`), (s) =>
        setSquad(s.exists() ? Object.values(s.val()) : []),
        onErr("squad")
      ),
      onValue(ref(db, `rooms/${roomId}/global/activityLog`), (s) => {
        if (s.exists()) {
          const raw = Object.entries(s.val()).map(([key, value]) => ({ id: key, ...value }));
          raw.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          setActivityLogs(raw.slice(0, 25));
        }
      }, onErr("activityLog")),
      onValue(ref(db, `rooms/${roomId}/chat`), (s) => {
        if (s.exists()) {
          const raw = Object.entries(s.val()).map(([key, value]) => ({ id: key, ...value }));
          raw.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
          setChatMessages(raw.slice(-30));
        }
      }, onErr("chat")),
    ];

    return () => unsubs.forEach((unsub) => unsub());
  }, [activePlayer.id, activePlayer.basePrice, hasJoined, teamName, roomId]);

  // Host Departure auto-recovery: If host leaves, designate an active manager
  useEffect(() => {
    if (!roomId || !hasJoined) return;
    const teamsArr = Object.values(allTeams);
    if (teamsArr.length > 0 && hostUid) {
      const hostStillPresent = teamsArr.some((t) => t.ownerUid === hostUid);
      if (!hostStillPresent) {
        const nextHost = teamsArr.find((t) => !t.isNeutralAuctioneer) || teamsArr[0];
        if (nextHost && nextHost.ownerUid) {
          set(ref(db, `rooms/${roomId}/hostUid`), nextHost.ownerUid);
          logEvent(
            "info",
            `👑 Host departed. Gavel Authority transferred to ${nextHost.managerName} (${nextHost.franchise})!`
          );
        }
      }
    }
  }, [allTeams, hostUid, roomId, hasJoined, logEvent]);

  // Opt-out / Back off state helpers
  const isOptedOut = useMemo(() => {
    return !!optOuts[teamName];
  }, [optOuts, teamName]);

  const optOutCount = useMemo(() => {
    return Object.keys(optOuts).length;
  }, [optOuts]);

  const handleOptOut = useCallback((optedOut) => {
    if (!roomId || !activePlayer?.id || !teamName) return;
    set(ref(db, `rooms/${roomId}/auction/${activePlayer.id}/optOuts/${teamName}`), optedOut ? true : null);
    if (optedOut) {
      logEvent("info", `✋ ${getFranchiseName(teamName)} backed off from bidding on ${activePlayer.name}`);
    } else {
      logEvent("info", `⚡ ${getFranchiseName(teamName)} jumped back into the bidding!`);
    }
  }, [roomId, activePlayer?.id, activePlayer?.name, teamName, logEvent]);

  // Auctioneer Gavel rotation & authority controls
  const handleToggleAuctioneerBusy = useCallback(() => {
    const nextBusy = !isAuctioneerBusy;
    set(ref(db, `rooms/${roomId}/auctioneerBusy`), nextBusy);
    if (nextBusy) {
      set(ref(db, `rooms/${roomId}/allowPlayerHammer`), true);
      const hostTeam = Object.values(allTeams).find((t) => t.ownerUid === hostUid);
      logEvent("info", `⏳ ${hostTeam?.managerName || "Auctioneer"} marked themselves BUSY / STEPPED AWAY. Hammer is open to all!`);
    } else {
      set(ref(db, `rooms/${roomId}/allowPlayerHammer`), false);
      logEvent("info", `✅ Auctioneer returned and reclaimed gavel authority!`);
    }
  }, [roomId, isAuctioneerBusy, allTeams, hostUid, logEvent]);

  const handleToggleRotateAuctioneer = useCallback(() => {
    set(ref(db, `rooms/${roomId}/rotateAuctioneer`), !rotateAuctioneer);
  }, [roomId, rotateAuctioneer]);

  const handleTogglePlayerHammer = useCallback(() => {
    set(ref(db, `rooms/${roomId}/allowPlayerHammer`), !roomAllowPlayerHammer);
  }, [roomId, roomAllowPlayerHammer]);

  const handlePassGavelRandomly = useCallback(() => {
    const eligibleTeams = Object.values(allTeams).filter((t) => !t.isNeutralAuctioneer);
    if (eligibleTeams.length < 2) {
      return alert("Not enough players in room to rotate gavel!");
    }
    const otherTeams = eligibleTeams.filter((t) => t.ownerUid !== hostUid);
    const nextHost = otherTeams.length > 0
      ? otherTeams[Math.floor(Math.random() * otherTeams.length)]
      : eligibleTeams[0];
    if (nextHost && nextHost.ownerUid) {
      set(ref(db, `rooms/${roomId}/hostUid`), nextHost.ownerUid);
      logEvent("info", `🎲 Host passed Gavel Authority to ${nextHost.managerName} (${nextHost.franchise})!`);
      sounds.playGavel();
    }
  }, [allTeams, hostUid, roomId, logEvent]);

  // Atomic Bidding via Firebase runTransaction (Zero collision, strictly ordered)
  const handleBid = async (amountToAdd) => {
    if (isSold || isTimeUp) return;

    const nowTime = Date.now();
    if (nowTime - lastBidTimeRef.current < 400) return;
    lastBidTimeRef.current = nowTime;

    if (highestBidder === teamName) {
      return alert("⚠️ You already hold the highest bid!");
    }

    const auctionRef = ref(db, `rooms/${roomId}/auction/${activePlayer.id}`);
    try {
      const txResult = await runTransaction(auctionRef, (currentData) => {
        const curBid = currentData?.currentBid ?? activePlayer.basePrice;
        const curStatus = currentData?.status;
        if (curStatus === "sold" || curStatus === "unsold") {
          return; // Abort if round ended
        }
        const nextBid = curBid + amountToAdd;
        if (nextBid > myBudget) {
          return; // Abort if insufficient funds
        }
        return {
          ...(currentData || {}),
          currentBid: nextBid,
          highestBidder: teamName,
          lastBidderUid: currentUser?.uid || "anon",
          updatedAt: Date.now()
        };
      });

      if (txResult.committed) {
        const finalBid = txResult.snapshot.val()?.currentBid || (currentBid + amountToAdd);
        // Extend timer if below 15s
        const timerSnap = await get(ref(db, `rooms/${roomId}/global/timerEndsAt`));
        const currentTimerEnd = timerSnap.exists() ? timerSnap.val() : 0;
        if (currentTimerEnd - Date.now() < 15000) {
          await set(ref(db, `rooms/${roomId}/global/timerEndsAt`), Date.now() + 15000);
        }

        logEvent(
          "bid",
          `⚡ ${getFranchiseName(teamName)} raised bid to ${formatLakhsAndCrores(finalBid, true)}`,
          `${activePlayer.name} (+${formatLakhsAndCrores(amountToAdd, true)})`
        );
      }
    } catch (err) {
      console.error("Bid transaction failed:", err);
    }
  };

  const selectPlayerForAuction = useCallback((player) => {
    const canControl = isHost || teamName.startsWith("Auctioneer - ") || roomAllowPlayerHammer || isAuctioneerBusy;
    if (!canControl && hostUid) {
      return alert("⚠️ Only the Room Host / Auctioneer can nominate players!");
    }
    const status = auctionData[player.id]?.status;
    if (status === "sold") return;

    set(ref(db, `rooms/${roomId}/global/activePlayerId`), player.id);
    set(ref(db, `rooms/${roomId}/auction/${player.id}/status`), null);
    set(ref(db, `rooms/${roomId}/auction/${player.id}/currentBid`), player.basePrice);
    set(ref(db, `rooms/${roomId}/auction/${player.id}/highestBidder`), "No Bids Yet");
    set(ref(db, `rooms/${roomId}/auction/${player.id}/optOuts`), null);
    setWasOutbid(false);
    prevHighestBidderRef.current = "No Bids Yet";
    startNewTimer();

    logEvent(
      "info",
      `📢 ${player.name} is now on the auction block!`,
      `Base: ${formatLakhsAndCrores(player.basePrice, true)} | ${player.role}`
    );
  }, [auctionData, logEvent, startNewTimer, roomId, isHost, hostUid, teamName, roomAllowPlayerHammer, isAuctioneerBusy]);

  // Atomic Sell / Pass Handler (prevents multi-client double deduction)
  const handleSell = useCallback(async () => {
    const canUseHammer = isHost || teamName.startsWith("Auctioneer - ") || roomAllowPlayerHammer || isAuctioneerBusy;
    if (!canUseHammer && hostUid) {
      return alert("⚠️ Only the Room Authority / Auctioneer can strike the gavel!");
    }
    const auctionStatusRef = ref(db, `rooms/${roomId}/auction/${activePlayer.id}`);
    try {
      const tx = await runTransaction(auctionStatusRef, (cur) => {
        if (cur?.status === "sold" || cur?.status === "unsold") {
          return; // Already finalized by another client!
        }
        const hasWinningBid = cur?.highestBidder && cur?.highestBidder !== "No Bids Yet";
        return {
          ...(cur || {}),
          status: hasWinningBid ? "sold" : "unsold",
          finalizedAt: Date.now()
        };
      });

      if (!tx.committed) return; // Skip duplicate execution

      const finalizedData = tx.snapshot.val();
      const winner = finalizedData?.highestBidder;
      const finalPrice = finalizedData?.currentBid ?? activePlayer.basePrice;

      if (!winner || winner === "No Bids Yet" || finalizedData?.status === "unsold") {
        sounds.playUnsold();
        logEvent("unsold", `❌ ${activePlayer.name} went UNSOLD`, `Base ${formatLakhsAndCrores(activePlayer.basePrice, true)}`);
        return;
      }

      sounds.playGavel();
      if (winner === teamName) {
        sounds.playVictory();
      }

      // Atomically deduct winner's budget
      const winnerBudgetRef = ref(db, `rooms/${roomId}/teams/${winner}/budget`);
      await runTransaction(winnerBudgetRef, (curBudget) => {
        const starting = curBudget !== null ? curBudget : DEFAULT_BUDGET;
        return Math.max(0, starting - finalPrice);
      });

      // Assign to winner squad
      await set(ref(db, `rooms/${roomId}/teams/${winner}/squad/${activePlayer.id}`), {
        id: activePlayer.id,
        name: activePlayer.name,
        role: activePlayer.role,
        country: activePlayer.country || "IND",
        flag: activePlayer.flag || "🇮🇳",
        isOverseas: !!activePlayer.isOverseas,
        imageUrl: activePlayer.imageUrl,
        stats: activePlayer.stats || {},
        boughtFor: finalPrice,
        isPlaying: false,
      });

      logEvent(
        "sold",
        `🔨 SOLD! ${getFranchiseName(winner)} bought ${activePlayer.name} for ${formatLakhsAndCrores(finalPrice, true)}!`,
        `Base ${formatLakhsAndCrores(activePlayer.basePrice, true)}`
      );
    } catch (err) {
      console.error("Sale transaction failed:", err);
    }
  }, [activePlayer, logEvent, teamName, roomId]);

  useEffect(() => {
    unsoldFiredRef.current = false;
  }, [timerEndsAt]);

  // Timer clock is open for everyone; only Auctioneer striking the gavel concludes the lot!

  const handleNextPlayer = useCallback(() => {
    const canControl = isHost || teamName.startsWith("Auctioneer - ") || roomAllowPlayerHammer || isAuctioneerBusy;
    if (!canControl && hostUid) {
      return alert("⚠️ Only the Room Host / Auctioneer can advance to the next player!");
    }
    const available = playersList.filter((p) => {
      const status = auctionData[p.id]?.status;
      return (
        status !== "sold" &&
        (filterRole === "All" || p.role === filterRole) &&
        p.id !== activePlayer.id
      );
    });

    if (available.length > 0) {
      // If rotate auctioneer is enabled, pick a random active manager for the next round
      if (rotateAuctioneer) {
        const eligibleTeams = Object.values(allTeams).filter((t) => !t.isNeutralAuctioneer);
        if (eligibleTeams.length > 1) {
          const otherTeams = eligibleTeams.filter((t) => t.ownerUid !== hostUid);
          const nextHost = otherTeams.length > 0
            ? otherTeams[Math.floor(Math.random() * otherTeams.length)]
            : eligibleTeams[0];
          if (nextHost && nextHost.ownerUid) {
            set(ref(db, `rooms/${roomId}/hostUid`), nextHost.ownerUid);
            logEvent("info", `🎲 Gavel passed to ${nextHost.managerName} (${nextHost.franchise}) for the next round!`);
          }
        }
      }

      selectPlayerForAuction(available[0]);
    } else {
      alert("All lots in this category are completed! Select another role from the pool.");
    }
  }, [auctionData, filterRole, activePlayer.id, selectPlayerForAuction, isHost, hostUid, teamName, roomAllowPlayerHammer, isAuctioneerBusy, rotateAuctioneer, allTeams, roomId, logEvent]);

  // Automatic countdown transition to next lot when hammer strikes
  useEffect(() => {
    if (isSold || isUnsold) {
      setAutoNextSeconds(4);
      const timer = setInterval(() => {
        setAutoNextSeconds((prev) => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setAutoNextSeconds(null);
    }
  }, [isSold, isUnsold]);

  useEffect(() => {
    if (autoNextSeconds === 0) {
      setAutoNextSeconds(null);
      if (isHost || (hostUid && !Object.values(allTeams).some((t) => t.ownerUid === hostUid))) {
        handleNextPlayer();
      }
    }
  }, [autoNextSeconds, isHost, hostUid, allTeams, handleNextPlayer]);

  const handleExtendTimer = useCallback(async () => {
    const canControl = isHost || teamName.startsWith("Auctioneer - ") || roomAllowPlayerHammer || isAuctioneerBusy;
    if (!canControl && hostUid) {
      return alert("⚠️ Only the Room Authority / Auctioneer can extend the clock!");
    }
    const timerSnap = await get(ref(db, `rooms/${roomId}/global/timerEndsAt`));
    const cur = timerSnap.exists() ? timerSnap.val() : Date.now();
    const newEnd = Math.max(cur, Date.now()) + 15000;
    await set(ref(db, `rooms/${roomId}/global/timerEndsAt`), newEnd);
    logEvent("info", "⏱️ 15s Fair Warning added by Auctioneer!");
    sounds.playTick();
  }, [roomId, isHost, hostUid, teamName, roomAllowPlayerHammer, isAuctioneerBusy, logEvent]);

  const handleResetTimer = useCallback(async () => {
    const canControl = isHost || teamName.startsWith("Auctioneer - ") || roomAllowPlayerHammer || isAuctioneerBusy;
    if (!canControl && hostUid) {
      return alert("⚠️ Only the Room Authority / Auctioneer can reset the clock!");
    }
    startNewTimer();
    logEvent("info", "🔄 60s Clock reset by Auctioneer!");
    sounds.playTick();
  }, [isHost, hostUid, teamName, roomAllowPlayerHammer, isAuctioneerBusy, startNewTimer, logEvent]);

  const togglePlayingStatus = (player) => {
    const playingXI = squad.filter((p) => p.isPlaying);
    if (!player.isPlaying) {
      if (playingXI.length >= 11) {
        return alert("⚠️ Playing XI is already full (11/11 players)!");
      }
      const currentOverseas = playingXI.filter((p) => p.isOverseas).length;
      if (player.isOverseas && currentOverseas >= 4) {
        return alert("⚠️ Overseas Limit Reached! (Max 4 overseas in XI).");
      }
    }
    set(ref(db, `rooms/${roomId}/teams/${teamName}/squad/${player.id}/isPlaying`), !player.isPlaying);
  };

  const handleReleasePlayer = (player) => {
    if (window.confirm(`Release ${player.name} and refund ${formatLakhsAndCrores(player.boughtFor, true)}?`)) {
      set(ref(db, `rooms/${roomId}/teams/${teamName}/squad/${player.id}`), null);
      get(ref(db, `rooms/${roomId}/teams/${teamName}/budget`)).then((s) => {
        if (s.exists()) set(ref(db, `rooms/${roomId}/teams/${teamName}/budget`), s.val() + player.boughtFor);
      });
      set(ref(db, `rooms/${roomId}/auction/${player.id}`), null);
      if (captainId === player.id) setCaptainId(null);
      if (viceCaptainId === player.id) setViceCaptainId(null);
    }
  };

  const filteredPlayers = useMemo(() => {
    return playersList.filter((p) => {
      const data = auctionData[p.id] || {};
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = filterRole === "All" || p.role === filterRole;
      const status = data.status || "available";
      const matchesStatus =
        filterStatus === "All" ||
        (filterStatus === "available" && status !== "sold") ||
        (filterStatus === "sold" && status === "sold") ||
        (filterStatus === "unsold" && status === "unsold");

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [auctionData, searchQuery, filterRole, filterStatus]);

  const playingXI = squad.filter((p) => p.isPlaying);
  const bench = squad.filter((p) => !p.isPlaying);
  const activeCount = Object.keys(allTeams).length;

  if (isAppLoading) {
    return (
      <main className={`min-h-screen bg-[#070b14] flex items-center justify-center ${inter.className}`}>
        <div className="animate-pulse flex items-center gap-3 bg-slate-900/90 px-7 py-3.5 rounded-full shadow-2xl border border-white/10">
          <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-white font-black text-xl tracking-wider">V-RUN 11</span>
        </div>
      </main>
    );
  }

  // 🌟 View 1: Not Joined - Landing Page
  if (!hasJoined) {
    return (
      <div className={`min-h-screen bg-[#fcfbf9] text-[#121417] flex flex-col ${inter.className}`}>
        <LandingPage
          onOpenPrivateModal={() => setIsPrivateModalOpen(true)}
          onOpenJoinCodeModal={() => setIsJoinCodeModalOpen(true)}
          onQuickJoin={handleQuickJoin}
        />

        <PrivateRoomModal
          isOpen={isPrivateModalOpen}
          onClose={() => setIsPrivateModalOpen(false)}
          onJoinRoom={handleJoinRoom}
          allTeams={allTeams}
          initialRoomId={roomId}
        />

        <JoinCodeModal
          isOpen={isJoinCodeModalOpen}
          onClose={() => setIsJoinCodeModalOpen(false)}
          onJoinRoom={handleJoinRoom}
          allTeams={allTeams}
          initialRoomId={roomId}
        />
      </div>
    );
  }

  // 🌟 View 2: Joined - Zero-Scroll Sports Draft Room
  return (
    <div
      className={`min-h-screen lg:h-screen lg:max-h-screen flex flex-col bg-[#f0f5f1] bg-[radial-gradient(#cdddd2_1.5px,transparent_1.5px)] [background-size:24px_24px] text-[#12241b] overflow-y-auto lg:overflow-hidden relative select-none ${inter.className}`}
    >
      {/* Ambient Top Light Tint Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* 🌟 1. LUXURY EDITORIAL SPORTS HEADER */}
      <header className="py-2.5 px-4 md:px-6 bg-white/90 backdrop-blur-xl border-b border-[#cfe0d5] flex flex-wrap items-center justify-between gap-3 shrink-0 z-20 shadow-[0_4px_20px_rgba(18,64,50,0.05)] text-[#12241b]">
        {/* Left: Brand + Room Code + Role */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={handleLeaveRoom}
            title="Leave Room"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#059669] to-[#047857] flex items-center justify-center text-white font-black text-sm shadow-xs border border-[#34d399]/40 group-hover:scale-105 transition-transform">
              <CricketBatIcon className="w-4 h-4 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-xl font-black tracking-tight uppercase text-[#0e2c1e] group-hover:text-[#059669] transition-colors leading-none ${outfit.className}`}>
                  V-RUN 11
                </span>
                <span className="text-[9px] font-sans bg-[#e2efe6] text-[#0f5132] border border-[#b6d8c2] px-1.5 py-0.2 rounded font-black uppercase tracking-wider">
                  PRO
                </span>
              </div>
              <p className="text-[10px] font-sans font-medium text-[#5c7467] uppercase tracking-wider leading-none mt-0.5">
                IPL Premier Draft
              </p>
            </div>
          </div>

          <div className="hidden sm:block h-6 w-[1px] bg-[#cfe0d5] mx-1" />

          {/* Room Code & Share Plate */}
          <div className="flex items-center gap-2 bg-[#eaf3ec] border border-[#c4ded0] px-3 py-1 rounded-2xl shadow-xs text-xs font-mono text-[#0e2c1e]">
            <span className="text-[#065f46] text-[10px] font-sans font-bold">ARENA:</span>
            <span className="font-black text-[#0e2c1e] tracking-wider">{roomId}</span>
            <button
              onClick={() => {
                const url = `${window.location.origin}/?room=${encodeURIComponent(roomId)}`;
                navigator.clipboard.writeText(url);
                alert(`Invite link copied to clipboard!\nShare this with your friends:\n${url}`);
              }}
              className="text-[11px] font-sans font-semibold text-[#059669] hover:text-[#047857] hover:underline ml-1 cursor-pointer flex items-center gap-1"
              title="Copy Room Link"
            >
              <CopyIcon className="w-3 h-3 text-[#059669]" />
              <span>Copy</span>
            </button>
            <button
              onClick={() => {
                const url = `${window.location.origin}/?room=${encodeURIComponent(roomId)}`;
                const msg = encodeURIComponent(`Join my Live IPL Fantasy Auction Draft!\nRoom PIN: ${roomId}\nTap to pick your franchise team: ${url}`);
                window.open(`https://wa.me/?text=${msg}`, "_blank");
              }}
              className="text-[11px] font-sans font-semibold text-[#059669] hover:text-[#047857] hover:underline ml-1 cursor-pointer flex items-center gap-1"
              title="Share via WhatsApp"
            >
              <WhatsAppIcon className="w-3 h-3 text-[#059669]" />
              <span>WhatsApp</span>
            </button>
          </div>

          {/* Host / Room Authority Badge & Controls */}
          {isHost ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 bg-[#e8f3ec] text-[#0f5132] border border-[#b8dbc4] px-2.5 py-1 rounded-2xl text-xs font-sans font-bold shadow-xs">
                <CrownIcon className="w-3.5 h-3.5 text-amber-600" />
                <span>Host</span>
              </span>

              <div className="flex items-center gap-1 bg-[#eaf3ec] p-1 rounded-2xl border border-[#c4ded0] text-[10px] font-sans font-semibold flex-wrap">
                {/* ⏳ Busy / Step Away Toggle */}
                <button
                  onClick={handleToggleAuctioneerBusy}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer shadow-xs border flex items-center gap-1 ${
                    isAuctioneerBusy
                      ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-600 animate-pulse"
                      : "bg-white hover:bg-amber-50 text-amber-800 border-amber-300"
                  }`}
                  title={
                    isAuctioneerBusy
                      ? "You are marked busy. Tap to reclaim gavel authority"
                      : "Step away temporarily. Hands hammer authority to the room until you return."
                  }
                >
                  {isAuctioneerBusy ? (
                    <>
                      <CheckIcon className="w-3 h-3 text-white" />
                      <span>I'm Back</span>
                    </>
                  ) : (
                    <>
                      <ClockIcon className="w-3 h-3 text-amber-700" />
                      <span>Busy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleTogglePlayerHammer}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                    roomAllowPlayerHammer
                      ? "bg-[#d1fae5] text-[#065f46] border border-[#6ee7b7]"
                      : "text-[#5c7467] hover:text-[#0e2c1e]"
                  }`}
                  title="Allow non-host players to strike the hammer"
                >
                  <GavelIcon className="w-3 h-3 text-[#065f46]" />
                  <span>Hammer: {roomAllowPlayerHammer ? "ON" : "OFF"}</span>
                </button>

                <button
                  onClick={handleToggleRotateAuctioneer}
                  className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-bold transition-colors cursor-pointer ${
                    rotateAuctioneer
                      ? "bg-purple-100 text-purple-900 border border-purple-300"
                      : "text-[#5c7467] hover:text-[#0e2c1e]"
                  }`}
                  title="Randomly rotate auctioneer role to another player each round"
                >
                  <DiceIcon className="w-3 h-3 text-purple-800" />
                  <span>Rotate: {rotateAuctioneer ? "ON" : "OFF"}</span>
                </button>

                <button
                  onClick={handlePassGavelRandomly}
                  className="px-2 py-0.5 rounded-lg bg-white border border-[#b8dbc4] text-[#0f5132] hover:bg-[#e2efe6] font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1"
                  title="Pass gavel authority to another player now"
                >
                  <span>Pass</span>
                  <DiceIcon className="w-3 h-3 text-[#059669]" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="hidden md:inline-flex items-center gap-1.5 bg-[#eaf3ec] text-[#1c3829] border border-[#c4ded0] px-3 py-1.5 rounded-2xl text-xs font-sans font-semibold">
                <CrownIcon className="w-3.5 h-3.5 text-amber-600" />
                <span>Authority: {allTeams[Object.keys(allTeams).find((k) => allTeams[k].ownerUid === hostUid)]?.managerName || "Host"}</span>
              </span>
              {isAuctioneerBusy ? (
                <span className="text-[10px] font-sans font-bold bg-amber-500 text-white px-2 py-0.5 rounded-xl flex items-center gap-1 animate-pulse">
                  <ClockIcon className="w-3 h-3 text-white" />
                  <span>Auctioneer Busy</span>
                </span>
              ) : roomAllowPlayerHammer ? (
                <span className="text-[10px] font-sans font-bold bg-[#d1fae5] text-[#065f46] border border-[#6ee7b7] px-2 py-0.5 rounded-xl flex items-center gap-1">
                  <GavelIcon className="w-3 h-3 text-[#065f46]" />
                  <span>Hammer Open to All</span>
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* Center: Main View Tabs with Inset Physical Track */}
        <div className="flex items-center gap-1.5 bg-[#e4eee6] p-1.5 rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-[#cfe0d5]">
          <button
            onClick={() => setActiveTab("auction")}
            className={`px-4 py-1.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "auction"
                ? "bg-white text-[#0f3d2a] shadow-[0_2px_8px_rgba(18,64,50,0.12)] border border-[#b8d8c4]"
                : "text-[#5c7467] hover:text-[#0e2c1e]"
            }`}
          >
            Auction Floor
          </button>
          {!teamName.startsWith("Auctioneer - ") && (
            <button
              onClick={() => setActiveTab("squad")}
              className={`px-4 py-1.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "squad"
                  ? "bg-white text-[#0f3d2a] shadow-[0_2px_8px_rgba(18,64,50,0.12)] border border-[#b8d8c4]"
                  : "text-[#5c7467] hover:text-[#0e2c1e]"
              }`}
            >
              My Squad ({squad.length}/11)
            </button>
          )}
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-1.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "chat"
                ? "bg-white text-[#0f3d2a] shadow-[0_2px_8px_rgba(18,64,50,0.12)] border border-[#b8d8c4]"
                : "text-[#5c7467] hover:text-[#0e2c1e]"
            }`}
          >
            Telegraph
          </button>
        </div>

        {/* Right: Purse + Manager Count + Mute + Exit */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block bg-[#eaf3ec] border border-[#c4ded0] px-3 py-1 rounded-2xl shadow-xs">
            <span className="text-[9px] uppercase font-sans font-semibold text-[#5c7567] block leading-none">
              Franchises
            </span>
            <span className="text-xs font-bold font-mono text-[#0e2c1e] mt-0.5">
              {activeCount}/{roomCapacity}
            </span>
          </div>

          {teamName.startsWith("Auctioneer - ") ? (
            <div className="text-right bg-[#e8f3ec] border border-[#b8dbc4] px-4 py-1 rounded-2xl shadow-xs">
              <span className="text-[9px] uppercase font-sans font-semibold text-[#5c7567] block leading-none">
                Role
              </span>
              <span className="text-xs font-bold font-sans text-[#065f46] leading-none">
                Auctioneer
              </span>
            </div>
          ) : (
            <div className="text-right bg-gradient-to-b from-[#eaf5ed] to-[#daf0e0] border border-[#a8d7ba] px-4 py-1 rounded-2xl shadow-xs">
              <div className="flex items-center justify-end gap-1">
                <span className="text-[9px] uppercase font-sans font-semibold text-[#5c7567] block leading-none">
                  Purse
                </span>
                {isHost && (
                  <span className="text-[8px] font-sans font-bold bg-[#d1fae5] text-[#065f46] px-1 rounded">
                    Host & Gavel
                  </span>
                )}
              </div>
              <span className="text-sm font-black font-mono text-[#065f46] leading-none mt-0.5 block drop-shadow-xs">
                {formatLakhsAndCrores(myBudget, true)}
              </span>
            </div>
          )}

          {/* Audio Controls & SFX Test */}
          <div className="flex items-center gap-1.5 bg-[#eaf3ec] border border-[#c4ded0] p-1 rounded-2xl shadow-xs">
            <button
              onClick={toggleSound}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer ${
                isMuted ? "text-[#5c7467]/50 hover:text-[#5c7467]" : "text-[#059669] hover:text-[#047857]"
              }`}
              title={isMuted ? "Unmute Broadcast Audio" : "Mute Broadcast Audio"}
            >
              <SoundSpeakerIcon isMuted={isMuted} className="w-4 h-4" />
              <AudioEqualizer isMuted={isMuted} className="hidden sm:flex items-end gap-0.5 h-3" />
            </button>
            <button
              onClick={() => setIsSoundTestOpen(true)}
              className="px-2 py-0.5 rounded-lg text-[10px] font-sans font-bold text-[#0f5132] hover:text-[#065f46] bg-white hover:bg-[#dff0e5] transition-colors cursor-pointer border border-[#b8dbc4]"
              title="Test Web Audio Sound Synthesizer"
            >
              SFX Test
            </button>
          </div>

          <button
            onClick={handleLeaveRoom}
            className="px-3.5 py-1.5 bg-gradient-to-b from-rose-50 to-rose-100 hover:to-rose-200 text-rose-700 border border-rose-300 rounded-2xl text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs active:translate-y-0.5"
          >
            Exit
          </button>
        </div>
      </header>

      {/* 🌟 2. BROADCAST STATUS TICKER */}
      <BroadcastMarquee
        auctionData={auctionData}
        playersList={playersList}
        allTeams={allTeams}
      />

      {/* 🌟 AUCTIONEER BUSY / STEPPED AWAY ANNOUNCEMENT BANNER */}
      {isAuctioneerBusy && (
        <div className="w-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white py-2 px-4 md:px-6 flex flex-wrap items-center justify-between gap-2 font-sans text-xs shadow-md border-b border-amber-500 animate-fade-in shrink-0 z-20">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-amber-100" />
            <span className="font-extrabold uppercase tracking-wider">
              AUCTIONEER IS BUSY / STEPPED AWAY
            </span>
            <span className="bg-black/25 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-white/20">
              Hammer is open to all franchise managers!
            </span>
          </div>

          {isHost && (
            <button
              onClick={handleToggleAuctioneerBusy}
              className="px-3 py-1 bg-white hover:bg-amber-50 text-amber-900 font-extrabold uppercase tracking-wider text-[11px] rounded-xl shadow-xs transition-all cursor-pointer active:translate-y-0.5 flex items-center gap-1.5"
            >
              <CheckIcon className="w-3.5 h-3.5 text-amber-900" />
              <span>I'm Back (Reclaim Gavel)</span>
            </button>
          )}
        </div>
      )}

      {/* 🌟 AUTO-NEXT LOT COUNTDOWN BANNER */}
      {autoNextSeconds !== null && (
        <div className="w-full bg-gradient-to-r from-[#e7f3ec] via-[#f0f8f3] to-[#e7f3ec] text-[#0e2c1e] py-2 px-6 flex flex-wrap items-center justify-between gap-2 font-sans text-xs shadow-xs border-b border-[#b6d8c2] animate-fade-in shrink-0 z-20">
          <div className="flex items-center gap-2.5">
            <GavelIcon className="w-4 h-4 text-[#065f46]" />
            <span className="font-extrabold uppercase tracking-wider text-[#065f46]">
              LOT FINALIZED ({isSold ? `AWARDED AT ${formatLakhsAndCrores(currentBid, true)}` : "PASSED UNSOLD"})
            </span>
            <span className="bg-[#d1fae5] text-[#065f46] px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-[#6ee7b7]">
              Next Lot in {autoNextSeconds}s
            </span>
          </div>

          {(isHost || teamName.startsWith("Auctioneer - ") || roomAllowPlayerHammer || isAuctioneerBusy) && (
            <button
              onClick={() => {
                handleNextPlayer();
                setAutoNextSeconds(null);
              }}
              className="px-3 py-1 bg-gradient-to-b from-[#059669] to-[#047857] hover:from-[#10b981] hover:to-[#059669] text-white font-extrabold uppercase tracking-wider text-[11px] rounded-xl shadow-xs transition-all cursor-pointer active:translate-y-0.5 flex items-center gap-1.5"
            >
              <span>Advance Immediately</span>
              <NextTrackIcon className="w-3.5 h-3.5 text-white" />
            </button>
          )}
        </div>
      )}

      {/* Confetti on Sold */}
      {isSold && (
        <div className="z-50 pointer-events-none fixed inset-0">
          <Confetti
            width={viewport.width}
            height={viewport.height}
            recycle={false}
            numberOfPieces={250}
            colors={["#10b981", "#3b82f6", "#f59e0b", "#ffffff"]}
          />
        </div>
      )}

      {/* 🌟 3. ACTIVE VIEW CONTAINER */}
      {activeTab === "auction" && (
        <main className="flex-1 min-h-0 p-3 md:p-4 grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 overflow-hidden">
          {/* COL 1 (Left 4 Cols): Player on the Block */}
          <div className="lg:col-span-4 flex flex-col h-full min-h-0 overflow-hidden">
            <PlayerCard
              name={activePlayer.name}
              role={activePlayer.role}
              country={activePlayer.country}
              flag={activePlayer.flag}
              isOverseas={activePlayer.isOverseas}
              basePrice={activePlayer.basePrice}
              currentBid={currentBid}
              imageUrl={activePlayer.imageUrl}
              highestBidder={highestBidder}
              stats={activePlayer.stats}
              rating={activePlayer.rating}
            />
          </div>

          {/* COL 2 (Center 4 Cols): Bid Battle + Timer + Bidding Console + Bid Log */}
          <div className="lg:col-span-4 flex flex-col gap-2.5 h-full min-h-0 justify-between overflow-y-auto pr-0.5">
            <BidBattleBar
              highestBidder={highestBidder}
              currentBid={currentBid}
              basePrice={activePlayer.basePrice}
              myTeamName={teamName}
              wasOutbid={wasOutbid}
              onDismissOutbid={() => setWasOutbid(false)}
              optOutCount={optOutCount}
              isOptedOut={isOptedOut}
              onJumpBackIn={() => handleOptOut(false)}
            />
            <CircularTimer
              secondsLeft={secondsLeft}
              totalDuration={60}
              isWarning={isWarning}
              isTimeUp={isTimeUp}
            />
            <BiddingPad
              onBid={handleBid}
              onSell={handleSell}
              onNextLot={handleNextPlayer}
              onExtendTimer={handleExtendTimer}
              onResetTimer={handleResetTimer}
              status={isSold ? "sold" : isUnsold ? "unsold" : "available"}
              currentBid={currentBid}
              basePrice={activePlayer.basePrice}
              myBudget={myBudget}
              squadCount={squad.length}
              highestBidder={highestBidder}
              myTeamName={teamName}
              isHost={isHost}
              isNeutralAuctioneer={teamName.startsWith("Auctioneer - ")}
              allowPlayerHammer={roomAllowPlayerHammer}
              isOptedOut={isOptedOut}
              onOptOut={handleOptOut}
              isAuctioneerBusy={isAuctioneerBusy}
              onToggleAuctioneerBusy={handleToggleAuctioneerBusy}
              onPassGavel={handlePassGavelRandomly}
              onTogglePlayerHammer={handleTogglePlayerHammer}
              onLeaveRoom={handleLeaveRoom}
            />
            <ActivityFeed logs={activityLogs} />
          </div>

          {/* COL 3 (Right 4 Cols): Player Pool / Purses / Chat */}
          <div className="lg:col-span-4 flex flex-col h-full min-h-0 bg-gradient-to-b from-white via-[#f7faf8] to-[#edf5f0] border border-[#c6ded0] rounded-3xl p-4 shadow-[0_16px_36px_rgba(18,64,50,0.08),0_2px_8px_rgba(18,64,50,0.04)] text-[#12241b] overflow-hidden justify-between relative">
            {/* Top Hairline Sheen */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4be8c] via-[#059669] to-[#d4be8c] opacity-80" />

            {/* Panel Tab Switcher with Inset Track */}
            <div className="flex items-center gap-1 bg-[#e4eee6] p-1 rounded-2xl shadow-inner border border-[#c2dcce] shrink-0 mb-3 font-sans">
              <button
                onClick={() => setCockpitTab("pool")}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  cockpitTab === "pool"
                    ? "bg-white text-[#0e3524] shadow-sm border border-[#badbc6]"
                    : "text-[#526e5e] hover:text-[#0e2c1e]"
                }`}
              >
                Catalog ({filteredPlayers.length})
              </button>
              <button
                onClick={() => setCockpitTab("purses")}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  cockpitTab === "purses"
                    ? "bg-white text-[#0e3524] shadow-sm border border-[#badbc6]"
                    : "text-[#526e5e] hover:text-[#0e2c1e]"
                }`}
              >
                Purses ({activeCount})
              </button>
              <button
                onClick={() => setCockpitTab("chat")}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  cockpitTab === "chat"
                    ? "bg-white text-[#0e3524] shadow-sm border border-[#badbc6]"
                    : "text-[#526e5e] hover:text-[#0e2c1e]"
                }`}
              >
                Telegraph
              </button>
            </div>

            {/* TAB 1: PLAYER POOL */}
            {cockpitTab === "pool" && (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="flex gap-2 mb-2 shrink-0">
                  <input
                    type="text"
                    placeholder="Search player or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-[#f4f8f5] text-[#0e2c1e] text-xs px-3.5 py-2 rounded-xl border border-[#c4ded0] focus:outline-none focus:border-[#059669] placeholder:text-[#7d9b89] shadow-inner font-sans"
                  />
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="bg-[#f4f8f5] text-[#0e3524] text-xs px-2.5 py-2 rounded-xl border border-[#c4ded0] focus:outline-none font-sans font-medium shadow-inner cursor-pointer"
                  >
                    <option value="All" className="bg-white text-[#0e2c1e]">All Roles</option>
                    <option value="Batsman" className="bg-white text-[#0e2c1e]">Batsmen</option>
                    <option value="Bowler" className="bg-white text-[#0e2c1e]">Bowlers</option>
                    <option value="Wicket Keeper" className="bg-white text-[#0e2c1e]">WKs</option>
                    <option value="All-Rounder" className="bg-white text-[#0e2c1e]">All-Rounders</option>
                  </select>
                </div>

                {/* Scrollable Player List */}
                <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1">
                  {filteredPlayers.map((p) => {
                    const data = auctionData[p.id] || {};
                    const isActive = p.id === activePlayer.id;
                    const isSoldStatus = data.status === "sold";
                    const isUnsoldStatus = data.status === "unsold";

                    return (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                          isActive
                            ? "bg-gradient-to-b from-[#e6f4ea] to-[#d8ece0] border-[#34d399] shadow-[0_4px_16px_rgba(16,185,129,0.18)] ring-1 ring-[#10b981]/30"
                            : "bg-gradient-to-b from-white to-[#f4f8f5] border-[#cfe2d6] hover:border-[#a3caa2] hover:bg-[#eaf4ee] shadow-xs hover:-translate-y-0.5"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 truncate">
                          {p.flag ? (
                            <span className="text-sm">{p.flag}</span>
                          ) : (
                            <CricketBatIcon className="w-4 h-4 text-[#047857]" />
                          )}
                          <div className="truncate">
                            <p className="text-xs font-bold text-[#0e2c1e] truncate">{p.name}</p>
                            <p className="text-[10px] font-sans text-[#5c7567]">{p.role} • <span className="font-mono">Base {formatLakhsAndCrores(p.basePrice, true)}</span></p>
                          </div>
                        </div>

                        {isSoldStatus ? (
                          <span className="text-[10px] font-sans bg-[#e6f7ee] text-[#047857] border border-[#a7f3d0] px-2 py-0.5 rounded-md font-bold uppercase">
                            Sold
                          </span>
                        ) : isUnsoldStatus ? (
                          <span className="text-[10px] font-sans bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md font-bold uppercase">
                            Unsold
                          </span>
                        ) : isHost ? (
                          <button
                            onClick={() => selectPlayerForAuction(p)}
                            className={`text-[10px] font-sans font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                              isActive
                                ? "bg-gradient-to-b from-[#059669] to-[#047857] text-white border border-[#059669] shadow-xs flex items-center gap-1"
                                : "bg-gradient-to-b from-white to-[#eef5f0] hover:bg-[#e2efe6] text-[#0e3524] border border-[#badbc6] shadow-xs active:translate-y-0.5"
                            }`}
                          >
                            {isActive ? (
                              <>
                                <span>Active</span>
                                <StarIcon className="w-3 h-3 text-amber-300" />
                              </>
                            ) : (
                              "Nominate"
                            )}
                          </button>
                        ) : (
                          <span
                            className={`text-[10px] font-sans px-2 py-0.5 rounded-md border ${
                              isActive
                                ? "bg-[#e6f7ee] text-[#047857] border-[#a7f3d0] font-bold"
                                : "bg-[#f4f8f5] text-[#5c7567] border-[#cfe2d6]"
                            }`}
                          >
                            {isActive ? "On Block" : "Open"}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Host Next Player CTA */}
                {isHost && (
                  <div className="pt-2 mt-2 border-t border-[#cfe0d5] flex justify-end shrink-0">
                    <button
                      onClick={handleNextPlayer}
                      className="w-full py-2.5 bg-gradient-to-b from-[#059669] via-[#047857] to-[#065f46] hover:from-[#10b981] hover:to-[#047857] text-white rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all border border-[#34d399]/60 border-b-2 border-b-[#064e3b] shadow-md active:translate-y-0.5 active:border-b-0 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Next Player</span>
                      <ChevronRightIcon className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: FRANCHISE PURSES */}
            {cockpitTab === "purses" && (
              <div className="flex-1 flex flex-col min-h-0 overflow-y-auto space-y-2 pr-1">
                {Object.entries(allTeams).map(([team, data]) => {
                  const isSelf = team === teamName;
                  const isAuctioneer = team.startsWith("Auctioneer - ") || data.isNeutralAuctioneer;
                  const isRoomAuthority = data.ownerUid === hostUid;
                  const budget = data.budget ?? DEFAULT_BUDGET;
                  const squadCount = data.squad ? Object.keys(data.squad).length : 0;
                  const pctLeft = Math.max(0, Math.min(100, (budget / DEFAULT_BUDGET) * 100));

                  if (isAuctioneer) {
                    return (
                      <div
                        key={team}
                        className="p-3 rounded-2xl border border-[#e3ce9c] bg-gradient-to-b from-[#fffcf2] to-[#fef6e2] text-[#714b08] shadow-xs transition-all"
                      >
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-bold text-[#714b08] truncate flex items-center gap-1.5">
                            <CrownIcon className="w-3.5 h-3.5 text-amber-600" />
                            <span>{team.replace("Auctioneer - ", "")}</span>
                            <span className="text-[10px] font-normal text-[#8d6923]">(Auctioneer)</span>
                            {isSelf && <span className="text-[#059669] font-black">(You)</span>}
                          </span>
                          <span className="text-[9px] font-sans font-bold bg-[#fef3c7] text-[#92400e] px-2 py-0.5 rounded uppercase border border-[#f59e0b]/40">
                            Room Authority
                          </span>
                        </div>
                        <p className="text-[10px] text-[#8d6923] font-sans">
                          Dictating room bidding, nominations & gavel strikes
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={team}
                      className={`p-3 rounded-2xl border transition-all ${
                        isSelf
                          ? "bg-gradient-to-b from-[#eaf6ef] to-[#d8ece0] border-[#34d399] shadow-xs"
                          : "bg-gradient-to-b from-white to-[#f4f8f5] border-[#cfe2d6] shadow-xs"
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-bold text-[#0e2c1e] truncate flex items-center gap-1.5">
                          <span>{getFranchiseName(team)}</span>
                          {data.managerName && (
                            <span className="text-[10px] font-sans text-[#5c7567]">
                              • {data.managerName}
                            </span>
                          )}
                          {isRoomAuthority && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-sans font-bold text-[#854d0e] bg-[#fef3c7] border border-[#f59e0b]/40 px-1.5 py-0.5 rounded">
                              <CrownIcon className="w-2.5 h-2.5 text-amber-600" />
                              <span>Creator</span>
                            </span>
                          )}
                          {isSelf && <span className="text-[#059669] font-black">(You)</span>}
                        </span>
                        <span className="font-black font-mono text-sm text-[#047857]">
                          {formatLakhsAndCrores(budget, true)}
                        </span>
                      </div>
                      <div className="w-full bg-[#e2ede5] h-2 rounded-full overflow-hidden mb-1.5 border border-[#c2dcce] shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-[#059669] via-[#10b981] to-[#059669] rounded-full transition-all duration-500"
                          style={{ width: `${pctLeft}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-sans text-[#5c7567]">
                        <span>Squad: <strong className="text-[#0e2c1e]">{squadCount}/11</strong> players</span>
                        <span><strong className="text-[#047857]">{pctLeft.toFixed(0)}%</strong> remaining</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 3: CHAT */}
            {cockpitTab === "chat" && (
              <div className="flex-1 min-h-0 h-full overflow-hidden">
                <RoomChat
                  messages={chatMessages}
                  onSendMessage={handleSendMessage}
                  currentManager={teamName.split(" - ")[1] || "Manager"}
                  currentFranchise={getFranchiseName(teamName)}
                />
              </div>
            )}
          </div>
        </main>
      )}

      {/* 🌟 4. TAB 2: MY SQUAD & 2D TACTICAL PITCH */}
      {activeTab === "squad" && (
        <main className="flex-1 min-h-0 p-3 md:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 h-full overflow-hidden">
          {/* The Bench */}
          <div className="lg:col-span-4 bg-gradient-to-b from-white via-[#f7faf8] to-[#edf5f0] rounded-3xl p-5 border border-[#c6ded0] shadow-[0_16px_36px_rgba(18,64,50,0.08),0_2px_8px_rgba(18,64,50,0.04)] text-[#12241b] flex flex-col h-full min-h-0 overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4be8c] via-[#059669] to-[#d4be8c] opacity-80" />
            <h3 className={`text-sm font-bold uppercase tracking-wider text-[#0e2c1e] mb-3 border-b border-[#cfe0d5] pb-2 ${outfit.className}`}>
              Squad Reserves / Bench ({bench.length})
            </h3>
            {bench.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-[#5c7567] text-xs font-mono">
                <p>Reserves bench is empty</p>
                <p className="text-[11px] text-[#7d9b89] mt-0.5">Purchased players will arrive here</p>
              </div>
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
                {bench.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-white border border-[#cce1d4] flex items-center justify-between shadow-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {p.flag ? (
                        <span className="text-sm">{p.flag}</span>
                      ) : (
                        <CricketBatIcon className="w-4 h-4 text-[#047857]" />
                      )}
                      <div className="truncate">
                        <p className="text-xs font-bold text-[#0e2c1e] truncate">{p.name}</p>
                        <p className="text-[10px] font-sans text-[#5c7567]">{p.role} • <span className="font-mono">{formatLakhsAndCrores(p.boughtFor, true)}</span></p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => togglePlayingStatus(p)}
                        className="bg-gradient-to-b from-[#059669] to-[#047857] hover:from-[#10b981] hover:to-[#047857] text-white text-[10px] font-sans font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer border border-[#059669] shadow-xs"
                      >
                        + XI
                      </button>
                      <button
                        onClick={() => handleReleasePlayer(p)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-sans font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Release
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2D Tactical Field */}
          <div className="lg:col-span-8 h-full min-h-0 overflow-hidden flex flex-col">
            <CricketPitch
              playingXI={playingXI}
              captainId={captainId}
              viceCaptainId={viceCaptainId}
              onSetCaptain={(id) => setCaptainId(captainId === id ? null : id)}
              onSetViceCaptain={(id) => setViceCaptainId(viceCaptainId === id ? null : id)}
              onBenchPlayer={togglePlayingStatus}
            />
          </div>
        </main>
      )}

      {/* 🌟 5. TAB 3: DEDICATED FULL-SCREEN LIVE CHAT */}
      {activeTab === "chat" && (
        <main className="flex-1 min-h-0 p-3 md:p-6 max-w-3xl mx-auto w-full h-full overflow-hidden flex flex-col">
          <RoomChat
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            currentManager={teamName.split(" - ")[1] || "Manager"}
            currentFranchise={getFranchiseName(teamName)}
          />
        </main>
      )}

      {/* Sound Test Diagnostics Modal */}
      <SoundTestModal
        isOpen={isSoundTestOpen}
        onClose={() => setIsSoundTestOpen(false)}
        isMuted={isMuted}
        onToggleMute={toggleSound}
      />
    </div>
  );
}