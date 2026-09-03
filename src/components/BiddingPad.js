"use client";

import { Oswald } from "next/font/google";

const oswald = Oswald({ subsets: ["latin"], weight: ["600", "700"] });

const BID_AMOUNTS = [5, 10, 20, 50, 100];

export default function BiddingPad({
  onBid,
  onSell,
  onPass,
  onNextLot,
  onExtendTimer,
  onResetTimer,
  status,
  currentBid = 0,
  myBudget = 10000,
  highestBidder = "",
  myTeamName = "",
  isHost = false,
  isNeutralAuctioneer = false,
}) {
  const isLocked = status === "sold" || status === "unsold";
  const isWinning = highestBidder && highestBidder === myTeamName;
  const hasBids = highestBidder && highestBidder !== "No Bids Yet";

  return (
    <div className="relative w-full bg-gradient-to-b from-white via-[#fdfcf9] to-[#f8f6f0] border border-[#dcd6c8] rounded-3xl p-4.5 flex flex-col justify-between select-none shadow-[0_2px_4px_rgba(0,0,0,0.02),0_10px_24px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] text-[#121417]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e8e2d4]">
          <div>
            <div className="flex items-center gap-2">
              <h4 className={`text-sm font-bold uppercase tracking-wider text-[#121417] ${oswald.className}`}>
                {isNeutralAuctioneer ? "Auctioneer Gavel Console" : "Tactile Bid Pad"}
              </h4>
              {isHost && (
                <span className="text-[10px] bg-gradient-to-b from-[#fbf5e6] to-[#eddcb7] text-[#5c4308] border border-[#d4be8c] px-2.5 py-0.5 rounded-lg font-mono font-black uppercase flex items-center gap-1 shadow-2xs">
                  <span>👑</span>
                  <span>Room Authority</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#555a60] mt-0.5">
              {isNeutralAuctioneer ? (
                <span className="text-amber-900 font-bold">You dictate the room, lots & gavel strikes</span>
              ) : isWinning ? (
                <span className="text-[#124032] font-bold flex items-center gap-1">
                  <span>✓</span>
                  <span>You hold the highest bid!</span>
                </span>
              ) : (
                "Raise paddle increment to outbid opposing franchises"
              )}
            </p>
          </div>

          {!isNeutralAuctioneer ? (
            <div className="text-right bg-[#f5f2e9] border border-[#dfd9cb] px-3 py-1 rounded-xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
              <span className="text-[9px] uppercase font-mono text-[#767c84] block font-bold leading-none">
                YOUR PURSE
              </span>
              <span className="text-base font-bold font-mono text-[#124032] leading-none mt-0.5">
                ₹{(myBudget / 100).toFixed(2)} Cr
              </span>
            </div>
          ) : (
            <div className="text-right bg-gradient-to-b from-[#fbf5e6] to-[#eddcb7] border border-[#d4be8c] px-3 py-1 rounded-xl shadow-2xs">
              <span className="text-[9px] uppercase font-mono text-[#5c4308] block font-black leading-none">
                AUTHORITY
              </span>
              <span className="text-xs font-black font-mono text-[#5c4308] leading-none mt-0.5">
                Gavel Master
              </span>
            </div>
          )}
        </div>

        {/* 3D Physical Quick Bid Buttons (For Bidders) */}
        {!isNeutralAuctioneer && (
          <div className="mt-3">
            <span className="text-[10px] uppercase font-mono font-bold text-[#767c84] tracking-wider block mb-2">
              RAISE PADDLE INCREMENT (+LAKHS)
            </span>
            <div className="grid grid-cols-5 gap-2">
              {BID_AMOUNTS.map((amount) => {
                const nextTotal = currentBid + amount;
                const canAfford = nextTotal <= myBudget;
                const disabled = isLocked || !canAfford || isWinning;

                return (
                  <button
                    key={amount}
                    onClick={() => onBid(amount)}
                    disabled={disabled}
                    className="group relative bg-gradient-to-b from-white via-[#faf9f5] to-[#f0ece1] hover:to-[#e8e2d4] text-[#121417] p-2.5 rounded-2xl flex flex-col items-center justify-center transition-all border border-[#d8d1c0] border-b-[3px] border-b-[#b8af9c] disabled:opacity-30 disabled:cursor-not-allowed active:translate-y-0.5 active:border-b-[1px] cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.04)]"
                  >
                    <span className="text-sm font-bold font-mono leading-none text-[#124032] group-hover:scale-105 transition-transform">
                      +{amount}L
                    </span>
                    <span className="text-[9px] text-[#767c84] mt-1 font-mono font-semibold">
                      ₹{(nextTotal / 100).toFixed(2)}Cr
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 🌟 3D BEVELED HOST AUCTIONEER CONSOLE */}
      <div className="pt-3 mt-3 border-t border-[#e8e2d4] flex flex-col gap-2">
        {isHost ? (
          <div className="space-y-2">
            {/* Heavy Cast-Iron / Brass Gavel Strike Action */}
            <button
              onClick={onSell}
              disabled={isLocked}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isLocked
                  ? "bg-[#e5e0d3] text-[#8c8577] cursor-not-allowed border border-[#d0c9b8]"
                  : hasBids
                  ? "bg-gradient-to-b from-[#185341] to-[#0e3328] hover:from-[#1b5e4a] hover:to-[#103a2e] text-white border border-[#1b5e4a] border-b-4 border-b-[#071c15] shadow-[0_6px_16px_rgba(18,64,50,0.3)] active:translate-y-1 active:border-b-0"
                  : "bg-gradient-to-b from-[#92400e] to-[#712b06] hover:from-[#a14b10] hover:to-[#833309] text-white border border-[#a14b10] border-b-4 border-b-[#451802] shadow-[0_6px_16px_rgba(146,64,14,0.3)] active:translate-y-1 active:border-b-0"
              }`}
            >
              <span className="text-base">🔨</span>
              <span className="drop-shadow-2xs">
                {status === "sold"
                  ? "Player Sold (Gavel Struck)"
                  : status === "unsold"
                  ? "Player Passed (Unsold)"
                  : hasBids
                  ? `Hammer Down (Award to ${highestBidder.split(" - ")[0]} at ₹${(currentBid / 100).toFixed(2)} Cr)`
                  : "Pass (Mark Unsold)"}
              </span>
            </button>

            {/* Secondary Precision Tactile Controls */}
            <div className="grid grid-cols-3 gap-2 pt-0.5 text-[11px] font-mono">
              <button
                onClick={onExtendTimer}
                disabled={isLocked}
                className="py-2.5 px-2 bg-gradient-to-b from-white to-[#f4f1e8] hover:to-[#ece6d8] text-[#121417] rounded-xl border border-[#d8d1c0] border-b-2 border-b-[#b8af9c] transition-all disabled:opacity-40 cursor-pointer text-center truncate font-bold shadow-2xs active:translate-y-0.5 active:border-b"
                title="Add 15s Fair Warning"
              >
                ⏱️ +15s Clock
              </button>

              <button
                onClick={onResetTimer}
                className="py-2.5 px-2 bg-gradient-to-b from-white to-[#f4f1e8] hover:to-[#ece6d8] text-[#121417] rounded-xl border border-[#d8d1c0] border-b-2 border-b-[#b8af9c] transition-all cursor-pointer text-center truncate font-bold shadow-2xs active:translate-y-0.5 active:border-b"
                title="Reset 60s Clock"
              >
                🔄 Reset Clock
              </button>

              <button
                onClick={onNextLot}
                className="py-2.5 px-2 bg-gradient-to-b from-[#eef7f2] to-[#d8ede1] hover:to-[#c8e5d3] text-[#124032] border border-[#b2ddc4] border-b-2 border-b-[#8ec7a5] rounded-xl transition-all cursor-pointer text-center truncate font-black shadow-2xs active:translate-y-0.5 active:border-b"
                title="Nominate Next Lot from Catalog"
              >
                ⏭️ Next Lot
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-b from-[#faf8f2] to-[#f0ece1] border border-[#dcd6c8] text-center text-xs font-mono text-[#555a60] shadow-[inset_0_1px_3px_rgba(0,0,0,0.03)]">
            {status === "sold" ? (
              <span className="text-[#124032] font-black">Player Sold by Auctioneer Gavel</span>
            ) : status === "unsold" ? (
              <span className="text-rose-700 font-black">Player Passed Unsold by Auctioneer</span>
            ) : isWinning ? (
              <span className="text-[#124032] font-black">You currently hold the winning bid!</span>
            ) : hasBids ? (
              <span className="text-[#121417] font-bold">Awaiting Auctioneer's Gavel</span>
            ) : (
              <span className="text-[#8c8577]">Waiting for opening nomination</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}