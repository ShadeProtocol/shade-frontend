# Shade DApp Frontend

The **Shade DApp Frontend** is the user interface for interacting with the Shade decentralized payment gateway. It allows merchants and customers to manage and process crypto payments through a simple, wallet-connected web application.

The frontend connects directly to the Shade smart contracts and backend services to enable invoice creation, payment processing, and real-time transaction updates.

## Features

- **Wallet-Based Authentication**  
  Users connect their crypto wallet to access the platform without traditional login credentials.

- **Merchant Dashboard**  
  Create, track, and manage invoices in a clean and intuitive interface.

- **Invoice Payments**  
  Customers can pay invoices by entering a valid invoice reference and completing the transaction through their wallet.

- **Real-Time Status Updates**  
  Invoice states automatically update as payments are completed or cancelled.

- **SDK Integration**  
  Works seamlessly with the Shade React SDK to embed payment functionality into merchant platforms.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Stellar wallet integrations
- Smart contract interaction
- REST APIs for off-chain services

## Core Functionality

The frontend enables users to:

- Connect a wallet
- Generate and manage invoices
- Pay invoices using supported tokens
- Monitor invoice status (`PENDING`, `PAID`, `CANCELLED`)
- Withdraw merchant funds

## Development

Clone the repository:

```bash
git clone https://github.com/<your-org>/shade-dapp-frontend.git
cd shade-dapp-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run checks:

```bash
npm run typecheck
npm run format:check
```

Format files:

```bash
npm run format
```

## Contributing

1. Create a branch from `dev`.
2. Keep changes focused on one task or bug fix.
3. Run `npm run typecheck` and `npm run format:check` before opening a pull request.
4. Fill out the pull request template with a short summary, verification steps, and any notes.
5. Request review after CI passes.

For now, CI runs TypeScript checking and Prettier format validation on pull requests and pushes to `main` or `dev`.
