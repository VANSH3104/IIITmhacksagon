# FreeLanceX – Decentralized Freelance Platform

Welcome to **FreeLanceX**, a decentralized freelancing platform built with Next.js, React, and Ethereum smart contracts. This project aims to empower freelancers and clients by removing intermediaries, enabling instant payments, and providing community-driven dispute resolution.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/freelancex.git
cd freelancex
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Install Vercel Analytics & Speed Insights

```bash
npm install @vercel/analytics @vercel/speed-insights
# or
yarn add @vercel/analytics @vercel/speed-insights
```

### 4. Environment Variables

Create a `.env.local` file and add your environment variables as needed (e.g., RPC URLs, contract addresses).

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## Features

- **Decentralized Chat:** Real-time messaging between freelancers and clients, powered by smart contracts.
- **Job Marketplace:** Post, browse, and apply for jobs with transparent bidding.
- **Dispute Resolution:** Community-powered voting system for handling disputes.
- **Instant Payments:** No middlemen, no platform fees, instant crypto payments.
- **Modern UI/UX:** Responsive, animated, and accessible interface using Tailwind CSS and Framer Motion.
- **Analytics & Performance:** Integrated with Vercel Analytics and Speed Insights.

---

## Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion
- **Smart Contracts:** Solidity, Ethers.js, Wagmi
- **Wallet Integration:** wagmi, viem
- **UI Components:** Lucide Icons, Custom Dialogs, Buttons
- **Analytics:** [@vercel/analytics](https://www.npmjs.com/package/@vercel/analytics), [@vercel/speed-insights](https://www.npmjs.com/package/@vercel/speed-insights)

---

## Project Structure

```
src/
  app/
    layout.jsx         # App layout, providers, analytics
    page.jsx           # Landing page and main sections
  Modules/
    chat/              # Chat UI and logic
    disputed/          # Dispute resolution UI
    Jobs/              # Job posting, application dialogs
    Navbar/            # Navigation bar
  components/          # Reusable UI components (Button, Dialog, etc.)
  Hook/                # Custom React hooks (e.g., useContract, useData)
```

---

## Key Files

- **`src/app/layout.jsx`**  
  Sets up global providers, fonts, animated background, navbar, and analytics.

- **`src/app/page.jsx`**  
  Main landing page with animated sections, features, testimonials, and roadmap.

- **`src/Modules/chat/ui/Chat-views.jsx`**  
  Real-time chat interface with emoji picker, typing indicator, and message status.

- **`src/Modules/disputed/ui/disputed-views.jsx`**  
  Dispute resolution UI with animated voting cards and eligibility checks.

- **`src/Modules/Jobs/freelancer/ui/Jobidui/ApplyJobDialog.jsx`**  
  Dialog for freelancers to apply for jobs with styled buttons and validation.

---

## Customization

- **Branding:**  
  Change colors, logos, and names in the relevant files (e.g., Navbar, page headings).

- **Smart Contract:**  
  Update contract addresses and ABI in the hooks and contract utility files.

- **Analytics:**  
  Analytics and speed insights are imported in `layout.jsx`:
  ```js
  import { Analytics } from "@vercel/analytics/react";
  import { SpeedInsights } from "@vercel/speed-insights/next";
  ```
  Place `<Analytics />` and `<SpeedInsights />` in your layout or page as needed.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)

---

## Acknowledgements

- 🚀 [Next.js](https://nextjs.org/)
- 🎨 [Tailwind CSS](https://tailwindcss.com/)
- 🎬 [Framer Motion](https://www.framer.com/motion/)
- 📊 [Vercel Analytics](https://vercel.com/analytics)
- 🔗 [Wagmi](https://wagmi.sh/)
- 🖌️ [Lucide Icons](https://lucide.dev/)

---

**Made with ❤️ at Hacksagon
