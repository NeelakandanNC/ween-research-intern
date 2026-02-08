# Ween

A full-stack platform connecting students with professors for research internship opportunities.

## 🏗️ Project Structure

```
research-internship-platform/
├── client/                   # React Frontend (Vite)
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── common/       # UI components (Badge, Modal, etc.)
│   │   │   └── layout/       # Layout components (Navbar, ProtectedRoute)
│   │   ├── features/         # Feature-based modules
│   │   │   ├── auth/         # Authentication (Login, Register)
│   │   │   ├── internships/  # Browsing internships
│   │   │   ├── applications/ # Managing applications
│   │   │   ├── bookmarks/    # Saved internships
│   │   │   └── professor/    # Professor dashboard
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # API client, utilities
│   │   └── styles/           # Global styles
│   └── package.json
├── server/                   # Express Backend
│   ├── prisma/               # Database schema & migrations
│   ├── src/
│   │   ├── config/           # Configuration
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Express middleware
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   └── utils/            # Helpers
│   └── package.json
└── package.json              # Root workspace scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL (Neon recommended)

### Installation

```bash
# Install dependencies for all packages
cd client && npm install
cd ../server && npm install
```

### Environment Setup

**Client** (`client/.env`):
```
VITE_API_URL=http://localhost:3001/api
```

**Server** (`server/.env`):
```
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
PORT=3001
NODE_ENV=development
```

### Development

```bash
# From root - run both client and server
npm run dev

# Or individually
npm run dev:client
npm run dev:server
```

### Database

```bash
# Run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio
```

## 📦 Tech Stack

**Frontend:**
- React 18 + Vite
- React Router 6
- Tailwind CSS
- Lucide React icons

**Backend:**
- Node.js + Express
- Prisma ORM
- PostgreSQL (Neon)
- JWT Authentication

## 🔑 Features

- **For Students:**
  - Browse research internships
  - Filter by skills and research area
  - Apply and track applications
  - Bookmark opportunities

- **For Professors:**
  - Create internship listings
  - Review and manage applications
  - Accept/reject candidates

## 📄 License

MIT
