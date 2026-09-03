# 🏏 V-RUN 11 • Real-Time IPL Fantasy Auction Draft Simulator

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvartiwa%2Fv-run-11-Fantasy-app-)

A luxury, real-time multiplayer cricket auction simulator built with **Next.js 16 (Turbopack)**, **Tailwind CSS**, and **Firebase Realtime Database**. Designed with a sophisticated Wimbledon/Lord's racing green aesthetic, tactile 3D bidding paddles, dynamic base-tier increments, and auctioneer gavel command controls.

---

## ⚡ 1-Click Deployment to Vercel

You can deploy this application directly to Vercel with zero configuration:

1. Click the **[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvartiwa%2Fv-run-11-Fantasy-app-)** button above.
2. Or go to **[vercel.com/new](https://vercel.com/new)** and import **`v-run-11-Fantasy-app-`**.
3. Framework Preset: **Next.js** (auto-detected via `vercel.json`).
4. Click **Deploy**. Your app will be live globally in ~40 seconds!

---

## 🌟 Key Features

### 1. Dynamic Tiered Bidding Increments
Bidding increments dynamically adapt to the active player's reserve price:
- **Marquee Superstars (₹2.00 Cr)**: `+20L`, `+25L`, `+50L`, `+1 Cr`, `+2 Cr`
- **Senior Stars (₹1.00 Cr)**: `+10L`, `+25L`, `+50L`, `+1 Cr`
- **Emerging / Other Players (₹50 Lakhs)**: `+5L`, `+10L`, `+25L`, `+50L`

### 2. Authentic Lakhs & Crores Display
- Clear Indian currency denominations throughout the draft floor (`₹50 Lakhs`, `₹1.00 Cr`, `₹2.00 Cr`, `₹14.50 Cr`).
- No awkward decimal fractions (`₹0.50 Cr`).

### 3. Flexible Host Roles & Open Gavel
- **Neutral Auctioneer**: Moderate the auction, nominate players, and strike the gavel without taking a team slot.
- **Player & Host**: Own a franchise (e.g. Mumbai, Chennai), bid for your squad with a ₹100 Cr purse, AND hold gavel controls!
- **Open Floor Gavel Option**: Allow any player to strike the gavel or pass lots when bidding slows down.

### 4. Auctioneer-Controlled Timer
- The 60-second countdown does **not** lock out players automatically.
- At `00:00`, it switches to **Final Call • Awaiting Gavel**.
- Bidders can continue to raise bids until the gavel is struck (each new bid grants +15s anti-sniping protection).
- The lot completes **only when the hammer is struck** (`Hammer Down` to sell or `Pass` to mark unsold).

### 5. Instant Rejoin & No Capacity Lockouts
- Leaving the room immediately releases the franchise claim from Firebase.
- Returning players can enter the room PIN, tap their franchise, and rejoin instantly without false "Room Full" or "Claimed" lockouts.

---

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/vartiwa/v-run-11-Fantasy-app-.git

# Navigate into the project
cd v-run-11-Fantasy-app-

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License
MIT License. Created for V-RUN 11 Fantasy Cricket.
