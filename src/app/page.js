"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { ref, onValue, set, get, push, runTransaction } from "firebase/database";
import { db, ensureAuthUser } from "@/lib/firebase";
import Confetti from "react-confetti";
import { Inter, Oswald } from "next/font/google";

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
import { SoundSpeakerIcon, AudioEqualizer } from "@/components/AuctionIcons";
import { playersList } from "@/data/players";
import { sounds } from "@/lib/soundEffects";
import { formatLakhsAndCrores } from "@/lib/formatCurrency";

const oswald = Oswald({ subsets: ["latin"], weight: ["400", "700"] });
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
    const unsubHammer = onValue(ref(db, `rooms/${roomId}/allowPlayerHammer`), (snap) => {
      if (snap.exists()) setRoomAllowPlayerHammer(!!snap.val());
    });
    const unsubRotate = onValue(ref(db, `rooms/${roomId}/rotateAuctioneer`), (snap) => {
      if (snap.exists()) setRotateAuctioneer(!!snap.val());
    });
    const unsubBusy = onValue(ref(db, `rooms/${roomId}/auctioneerBusy`), (snap) => {
      if (snap.exists()) setIsAuctioneerBusy(!!snap.val());
      else setIsAuctioneerBusy(false);
    });
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
      set(ref(db, `rooms/${roomId}/teams/${teamName}/lastActiveAt`), Date.now());
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
      subtext,
      time: nowTime,
      timestamp: Date.now(),
    };
    push(ref(db, `rooms/${roomId}/global/activityLog`), logItem);
  }, [roomId]);

  const handleSendMessage = useCallback((msgText) => {
    if (!msgText || !teamName) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const chatItem = {
      sender: teamName.split(" - ")[1] || "Manager",
      franchise: getFranchiseName(teamName),
      message: msgText.slice(0, 150),
      time: nowTime,
      timestamp: Date.now(),
    };
    push(ref(db, `rooms/${roomId}/chat`), chatItem);
  }, [roomId, teamName]);

  const startNewTimer = useCallback(() => {
    const target = Date.now() + TIMER_DURATION_MS;
    set(ref(db, `rooms/${roomId}/global/timerEndsAt`), target);
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

    const unsubs = [
      onValue(ref(db, `rooms/${roomId}/hostUid`), (s) => setHostUid(s.exists() ? s.val() : null)),
      onValue(ref(db, `rooms/${roomId}/capacity`), (s) => s.exists() && setRoomCapacity(s.val())),
      onValue(ref(db, `rooms/${roomId}/global/activePlayerId`), (s) => s.exists() && setActivePlayerId(s.val())),
      onValue(ref(db, `rooms/${roomId}/global/timerEndsAt`), (s) => setTimerEndsAt(s.exists() ? s.val() : null)),
      onValue(ref(db, `rooms/${roomId}/auction`), (s) => s.exists() && setAuctionData(s.val())),
      onValue(ref(db, `rooms/${roomId}/teams`), (s) => s.exists() && setAllTeams(s.val())),
      onValue(ref(db, `rooms/${roomId}/auction/${activePlayer.id}/optOuts`), (s) => {
        setOptOuts(s.exists() ? s.val() : {});
      }),
      onValue(ref(db, `rooms/${roomId}/auction/${activePlayer.id}/currentBid`), (s) => {
        const val = s.val() !== null ? s.val() : activePlayer.basePrice;
        if (prevBidRef.current > 0 && val > prevBidRef.current) {
          sounds.playBid();
        }
        prevBidRef.current = val;
        setCurrentBid(val);
      }),
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
      }),
      onValue(ref(db, `rooms/${roomId}/teams/${teamName}/budget`), (s) =>
        setMyBudget(s.val() !== null ? s.val() : DEFAULT_BUDGET)
      ),
      onValue(ref(db, `rooms/${roomId}/teams/${teamName}/squad`), (s) =>
        setSquad(s.exists() ? Object.values(s.val()) : [])
      ),
      onValue(ref(db, `rooms/${roomId}/global/activityLog`), (s) => {
        if (s.exists()) {
          const raw = Object.entries(s.val()).map(([key, value]) => ({ id: key, ...value }));
          raw.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          setActivityLogs(raw.slice(0, 25));
        }
      }),
      onValue(ref(db, `rooms/${roomId}/chat`), (s) => {
        if (s.exists()) {
          const raw = Object.entries(s.val()).map(([key, value]) => ({ id: key, ...value }));
          raw.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
          setChatMessages(raw.slice(-30));
        }
      }),
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
      className={`min-h-screen lg:h-screen lg:max-h-screen flex flex-col bg-[#f6f5ef] bg-[radial-gradient(#ded8cb_1px,transparent_1px)] [background-size:22px_22px] text-[#121417] overflow-y-auto lg:overflow-hidden relative select-none ${inter.className}`}
    >
      {/* 🌟 1. LUXURY EDITORIAL SPORTS HEADER */}
      <header className="py-2.5 px-4 md:px-6 bg-white/95 backdrop-blur-md border-b border-[#dcd6c8] flex flex-wrap items-center justify-between gap-3 shrink-0 z-20 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        {/* Left: Brand + Room Code + Role */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={handleLeaveRoom}
            title="Leave Room"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#185341] to-[#0e3328] flex items-center justify-center text-white font-black text-sm shadow-xs border border-[#1b5e4a] group-hover:scale-105 transition-transform">
              🏏
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-xl font-black tracking-tight uppercase text-[#121417] group-hover:text-[#124032] transition-colors leading-none ${oswald.className}`}>
                  V-RUN 11
                </span>
                <span className="text-[9px] font-mono bg-gradient-to-b from-[#fbf5e6] to-[#eddcb7] text-[#5c4308] border border-[#d4be8c] px-1.5 py-0.2 rounded font-black uppercase tracking-wider">
                  PRO
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#767c84] uppercase tracking-wider leading-none mt-0.5">
                IPL Premier Draft
              </p>
            </div>
          </div>

          <div className="hidden sm:block h-6 w-[1px] bg-[#d8d1c0] mx-1" />

          {/* Room Code & Share Plate */}
          <div className="flex items-center gap-2 bg-gradient-to-b from-white via-[#faf8f3] to-[#f2ede0] border border-[#d8d1c0] px-3 py-1 rounded-2xl shadow-2xs text-xs font-mono">
            <span className="text-[#8c8577] text-[10px] font-black">ARENA:</span>
            <span className="font-black text-[#121417] tracking-wider">{roomId}</span>
            <button
              onClick={() => {
                const url = `${window.location.origin}/?room=${encodeURIComponent(roomId)}`;
                navigator.clipboard.writeText(url);
                alert(`📋 Invite link copied to clipboard!\nShare this with your friends:\n${url}`);
              }}
              className="text-[11px] font-bold text-[#124032] hover:text-emerald-800 hover:underline ml-1 cursor-pointer"
              title="Copy Room Link"
            >
              📋 Copy
            </button>
            <button
              onClick={() => {
                const url = `${window.location.origin}/?room=${encodeURIComponent(roomId)}`;
                const msg = encodeURIComponent(`🏏 Join my Live IPL Fantasy Auction Draft!\n🏛️ Room PIN: ${roomId}\n👉 Tap to pick your franchise team: ${url}`);
                window.open(`https://wa.me/?text=${msg}`, "_blank");
              }}
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline ml-1 cursor-pointer"
              title="Share via WhatsApp"
            >
              💬 WhatsApp
            </button>
          </div>

          {/* Host / Room Authority Badge & Controls */}
          {isHost ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 bg-gradient-to-b from-[#fbf5e6] to-[#eddcb7] text-[#5c4308] border border-[#d4be8c] px-2.5 py-1 rounded-2xl text-xs font-mono font-black shadow-2xs">
                <span>👑</span>
                <span>Host</span>
              </span>

              <div className="flex items-center gap-1 bg-[#f4f1e8] p-1 rounded-2xl border border-[#d8d1c0] text-[10px] font-mono flex-wrap">
                {/* ⏳ Busy / Step Away Toggle */}
                <button
                  onClick={handleToggleAuctioneerBusy}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer shadow-2xs border ${
                    isAuctioneerBusy
                      ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-700 animate-pulse"
                      : "bg-white hover:bg-amber-50 text-amber-900 border-amber-300"
                  }`}
                  title={
                    isAuctioneerBusy
                      ? "You are marked busy. Tap to reclaim gavel authority"
                      : "Step away temporarily. Hands hammer authority to the room until you return."
                  }
                >
                  {isAuctioneerBusy ? "✅ I'm Back" : "⏳ Busy"}
                </button>

                <button
                  onClick={handleTogglePlayerHammer}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-colors cursor-pointer ${
                    roomAllowPlayerHammer
                      ? "bg-emerald-100 text-[#124032] border border-emerald-300"
                      : "text-[#767c84] hover:text-[#121417]"
                  }`}
                  title="Allow non-host players to strike the hammer"
                >
                  🔨 Hammer: {roomAllowPlayerHammer ? "ON" : "OFF"}
                </button>

                <button
                  onClick={handleToggleRotateAuctioneer}
                  className={`hidden sm:inline-block px-2 py-0.5 rounded-lg font-bold transition-colors cursor-pointer ${
                    rotateAuctioneer
                      ? "bg-purple-100 text-purple-800 border border-purple-300"
                      : "text-[#767c84] hover:text-[#121417]"
                  }`}
                  title="Randomly rotate auctioneer role to another player each round"
                >
                  🎲 Rotate: {rotateAuctioneer ? "ON" : "OFF"}
                </button>

                <button
                  onClick={handlePassGavelRandomly}
                  className="px-2 py-0.5 rounded-lg bg-white border border-[#d8d1c0] text-[#5c4308] hover:bg-[#faf8f4] font-bold transition-colors cursor-pointer shadow-2xs"
                  title="Pass gavel authority to another player now"
                >
                  Pass 🎲
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="hidden md:inline-flex items-center gap-1.5 bg-[#f4f1e8] text-[#555a60] border border-[#dcd6c8] px-3 py-1.5 rounded-2xl text-xs font-mono font-bold">
                <span>👑</span>
                <span>Authority: {allTeams[Object.keys(allTeams).find((k) => allTeams[k].ownerUid === hostUid)]?.managerName || "Host"}</span>
              </span>
              {isAuctioneerBusy ? (
                <span className="text-[10px] font-mono bg-amber-500 text-white px-2 py-0.5 rounded-xl font-bold animate-pulse">
                  ⏳ Auctioneer Busy (Hammer Open)
                </span>
              ) : roomAllowPlayerHammer ? (
                <span className="text-[10px] font-mono bg-emerald-100 text-[#124032] border border-emerald-300 px-2 py-0.5 rounded-xl font-bold">
                  🔨 Hammer Open to All
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* Center: Main View Tabs with Inset Physical Track */}
        <div className="flex items-center gap-1.5 bg-[#e8e4da] p-1.5 rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)] border border-[#d8d1c0]">
          <button
            onClick={() => setActiveTab("auction")}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "auction"
                ? "bg-gradient-to-b from-white to-[#f8f6f0] text-[#121417] shadow-[0_2px_5px_rgba(0,0,0,0.08)] border border-[#d8d1c0]"
                : "text-[#656b73] hover:text-[#121417]"
            }`}
          >
            Auction Floor
          </button>
          {!teamName.startsWith("Auctioneer - ") && (
            <button
              onClick={() => setActiveTab("squad")}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "squad"
                  ? "bg-gradient-to-b from-white to-[#f8f6f0] text-[#121417] shadow-[0_2px_5px_rgba(0,0,0,0.08)] border border-[#d8d1c0]"
                  : "text-[#656b73] hover:text-[#121417]"
              }`}
            >
              My Squad ({squad.length}/11)
            </button>
          )}
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "chat"
                ? "bg-gradient-to-b from-white to-[#f8f6f0] text-[#121417] shadow-[0_2px_5px_rgba(0,0,0,0.08)] border border-[#d8d1c0]"
                : "text-[#656b73] hover:text-[#121417]"
            }`}
          >
            Telegraph
          </button>
        </div>

        {/* Right: Purse + Manager Count + Mute + Exit */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block bg-gradient-to-b from-white via-[#faf8f3] to-[#f2ede0] border border-[#d8d1c0] px-3 py-1 rounded-2xl shadow-2xs">
            <span className="text-[9px] uppercase font-mono text-[#8c8577] block font-bold leading-none">
              Franchises
            </span>
            <span className="text-xs font-black font-mono text-[#121417] mt-0.5">
              {activeCount}/{roomCapacity}
            </span>
          </div>

          {teamName.startsWith("Auctioneer - ") ? (
            <div className="text-right bg-gradient-to-b from-[#fbf5e6] to-[#eddcb7] border-2 border-[#d4be8c] px-4 py-1 rounded-2xl shadow-2xs">
              <span className="text-[9px] uppercase font-mono text-[#5c4308] block font-black leading-none">
                Role
              </span>
              <span className="text-xs font-black font-mono text-[#5c4308] leading-none">
                Auctioneer
              </span>
            </div>
          ) : (
            <div className="text-right bg-gradient-to-b from-white via-[#fbf9f4] to-[#f2ede0] border-2 border-[#d0c6ad] px-4 py-1 rounded-2xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-end gap-1">
                <span className="text-[9px] uppercase font-mono text-[#8c8577] block font-bold leading-none">
                  Purse
                </span>
                {isHost && (
                  <span className="text-[8px] font-mono bg-amber-100 text-[#5c4308] px-1 rounded font-black">
                    Host & Gavel
                  </span>
                )}
              </div>
              <span className="text-sm font-black font-mono text-[#124032] leading-none mt-0.5 block">
                {formatLakhsAndCrores(myBudget, true)}
              </span>
            </div>
          )}

          {/* Audio Controls & SFX Test */}
          <div className="flex items-center gap-1.5 bg-gradient-to-b from-white to-[#f4f1e8] border border-[#d8d1c0] p-1 rounded-2xl shadow-2xs">
            <button
              onClick={toggleSound}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                isMuted ? "text-slate-400 hover:text-slate-600" : "text-[#124032] hover:text-emerald-800"
              }`}
              title={isMuted ? "Unmute Broadcast Audio" : "Mute Broadcast Audio"}
            >
              <SoundSpeakerIcon isMuted={isMuted} className="w-4 h-4" />
              <AudioEqualizer isMuted={isMuted} className="hidden sm:flex items-end gap-0.5 h-3" />
            </button>
            <button
              onClick={() => setIsSoundTestOpen(true)}
              className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold text-[#555a60] hover:text-[#121417] bg-[#f0ece0] hover:bg-[#e4ded0] transition-colors cursor-pointer border border-[#dfd9cb]"
              title="Test Web Audio Sound Synthesizer"
            >
              SFX Test
            </button>
          </div>

          <button
            onClick={handleLeaveRoom}
            className="px-3.5 py-1.5 bg-gradient-to-b from-rose-50 to-rose-100 hover:to-rose-200 text-rose-800 border border-rose-300 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-2xs active:translate-y-0.5"
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
        <div className="w-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white py-2 px-4 md:px-6 flex flex-wrap items-center justify-between gap-2 font-mono text-xs shadow-md border-b border-amber-500 animate-fade-in shrink-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-sm">⏳</span>
            <span className="font-black uppercase tracking-wider">
              AUCTIONEER IS BUSY / STEPPED AWAY
            </span>
            <span className="bg-black/25 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-white/20">
              Hammer is open to all franchise managers!
            </span>
          </div>

          {isHost && (
            <button
              onClick={handleToggleAuctioneerBusy}
              className="px-3 py-1 bg-white hover:bg-amber-50 text-amber-900 font-black uppercase tracking-wider text-[11px] rounded-xl shadow-xs transition-all cursor-pointer active:translate-y-0.5"
            >
              ✅ I'm Back (Reclaim Gavel)
            </button>
          )}
        </div>
      )}

      {/* 🌟 AUTO-NEXT LOT COUNTDOWN BANNER */}
      {autoNextSeconds !== null && (
        <div className="w-full bg-gradient-to-r from-[#185341] via-[#124032] to-[#0e3328] text-white py-2 px-6 flex flex-wrap items-center justify-between gap-2 font-mono text-xs shadow-md border-b border-[#1b5e4a] animate-fade-in shrink-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-sm">🔨</span>
            <span className="font-black uppercase tracking-wider">
              LOT FINALIZED ({isSold ? `AWARDED AT ${formatLakhsAndCrores(currentBid, true)}` : "PASSED UNSOLD"})
            </span>
            <span className="bg-white/15 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-white/20">
              Next Lot in {autoNextSeconds}s
            </span>
          </div>

          {(isHost || teamName.startsWith("Auctioneer - ") || roomAllowPlayerHammer || isAuctioneerBusy) && (
            <button
              onClick={() => {
                handleNextPlayer();
                setAutoNextSeconds(null);
              }}
              className="px-3 py-1 bg-white hover:bg-emerald-50 text-[#124032] font-black uppercase tracking-wider text-[11px] rounded-xl shadow-xs transition-all cursor-pointer active:translate-y-0.5"
            >
              Advance Immediately ⏭️
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
          <div className="lg:col-span-4 flex flex-col h-full min-h-0 bg-gradient-to-b from-white via-[#fdfcf9] to-[#f8f6f0] border border-[#dcd6c8] rounded-3xl p-4.5 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_10px_24px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] text-[#121417] overflow-hidden justify-between">
            {/* Panel Tab Switcher with Inset Track */}
            <div className="flex items-center gap-1 bg-[#e8e4da] p-1 rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-[#d8d1c0] shrink-0 mb-3 font-mono">
              <button
                onClick={() => setCockpitTab("pool")}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  cockpitTab === "pool"
                    ? "bg-gradient-to-b from-white to-[#f8f6f0] text-[#121417] shadow-[0_2px_4px_rgba(0,0,0,0.06)] border border-[#d8d1c0]"
                    : "text-[#656b73] hover:text-[#121417]"
                }`}
              >
                Catalog ({filteredPlayers.length})
              </button>
              <button
                onClick={() => setCockpitTab("purses")}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  cockpitTab === "purses"
                    ? "bg-gradient-to-b from-white to-[#f8f6f0] text-[#121417] shadow-[0_2px_4px_rgba(0,0,0,0.06)] border border-[#d8d1c0]"
                    : "text-[#656b73] hover:text-[#121417]"
                }`}
              >
                Purses ({activeCount})
              </button>
              <button
                onClick={() => setCockpitTab("chat")}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  cockpitTab === "chat"
                    ? "bg-gradient-to-b from-white to-[#f8f6f0] text-[#121417] shadow-[0_2px_4px_rgba(0,0,0,0.06)] border border-[#d8d1c0]"
                    : "text-[#656b73] hover:text-[#121417]"
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
                    className="flex-1 bg-white text-[#121417] text-xs px-3.5 py-2 rounded-xl border border-[#d8d1c0] focus:outline-none focus:border-[#124032] placeholder:text-[#9ca3af] shadow-2xs"
                  />
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="bg-white text-[#121417] text-xs px-2.5 py-2 rounded-xl border border-[#d8d1c0] focus:outline-none font-mono shadow-2xs"
                  >
                    <option value="All">All Roles</option>
                    <option value="Batsman">Batsmen</option>
                    <option value="Bowler">Bowlers</option>
                    <option value="Wicket Keeper">WKs</option>
                    <option value="All-Rounder">All-Rounders</option>
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
                            ? "bg-gradient-to-b from-[#eef7f2] to-[#d8ede1] border-[#7ec499] shadow-xs"
                            : "bg-gradient-to-b from-white to-[#f7f5ee] border-[#dfd9cb] hover:to-[#eee9dc] shadow-2xs hover:-translate-y-0.5"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 truncate">
                          <span className="text-sm">{p.flag}</span>
                          <div className="truncate">
                            <p className="text-xs font-bold text-[#121417] truncate">{p.name}</p>
                            <p className="text-[10px] font-mono text-[#767c84]">{p.role} • Base {formatLakhsAndCrores(p.basePrice, true)}</p>
                          </div>
                        </div>

                        {isSoldStatus ? (
                          <span className="text-[10px] font-mono bg-emerald-100 text-[#124032] border border-emerald-300 px-2 py-0.5 rounded-md font-black uppercase">
                            Sold
                          </span>
                        ) : isUnsoldStatus ? (
                          <span className="text-[10px] font-mono bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-md font-black uppercase">
                            Unsold
                          </span>
                        ) : isHost ? (
                          <button
                            onClick={() => selectPlayerForAuction(p)}
                            className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                              isActive
                                ? "bg-gradient-to-b from-[#185341] to-[#0e3328] text-white border border-[#1b5e4a] shadow-xs"
                                : "bg-white hover:bg-[#124032] hover:text-white text-[#121417] border border-[#d8d1c0] shadow-2xs active:translate-y-0.5"
                            }`}
                          >
                            {isActive ? "Active ★" : "Nominate"}
                          </button>
                        ) : (
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                              isActive
                                ? "bg-emerald-100 text-[#124032] border-emerald-300 font-bold"
                                : "bg-white text-[#767c84] border-[#ded8cb]"
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
                  <div className="pt-2 mt-2 border-t border-[#e8e2d4] flex justify-end shrink-0">
                    <button
                      onClick={handleNextPlayer}
                      className="w-full py-2.5 bg-gradient-to-b from-[#185341] to-[#0e3328] hover:to-[#09241c] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all border border-[#1b5e4a] border-b-2 border-b-[#071c15] shadow-xs active:translate-y-0.5 active:border-b-0 cursor-pointer"
                    >
                      Next Player ➝
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
                        className="p-3 rounded-2xl border-2 border-[#d4be8c] bg-gradient-to-b from-[#fbf5e6] via-[#f7ecd1] to-[#eddcb7] text-[#5c4308] shadow-xs transition-all"
                      >
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-bold text-[#5c4308] truncate flex items-center gap-1.5">
                            <span>👑</span>
                            <span>{team.replace("Auctioneer - ", "")}</span>
                            <span className="text-[10px] font-normal opacity-80">(Auctioneer)</span>
                            {isSelf && <span className="text-[#124032] font-black">(You)</span>}
                          </span>
                          <span className="text-[9px] font-mono font-black bg-[#5c4308]/15 text-[#5c4308] px-2 py-0.5 rounded uppercase border border-[#5c4308]/20">
                            Room Authority
                          </span>
                        </div>
                        <p className="text-[10px] text-[#71540d] font-mono">
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
                          ? "bg-gradient-to-b from-[#f0f7f4] to-[#e4f1eb] border-[#92c5ab] shadow-xs"
                          : "bg-gradient-to-b from-white to-[#f7f5ee] border-[#dfd9cb] shadow-2xs"
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-bold text-[#121417] truncate flex items-center gap-1.5">
                          <span>{getFranchiseName(team)}</span>
                          {data.managerName && (
                            <span className="text-[10px] font-mono text-[#767c84]">
                              • {data.managerName}
                            </span>
                          )}
                          {isRoomAuthority && (
                            <span className="text-[9px] font-mono font-black text-[#5c4308] bg-[#fbf5e6] border border-[#d4be8c] px-1.5 rounded">
                              👑 Creator
                            </span>
                          )}
                          {isSelf && <span className="text-[#124032] font-black">(You)</span>}
                        </span>
                        <span className="font-black font-mono text-sm text-[#124032]">
                          {formatLakhsAndCrores(budget, true)}
                        </span>
                      </div>
                      <div className="w-full bg-[#e8e2d4] h-2 rounded-full overflow-hidden mb-1.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
                        <div
                          className="h-full bg-gradient-to-r from-[#185341] to-[#258266] rounded-full transition-all duration-500"
                          style={{ width: `${pctLeft}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-[#767c84]">
                        <span>Squad: {squadCount}/11 players</span>
                        <span>{pctLeft.toFixed(0)}% remaining</span>
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
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-black/10 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_10px_20px_rgba(0,0,0,0.04)] text-[#121417] flex flex-col h-full min-h-0 overflow-hidden">
            <h3 className={`text-sm font-bold uppercase tracking-wider text-[#121417] mb-3 border-b border-black/10 pb-2 ${oswald.className}`}>
              Squad Reserves / Bench ({bench.length})
            </h3>
            {bench.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-[#767c84] text-xs font-mono">
                <p>Reserves bench is empty</p>
                <p className="text-[11px] text-[#9ca3af] mt-0.5">Purchased players will arrive here</p>
              </div>
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
                {bench.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-[#faf8f4] border border-black/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-sm">{p.flag}</span>
                      <div className="truncate">
                        <p className="text-xs font-bold text-[#121417] truncate">{p.name}</p>
                        <p className="text-[10px] font-mono text-[#767c84]">{p.role} • {formatLakhsAndCrores(p.boughtFor, true)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => togglePlayingStatus(p)}
                        className="bg-[#124032] hover:bg-[#0c2f24] text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-xs"
                      >
                        + XI
                      </button>
                      <button
                        onClick={() => handleReleasePlayer(p)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-mono font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer"
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