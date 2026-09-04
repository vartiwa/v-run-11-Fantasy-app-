// Standardized Lakhs & Crores Currency Formatter for IPL Auction
// Marquee: 2 Cr (200L), Senior: 1 Cr (100L), Emerging: 50 Lakhs (50L)

/**
 * Formats a value in Lakhs into human-readable IPL auction currency (Crores & Lakhs).
 * Examples:
 *   formatLakhsAndCrores(200, true)   => "₹2 Cr"
 *   formatLakhsAndCrores(200, false)  => "₹2 Crores"
 *   formatLakhsAndCrores(1450, true)  => "₹14.5 Cr"
 *   formatLakhsAndCrores(50, true)    => "₹50L"
 *   formatLakhsAndCrores(50, false)   => "₹50 Lakhs"
 *   formatLakhsAndCrores(10000, true) => "₹100 Cr"
 */
export const formatLakhsAndCrores = (lakhs, compact = false) => {
  if (lakhs === null || lakhs === undefined || isNaN(Number(lakhs))) return "₹0";
  const num = Number(lakhs);

  if (num === 0) {
    return compact ? "₹0L" : "₹0 Lakhs";
  }

  if (num >= 100) {
    const cr = num / 100;
    const formatted = cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2).replace(/\.?0+$/, "");
    return compact ? `₹${formatted} Cr` : `₹${formatted} Crore${cr > 1 ? "s" : ""}`;
  }

  return compact ? `₹${num}L` : `₹${num} Lakhs`;
};

/**
 * Format a positive increment (e.g. 25 => "+25L", 100 => "+1 Cr")
 */
export const formatIncrement = (amount) => {
  if (!amount || isNaN(Number(amount))) return "+0L";
  const num = Number(amount);
  if (num >= 100) {
    const cr = num / 100;
    const formatted = cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(1).replace(/\.?0+$/, "");
    return `+${formatted} Cr`;
  }
  return `+${num}L`;
};

/**
 * Dynamic Bidding Increments based on Base Price (50L, 100L, 200L) and Escalating Current Bid
 */
export const getDynamicBidIncrements = (basePrice = 50, currentBid = 50) => {
  const current = Number(currentBid);

  // Mega-escalation (bidding wars beyond 15 Cr)
  if (current >= 1500) {
    return [
      { amount: 50, label: "+50L", subtitle: "+50 Lakhs" },
      { amount: 100, label: "+1 Cr", subtitle: "+1 Crore" },
      { amount: 200, label: "+2 Cr", subtitle: "+2 Crores" },
      { amount: 250, label: "+2.5 Cr", subtitle: "+2.5 Crores" },
      { amount: 500, label: "+5 Cr", subtitle: "+5 Crores" },
    ];
  }

  // High escalation (10 Cr to 15 Cr)
  if (current >= 1000) {
    return [
      { amount: 25, label: "+25L", subtitle: "+25 Lakhs" },
      { amount: 50, label: "+50L", subtitle: "+50 Lakhs" },
      { amount: 100, label: "+1 Cr", subtitle: "+1 Crore" },
      { amount: 200, label: "+2 Cr", subtitle: "+2 Crores" },
      { amount: 250, label: "+2.5 Cr", subtitle: "+2.5 Crores" },
    ];
  }

  // If base price is 50 Lakhs (Other/Emerging)
  if (basePrice <= 50) {
    if (current < 100) {
      return [
        { amount: 5, label: "+5L", subtitle: "+5 Lakhs" },
        { amount: 10, label: "+10L", subtitle: "+10 Lakhs" },
        { amount: 25, label: "+25L", subtitle: "+25 Lakhs" },
        { amount: 50, label: "+50L", subtitle: "+50 Lakhs" },
      ];
    } else if (current < 500) {
      return [
        { amount: 10, label: "+10L", subtitle: "+10 Lakhs" },
        { amount: 25, label: "+25L", subtitle: "+25 Lakhs" },
        { amount: 50, label: "+50L", subtitle: "+50 Lakhs" },
        { amount: 100, label: "+1 Cr", subtitle: "+1 Crore" },
      ];
    } else {
      return [
        { amount: 25, label: "+25L", subtitle: "+25 Lakhs" },
        { amount: 50, label: "+50L", subtitle: "+50 Lakhs" },
        { amount: 100, label: "+1 Cr", subtitle: "+1 Crore" },
        { amount: 200, label: "+2 Cr", subtitle: "+2 Crores" },
      ];
    }
  }

  // If base price is 100 Lakhs (Senior 1 Cr)
  if (basePrice <= 100) {
    if (current < 200) {
      return [
        { amount: 10, label: "+10L", subtitle: "+10 Lakhs" },
        { amount: 25, label: "+25L", subtitle: "+25 Lakhs" },
        { amount: 50, label: "+50L", subtitle: "+50 Lakhs" },
        { amount: 100, label: "+1 Cr", subtitle: "+1 Crore" },
      ];
    } else if (current < 600) {
      return [
        { amount: 25, label: "+25L", subtitle: "+25 Lakhs" },
        { amount: 50, label: "+50L", subtitle: "+50 Lakhs" },
        { amount: 100, label: "+1 Cr", subtitle: "+1 Crore" },
        { amount: 200, label: "+2 Cr", subtitle: "+2 Crores" },
      ];
    } else {
      return [
        { amount: 50, label: "+50L", subtitle: "+50 Lakhs" },
        { amount: 100, label: "+1 Cr", subtitle: "+1 Crore" },
        { amount: 200, label: "+2 Cr", subtitle: "+2 Crores" },
        { amount: 250, label: "+2.5 Cr", subtitle: "+2.5 Crores" },
      ];
    }
  }

  // If base price is 200 Lakhs (Marquee 2 Cr)
  if (current < 500) {
    return [
      { amount: 20, label: "+20L", subtitle: "+20 Lakhs" },
      { amount: 25, label: "+25L", subtitle: "+25 Lakhs" },
      { amount: 50, label: "+50L", subtitle: "+50 Lakhs" },
      { amount: 100, label: "+1 Cr", subtitle: "+1 Crore" },
      { amount: 200, label: "+2 Cr", subtitle: "+2 Crores" },
    ];
  }

  return [
    { amount: 25, label: "+25L", subtitle: "+25 Lakhs" },
    { amount: 50, label: "+50L", subtitle: "+50 Lakhs" },
    { amount: 100, label: "+1 Cr", subtitle: "+1 Crore" },
    { amount: 200, label: "+2 Cr", subtitle: "+2 Crores" },
    { amount: 250, label: "+2.5 Cr", subtitle: "+2.5 Crores" },
  ];
};

/**
 * Calculates budget safety margin for completing a 11-player squad
 */
export const calculatePurseReserve = (budget = 10000, squadCount = 0) => {
  const slotsNeeded = Math.max(0, 11 - squadCount);
  const minBasePerSlot = 20; // Assume minimum base price 20L
  const reserveNeeded = Math.max(0, slotsNeeded - 1) * minBasePerSlot;
  const maxSpendOnCurrentLot = Math.max(0, budget - reserveNeeded);
  const isCritical = budget <= reserveNeeded + 50 && slotsNeeded > 1;

  return {
    slotsNeeded,
    reserveNeeded,
    maxSpendOnCurrentLot,
    isCritical,
  };
};
