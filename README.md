# Store Rating System

A full-stack application for users to rate stores with role-based access control. Built with React, Express, PostgreSQL, and Prisma ORM.

## Tech Stack

### Frontend
- React 18
- Vite
- React Router v6
- Axios
- React Hook Form
- Material UI
- Context API

### Backend
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt for password hashing
- Express Validator

## Project Structure

```
internship_project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── routes/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── models/
│   │   ├── validations/
│   │   ├── utils/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.js
│   │   └── index.js
│   ├── .env
│   ├── .env.example
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+
- Git

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd internship_project
```

### 2. Create virtual environment (optional but recommended for Python dependencies)
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (already exists, update DATABASE_URL if needed)
# Default: DATABASE_URL=postgresql://postgres:postgres@localhost:5432/store_rating

# Run database migrations
npm run migrate

# Seed database with initial data
npm run seed

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/store_rating
JWT_SECRET=your_super_secret_jwt_key_change_in_production
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## Database Schema

### Users Table
- id (PK)
- email (unique)
- name
- password (hashed)
- role (ADMIN, USER, STORE_OWNER)
- createdAt, updatedAt

### Stores Table
- id (PK)
- name
- address
- city
- state
- zipCode
- description
- createdAt, updatedAt

### Ratings Table
- id (PK)
- score (1-5)
- comment
- userId (FK)
- storeId (FK)
- createdAt, updatedAt

### StoreOwner Table
- id (PK)
- userId (FK, unique)
- storeId (FK, unique)
- createdAt, updatedAt

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Passwords are hashed using bcrypt with 10 salt rounds
- JWT tokens are signed with a secret key
- Tokens should be included in the Authorization header as: `Bearer <token>`

## User Roles

1. **Admin**: Can manage users, stores, and view all data
2. **User**: Can browse stores, submit ratings, and update their profile
3. **Store Owner**: Can view ratings for their store and update profile

## API Endpoints (Planned)

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user

### Users
- GET `/api/users` - Get all users (Admin only)
- GET `/api/users/:id` - Get user details
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

### Stores
- GET `/api/stores` - Get all stores
- GET `/api/stores/:id` - Get store details
- POST `/api/stores` - Create store (Admin only)
- PUT `/api/stores/:id` - Update store
- DELETE `/api/stores/:id` - Delete store

### Ratings
- GET `/api/ratings` - Get all ratings
- POST `/api/ratings` - Submit rating
- PUT `/api/ratings/:id` - Update rating
- DELETE `/api/ratings/:id` - Delete rating

## Development Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

### Backend
```bash
npm run dev           # Start with watch mode
npm start            # Start production
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run migrate      # Run database migrations
npm run migrate:prod # Run migrations in production
npm run seed         # Seed database with initial data
```

## Git Workflow

The project follows a milestone-based approach with clean commits:

```bash
git add .
git commit -m "Descriptive message"
git push
```

## Code Quality

- **ESLint**: Enforces code style and best practices
- **Prettier**: Auto-formats code for consistency
- **Architecture**: Clean architecture with separation of concerns
- **SOLID Principles**: Followed throughout the codebase

## Testing

Comprehensive testing will be performed on:
- All API endpoints
- Sorting and filtering
- Search functionality
- Rating system
- Dashboards for all roles
- Authentication flows

## Deployment

### Database Setup
```bash
# Production database setup
export DATABASE_URL=postgresql://prod_user:prod_password@prod_host:5432/store_rating
npm run migrate:prod
npm run seed
```

### Frontend Deployment
- Build: `npm run build`
- Output: `dist/` directory
- Deploy to Vercel, Netlify, or similar

### Backend Deployment
- Use Node.js hosting (Heroku, Railway, DigitalOcean, etc.)
- Set environment variables
- Run migrations: `npm run migrate:prod`

## Issues and Debugging

If you encounter issues:

1. **Database connection**: Ensure PostgreSQL is running and DATABASE_URL is correct
2. **Port conflicts**: Check if ports 5000 (backend) and 5173 (frontend) are available
3. **Dependencies**: Clear node_modules and reinstall: `rm -rf node_modules && npm install`
4. **Migrations**: Reset database: `npx prisma migrate reset`

## License

MIT

## Author

Senior Full Stack Engineer
