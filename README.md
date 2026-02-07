# ElysiaJS + Mongoose Backend

A clean, production-ready backend API built with **ElysiaJS** and **Mongoose** using **Bun** runtime.

## Tech Stack

- **Runtime**: Bun
- **Framework**: ElysiaJS
- **Database**: MongoDB
src/
├── app.ts                    # Main application setup
├── server.ts                 # Server entry point
├── config/
│   └── database.ts          # MongoDB connection
├── modules/
│   
├── middlewares/
│   └── errorHandler.ts      # Centralized error handling
├── utils/
│   └── response.ts          # API response helpers
└── constants/
    └── index.ts             # Application constants


## Getting Started

### Prerequisites

- Bun installed ([https://bun.sh](https://bun.sh))
- MongoDB running locally or MongoDB Atlas account

### Installation

1. Install dependencies:

```bash
bun install
```

2. Configure environment variables:

```bash
cp .env.example .env
```

Edit `.env` and set your MongoDB URI:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/elysia-store
```

3. Start the server:

bun run dev

The server will start at `http://localhost:3000`

---

## 🏗️ Architecture

- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Models**: Define database schemas
- **Interfaces**: TypeScript type definitions
- **Middlewares**: Cross-cutting concerns (error handling)
- **Utils**: Helper functions

## 🔧 Development

bun run dev

bun run start

