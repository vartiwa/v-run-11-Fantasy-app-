// Standardized Lakhs & Crores Currency Formatter for IPL Auction
// Marquee: 2 Cr (200L), Senior: 1 Cr (100L), Other: 50 Lakhs (50L)

export const formatLakhsAndCrores = (lakhs, compact = false) => {
  if (lakhs === null || lakhs === undefined || isNaN(lakhs)) return "₹0";
  const num = Number(lakhs);
  if (num >= 100) {
    const cr = num / 100;
    const formatted = cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2).replace(/\.?0+$/, "");
    return compact ? `₹${formatted} Cr` : `₹${formatted} Crore${cr > 1 ? "s" : ""}`;
  }
  return compact ? `₹${num}L` : `₹${num} Lakhs`;
};

// Dynamic Bidding Increments based on Base Price (50L, 100L, 200L) & Current Bid
export const getDynamicBidIncrements = (basePrice = 50, currentBid = 50) => {
  // If base price is 50 Lakhs (Other/Emerging)
  if (basePrice <= 50) {
    if (currentBid < 100) {
      return [
        { amount: 5, label: "+5L", subtitle: "+5 Lakhs" },
        { amount: 10, label: "+10L", subtitle: "+10 Lakhs" },
        { amount: 25, label: "+25L", subtitle: "+25 Lakhs" },
        { amount: 50, label: "+50L", subtitle: "+50 Lakhs" },
      ];
    } else {
      return [
        { amount: 10, label: "+10L", subtitle: "+10 Lakhs" },
        { amount: 25, label: "+25L", subtitle: "+25 Lakhs" },
        { amount: 50, label: "+50L", subtitle: "+50 Lakhs" },
        { amount: 100, label: "+1 Cr", subtitle: "+1 Crore" },
      ];
    }
  }

  // If base price is 100 Lakhs (Senior 1 Cr)
  if (basePrice <= 100) {
    if (currentBid < 200) {
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

  // If base price is 200 Lakhs (Marquee 2 Cr)
  return [
    { amount: 20, label: "+20L", subtitle: "+20 Lakhs" },
    { amount: 25, label: "+25L", subtitle: "+25 Lakhs" },
    { amount: 50, label: "+50L", subtitle: "+50 Lakhs" },
    { amount: 100, label: "+1 Cr", subtitle: "+1 Crore" },
    { amount: 200, label: "+2 Cr", subtitle: "+2 Crores" },
  ];
};
