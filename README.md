# 💰 Expense Tracker

A production-ready personal finance tool for recording and reviewing expenses. Built with a focus on data correctness, idempotency, and real-world reliability.

## 🌐 Live Demo

- **Frontend**: [Deployed URL]
- **Backend API**: [Deployed URL]

## ✨ Features

- ✅ Create expenses with amount, category, description, and date
- ✅ View list of all expenses
- ✅ Filter expenses by category
- ✅ Sort expenses by date (newest/oldest first)
- ✅ View total of visible expenses
- ✅ Category-wise summary with visual breakdown
- ✅ **Idempotency** - Safe retries, no duplicate entries
- ✅ Loading and error states
- ✅ Input validation (client & server)
- ✅ Responsive design

## 🏗️ Architecture

```
expense-tracker/
├── backend/           # Node.js + Express + TypeScript
│   ├── prisma/        # Database schema (SQLite)
│   └── src/
│       ├── routes/    # API endpoints
│       ├── services/  # Business logic
│       ├── schemas/   # Zod validation
│       └── middleware/# Error handling
│
├── frontend/          # React + Vite + TypeScript
│   └── src/
│       ├── api/       # API client
│       ├── components/# UI components
│       ├── hooks/     # React Query hooks
│       └── types/     # TypeScript types
│
└── README.md
```

## 🔧 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | API Server |
| TypeScript | Type safety |
| PostgreSQL + Prisma | Database + ORM |
| Decimal.js | Precise money calculations |
| Zod | Runtime validation |
| Jest | Testing |

### Frontend
| Technology | Purpose |
|------------|---------|
| React + Vite | UI Framework |
| TypeScript | Type safety |
| React Query | Server state management |
| Axios | HTTP client |
| Vitest | Testing |

## 🎯 Key Design Decisions

### 1. Idempotency for Safe Retries

**Problem**: Users may click submit multiple times or refresh the page after submitting, causing duplicate expenses.

**Solution**: Client-generated UUID idempotency keys
- Frontend generates a unique UUID for each form submission
- Backend stores the key and checks before creating
- Same key = return existing expense (no duplicate)
- Keys are automatically cleaned up after 24 hours

```
Client                          Server
  |                               |
  |--[Expense + UUID]----------->|
  |                     Check if UUID exists
  |                     If yes: return existing
  |                     If no: create new + store UUID
  |<--------[Expense]------------|
```

### 2. Money Handling

**Problem**: Floating-point arithmetic causes precision errors (0.1 + 0.2 = 0.30000000000000004)

**Solution**: 
- Store amounts as **integers in paise/cents** (₹100.50 → 10050)
- Use Decimal.js for all calculations
- Convert to display format only at the UI layer

### 3. SQLite Database

**Why SQLite over PostgreSQL/MySQL?**
- Zero configuration required
- No separate database server needed
- File-based - easy to deploy and backup
- Sufficient for personal expense tracking scale
- Prisma ORM provides the same type-safety regardless

**Trade-off**: Less suitable for high-concurrency scenarios

### 4. Predefined Categories

**Why enum-style categories over free-form?**
- Consistent data for filtering and aggregation
- Prevents typos and duplicates ("food" vs "Food" vs "FOOD")
- Simpler UI with dropdown selection

**Trade-off**: Less flexibility for custom categories

### 5. No Authentication

**Why?**
- Out of scope for this exercise
- Focus on core expense tracking features
- Would add significantly to development time

**Real-world note**: Production app would need auth + per-user data isolation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Backend Setup

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Backend runs on http://localhost:3001

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173

## 📡 API Endpoints

### POST /expenses
Create a new expense.

**Headers:**
- `X-Idempotency-Key`: UUID (optional, recommended)

**Body:**
```json
{
  "amount": 250.50,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2024-01-15T12:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "amount": 250.50,
    "amountRaw": 25050,
    "category": "Food",
    "description": "Lunch at restaurant",
    "date": "2024-01-15T12:00:00.000Z",
    "createdAt": "2024-01-15T12:30:00.000Z"
  }
}
```

### GET /expenses
List expenses with optional filtering.

**Query Parameters:**
- `category`: Filter by category (optional)
- `sort`: `date_desc` (default) or `date_asc`

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

### GET /expenses/summary
Get totals by category.

### GET /expenses/categories
Get list of valid categories.

## 🧪 Testing

### Manual Testing Checklist
- [ ] Create expense with all fields
- [ ] Create expense - double click submit (should only create one)
- [ ] Refresh page during loading (should not duplicate)
- [ ] Filter by each category
- [ ] Sort by newest/oldest
- [ ] Verify total updates with filters
- [ ] Submit with negative amount (should reject)
- [ ] Submit with empty description (should reject)

### Automated Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## ⏱️ Time Constraints & Trade-offs

| What I did | What I didn't do | Why |
|------------|------------------|-----|
| Idempotency with UUID | Optimistic locking | Simpler, covers main use cases |
| SQLite | PostgreSQL | Zero config, easy deploy |
| Predefined categories | Custom categories | Simpler, consistent data |
| Client-side total | Server-side aggregation | Simpler for filtered views |
| Basic error states | Retry buttons | Time constraint |

## 🔒 What's NOT Included (Intentionally)

1. **User Authentication** - Would need session management, password hashing, etc.
2. **Edit/Delete Expenses** - Not in requirements
3. **Pagination** - Not needed for personal expense scale
4. **Charts/Graphs** - Nice to have but category summary covers the need
5. **Dark/Light Mode Toggle** - App is already beautifully themed

## 📄 License

MIT

---

Built with ❤️ for the Fenmo assignment
