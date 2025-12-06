# Transactional Ledger Service

A simplified internal ledger system that handles money movement between accounts with a focus on:

- Financial correctness
- Concurrency safety
- Idempotency
- Atomic operations

Built using Node.js, TypeScript, Express, and MongoDB (Mongoose). Fully Dockerized.

--------------------------------------------------------------------

## Features

### Accounts
- Create accounts (wallets) in USD or INR
- Starting balance is always 0

### Transactions
- Deposit (Credit)
- Withdraw (Debit) with overdraft protection (balance cannot go negative)

### Internal Transfers
- Atomic debit and credit
- If debit fails, credit does not execute
- Supports idempotency using the "Idempotency-Key" header

### Balance and History
- Get current account balance
- Paginated transaction history (ledger lines)

### Safety and Correctness
- MongoDB atomic updates ($inc, $gte)
- Prevents race conditions during transfers
- Duplicate requests handled through idempotency

### Developer Experience
- Centralized error handling with consistent JSON responses
- Strong TypeScript typing across the project
- Fully dockerized services for easy deployment

--------------------------------------------------------------------

## Installation and Setup

### 1. Clone the repository
git clone <YOUR_REPO_URL>
cd transactional-ledger-service

### 2. Install dependencies
npm install

### 3. Environment Variables
A `.env` file is included for testing.

Example:
MONGO_URI=mongodb://localhost:27017/ledger
PORT=5000

### 4. Run in development
npm run dev

### 5. Build and run in production
npm run build
npm start

--------------------------------------------------------------------

## Technology Choices

### Backend: Node.js + TypeScript
Reasons:
- Type safety
- Lightweight and fast
- Good ecosystem for REST APIs (Express)
- Works seamlessly with MongoDB and Mongoose

### Database: MongoDB
Reasons:
- Flexible schema structure for accounts and ledger entries
- Supports atomic operations ($inc, conditional updates)
- Ideal for wallet/accounting systems
- Easy to containerize for production

--------------------------------------------------------------------

## Project Structure

transactional-ledger-service/
│
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── middlewares/
│   ├── utils/
│   └── app.ts
│
├── docker-compose.yml
├── Dockerfile
├── tsconfig.json
├── package.json
└── README.md

--------------------------------------------------------------------

## Testing (Optional)
- Unit tests for account operations
- Idempotency behavior tests
- Concurrency handling tests

--------------------------------------------------------------------

## License
This project is for assignment and demonstration purposes only.
