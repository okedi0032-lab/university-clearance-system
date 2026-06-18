# Setup Guide

## 🖥️ Prerequisites

Before you begin, make sure you have installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/okedi0032-lab/university-clearance-system.git
cd university-clearance-system
```

### 2. Backend Setup

#### 2.1 Install Dependencies
```bash
cd backend
npm install
```

#### 2.2 Create Environment File
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# Server
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=university_clearance
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=24h

# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

#### 2.3 Create Database
```bash
createdb university_clearance
psql university_clearance < database/schema.sql
```

#### 2.4 Run Migrations
```bash
npm run migrate
```

#### 2.5 Seed Initial Data
```bash
npm run seed
```

#### 2.6 Start Backend Server
```bash
npm start
```

You should see:
```
✓ Server running on port 5000
✓ Database connected
```

### 3. Frontend Setup

#### 3.1 Install Dependencies
```bash
cd ../frontend
npm install
```

#### 3.2 Create Environment File
```bash
cp .env.example .env
```

Edit `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_APP_NAME=University Clearance System
```

#### 3.3 Start Frontend Application
```bash
npm start
```

The application will open at `http://localhost:3000`

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

### Run All Tests
```bash
npm run test:all
```

## 📁 Project Structure

```
university-clearance-system/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── models/            # Database models
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API routes
│   │   ├── config/            # Configuration files
│   │   └── utils/             # Utility functions
│   ├── database/              # Database migrations
│   ├── tests/                 # Test files
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── hooks/             # Custom hooks
│   │   ├── context/           # Context API
│   │   ├── styles/            # CSS/SCSS
│   │   ├── utils/             # Utility functions
│   │   └── App.js
│   ├── public/                # Static files
│   ├── tests/                 # Test files
│   ├── .env.example
│   ├── package.json
│   └── index.js
│
├── database/
│   ├── schema.sql             # Database schema
│   ├── migrations/            # Migration files
│   └── seeds/                 # Seed data
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── API.md
│   └── SETUP.md
│
├── .gitignore
├── README.md
└── CONTRIBUTING.md
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# For port 5000 (Backend)
lsof -i :5000
kill -9 <PID>

# For port 3000 (Frontend)
lsof -i :3000
kill -9 <PID>
```

### Database Connection Error
1. Ensure PostgreSQL is running
2. Check database credentials in `.env`
3. Verify database exists: `psql -l`

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Issues
Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL.

## 📚 Next Steps

1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system design
2. Check [API.md](./API.md) for available endpoints
3. Review [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for database structure
4. See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines

## 🆘 Getting Help

- Check existing issues on GitHub
- Create a new issue with detailed description
- Review documentation in `/docs` folder

---

Happy coding! 🎉
