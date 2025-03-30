# Shopstr Competency Test

A decentralized Nostr marketplace for anonymous trading with Bitcoin. This project demonstrates gift-wrapped Nostr messages, P2PK-locked Cashu tokens, and HODL invoices in a playful UI with dark mode support.

## Features

- **Nostr Integration:**  
  Send and decrypt gift-wrapped Nostr messages (NIP-17).

- **Cashu Token Processing:**  
  Create and validate P2PK-locked Cashu tokens.

- **HODL Invoice Management:**  
  Generate and track invoice statuses for HODL invoices.

- **Dark Mode & Animated UI:**  
  Toggle between light and dark themes with subtle background animations.

## Directory Structure

```
shopstr-competency-test/
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── hero-cartoon.jpg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── lib/
│   │   ├── cashuService.ts
│   │   ├── lightningService.ts
│   │   └── nostrService.ts
│   ├── pages/
│   │   ├── api/
│   │   │   ├── cashu.ts
│   │   │   ├── hodl.ts
│   │   │   └── nostr.ts
│   │   ├── _document.tsx
│   │   └── index.tsx
│   └── styles/
│       └── Home.module.css
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
└── tsconfig.json
```

## Setup and Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (comes with Node.js)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/GautamBytes/shopstr-competency-test..git
   cd shopstr-competency-test
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the application:**

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

## Technical Approach

- **Framework & Language:**  
  Built with Next.js and TypeScript for a modern, type-safe web application.

- **Core Functionality:**  
  - **Nostr:** Send and display gift-wrapped messages using [NIP-17](https://github.com/nostr-protocol/nips/blob/master/17.md).
  - **Cashu:** Simulate the creation and validation of P2PK-locked tokens using [Cashu P2PK](https://github.com/cashubtc/nuts/blob/main/11.md).
  - **HODL:** Demonstrate invoice generation and status handling via [HODL Invoices](https://github.com/lightningnetwork/lnd/pull/2022).

- **UI Enhancements:**  
  A playful UI includes animated background shapes and a dark mode toggle for visual variety.

## Notes

This project is designed as a competency test assignment and is not intended for production use.

