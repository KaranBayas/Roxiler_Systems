# Store Rating System

A full-stack web application for rating and managing stores. Users can browse stores, submit and view ratings, while admins can manage users and stores.

# 📸 Application Preview

| Login | Register |
|-------|----------|
| ![](./screenshots/login.png) | ![](./screenshots/register.png) |

| Browse Stores | Store Details |
|---------------|---------------|
| ![](./screenshots/browse-stores.png) | ![](./screenshots/store-details.png) |

## Project Structure

```
internship_project/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── routes/            # Route definitions
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Express middleware
│   │   ├── utils/             # Helper functions
│   │   └── index.js           # Server entry point
│   ├── .env                   # Environment variables
│   └── package.json
└── frontend/                  # React + Vite application
    ├── src/
    │   ├── pages/            # Page components
    │   ├── components/       # Reusable components
    │   ├── hooks/            # Custom React hooks
    │   ├── context/          # React context providers
    │   ├── services/         # API client services
    │   ├── routes/           # Route protection
    │   ├── styles/           # CSS files
    │   └── App.jsx           # App component with routing
    ├── vite.config.js        # Vite configuration
    └── package.json
```

## Tech Stack

### Frontend
- React 18.2.0
- Vite 5.4.21 (ES modules)
- React Router v6
- Axios 1.6.2
- React Hook Form 7.48.0
- Material UI 5.14.0
- Context API for state management

### Backend
- Express.js 4.18.2
- PostgreSQL 15.18
- Prisma ORM 5.7.0
- JWT Authentication (9.0.0)
- bcrypt 5.1.1 for password hashing
- Express Validator 7.0.0

## Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 15+
- Git

## Setup Instructions

### 1. Database Setup

Create PostgreSQL user and database:

```bash
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE USER appuser WITH PASSWORD 'apppass';
ALTER USER appuser WITH CREATEDB SUPERUSER;
CREATE DATABASE store_rating OWNER appuser;
```

Verify the connection:
```bash
psql postgresql://appuser:apppass@localhost:5432/store_rating
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment file (already configured with defaults)
# .env file should contain:
# DATABASE_URL=postgresql://appuser:apppass@localhost:5432/store_rating
# JWT_SECRET=dev_jwt_secret_key_change_in_production
# PORT=5001
# NODE_ENV=development
# CORS_ORIGIN=http://localhost:5173

# Run migrations
npx prisma migrate deploy

# Seed database with initial data
npx prisma db seed

# Start development server
npm run dev
```

The backend will run on `http://localhost:5001/api`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## User Roles

- **ADMIN**: Full access to all admin functions (user management, store management)
- **STORE_OWNER**: Can view ratings for their stores
- **USER**: Can browse stores and submit ratings

## Seeded Test Users

After database seed, the following test users are available:

- **Admin**: admin@example.com / Admin123!
- **Regular User**: user@example.com / User123!

Password requirements: minimum 8 characters, 1 uppercase, 1 lowercase, 1 number

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get logged-in user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `PUT /api/auth/password` - Change password (protected)

### Stores
- `GET /api/stores` - Get all stores (public, paginated with search/sort)
- `GET /api/stores/stats` - Get store statistics (public)
- `GET /api/stores/:id` - Get store details with ratings (public)
- `POST /api/stores` - Create store (admin only)
- `PUT /api/stores/:id` - Update store (admin only)
- `DELETE /api/stores/:id` - Delete store (admin only)

### Ratings
- `GET /api/ratings/store/:storeId` - Get ratings for a store (public, paginated)
- `GET /api/ratings/user` - Get current user's ratings (protected, paginated)
- `GET /api/ratings/check/:storeId` - Check if user already rated (protected)
- `GET /api/ratings/store/:storeId/stats` - Get rating statistics (public)
- `POST /api/ratings` - Submit rating (authenticated users only, 1-5 score)
- `PUT /api/ratings/:id` - Update rating (rating owner only)
- `DELETE /api/ratings/:id` - Delete rating (rating owner only)

### Users (Admin only)
- `GET /api/users` - Get all users (admin, paginated with search/sort)
- `POST /api/users` - Create new user
- `DELETE /api/users/:id` - Delete user

### Health
- `GET /api/health` - Server health check (public)

## Features

### User Features
- **User Registration & Login**: Secure authentication with JWT tokens (7-day expiry)
- **Browse Stores**: View all available stores with pagination and search functionality
- **Rate Stores**: Submit, update, or delete ratings (1-5 stars with comments)
- **View Ratings**: See all ratings for any store with user information and timestamps
- **User Profile**: Update profile information and change password

