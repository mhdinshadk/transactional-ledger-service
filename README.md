# Transactional Ledger Service

A simplified internal ledger system that handles money movement between accounts with a focus on **financial correctness**, **concurrency safety**, and **idempotency**.

Built with **Node.js + TypeScript + Express + MongoDB (Mongoose)** and fully dockerized.

---

## ✨ Features

- Create accounts (wallets) in **USD / INR**
- Deposit & Withdraw (credit / debit) with **overdraft protection** (no negative balance)
- Internal transfers between accounts (debit + credit)
- **Idempotent** transfers using `Idempotency-Key` header
- Account balance endpoint
- Paginated transaction history (ledger lines)
- Concurrency-safe updates using MongoDB atomic operations
- Centralized error handling with clean JSON responses
- Strict TypeScript types

---

## 🧰 Tech Stack

- **Language**: Node.js (TypeScript)
- **Framework**: Express
- **Database**: MongoDB (Mongoose)
- **Validation**: Zod
- **Testing**: Jest + Supertest (for integration tests)
- **Containerization**: Docker + docker-compose

---

Technology Choices
Backend: Node.js + TypeScript

Reasons:

Type safety

Lightweight and fast

Good for REST services

Mature ecosystem (Express, Mongoose)

Database: MongoDB

Reasons:

Flexible schema for ledger entries

Supports atomic updates using $inc and conditional filters ($gte)

Perfect for wallet-style accounts

Simplified development experience

Easy to dockerize

No need for strict SQL schema migrations for this assignment


1️⃣ Clone the repo
git clone <YOUR_REPO_URL>
cd transactional-ledger-service
2️⃣ Install dependencies
npm install
3️⃣ Environment variables
I also addedd the file i dont make hidden for the test.
4️⃣ Run in development
npm run dev
5️⃣ Build & run in production mode
npm run build
npm start

Dockerized Setup
1️⃣ Build & start
docker-compose up --build
stop:
docker-compose down
