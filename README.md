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

- React
- TypeScript
- Web3 / Wallet integrations
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
## Install dependencies
```npm install```

## Install dependencies
```npm run dev```