### Admin Features
- **User Management**: Create, view, and delete users with role assignment
- **Store Management**: Create, update, and delete stores with address details
- **Admin Dashboard**: Central management interface with tabbed user/store management

### Store Owner Features
- **Store Dashboard**: View statistics including average rating and rating distribution
- **Rating Analytics**: See all ratings submitted for their store

## Code Quality

- **ESLint** configured for code linting
- **Prettier** configured for code formatting
- **Input Validation**: Comprehensive validation on all endpoints
- **CORS**: Configured for secure cross-origin requests
- **Error Handling**: Centralized error handling middleware
- **Authentication**: JWT-based authentication with role-based access control
- **Password Security**: bcrypt hashing with 10 salt rounds
- **SOLID Principles**: Clean architecture with separation of concerns

## Building for Production

### Backend
```bash
cd backend
npm run build
# Deploy to production server
```

### Frontend
```bash
cd frontend
npm run build
# dist/ directory contains static files ready for hosting
```

## Development Commands

### Backend
```bash
npm run dev          # Start development server with auto-reload
npm run lint         # Run ESLint
npm run format       # Format code with Prettier (if configured)
```

### Frontend
```bash
npm run dev          # Start development server on port 5173
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Testing

### Manual Testing

1. **User Registration & Login**
   - Navigate to /register to create new account
   - Login with credentials
   - Verify token is stored in localStorage

2. **Browse Stores**
   - Click "Browse Stores" after login
   - Use search to filter stores
   - Test pagination

3. **Submit Rating**
   - Click on store to view details
   - Submit rating with score and comment
   - Verify rating appears immediately

4. **Admin Functions**
   - Login with admin account
   - Test user creation/deletion
   - Test store creation/deletion

### Code Quality
```bash
# Backend
cd backend && npm run lint

# Frontend  
cd frontend && npm run lint
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5001 already in use | Change PORT in backend/.env and update frontend/vite.config.js |
| Database connection error | Verify PostgreSQL is running: `psql postgresql://appuser:apppass@localhost:5432/store_rating` |
| CORS errors | Ensure CORS_ORIGIN in .env matches frontend URL (http://localhost:5173 for development) |
| JWT token expired | Tokens expire after 7 days. Users are automatically redirected to login. |
| ControlCenter using port 5000 | Backend configured to use port 5001 to avoid macOS ControlCenter conflicts |
| Build fails | Delete node_modules and package-lock.json, run `npm install` again |

## Project Milestones

- ✅ **Milestone 1**: Project initialization with Git and project structure
- ✅ **Milestone 2**: Database schema design and seeding
- ✅ **Milestone 3**: Authentication system (JWT, register, login, password change)
- ✅ **Milestone 4**: User management with admin CRUD
- ✅ **Milestone 5**: Rating system with full CRUD and statistics
- ✅ **Milestone 6**: Frontend store browsing and rating UI
- ✅ **Milestone 7**: Admin dashboard interface
- ✅ **Milestone 8**: Store owner dashboard features
- ✅ **Milestone 9**: Complete input validation and error handling
- ✅ **Milestone 10**: Frontend routing and navigation with role-based access

## Git Commits

Each milestone is tracked with meaningful git commits for clean project history:

```bash
git log --oneline
# Shows history of all milestone implementations
```

## Directory Structure Details

### Backend Services
- `authService.js`: User registration, login, profile management
- `userService.js`: Admin user operations
- `storeService.js`: Store CRUD and statistics
- `ratingService.js`: Rating CRUD and calculations

### Frontend Pages
- `Login.jsx`: User login form
- `Register.jsx`: User registration with validation
- `StoreList.jsx`: Browse stores with search/pagination
- `StoreDetail.jsx`: Store details and rating submission
- `AdminDashboard.jsx`: Admin user and store management
- `StoreOwnerDashboard.jsx`: Store owner statistics
- `UserProfile.jsx`: User profile and settings

### Frontend Hooks
- `useAuth.js`: Access authentication context
- `useToast.js`: Toast notification management

## Security Features

- **Password Hashing**: bcrypt with 10 rounds
- **JWT Tokens**: 7-day expiration with secure storage
- **CORS Protection**: Configured allowed origins
- **Input Validation**: Server-side validation on all endpoints
- **Role-Based Access**: Middleware-based authorization
- **Protected Routes**: Frontend route protection with role checks

## Performance Considerations

- **Pagination**: Limits query results to improve performance
- **Indexed Queries**: Database indexes on frequently queried fields
- **API Caching**: Proper HTTP headers for cache control
- **Minified Assets**: Production builds are optimized and minified
- **Code Splitting**: Vite handles automatic code splitting

## License

MIT

## Support

For issues or questions, refer to the troubleshooting section above or review API endpoint documentation.
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
