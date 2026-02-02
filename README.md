# 🔐 Auth System Backend

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-v5.1-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" alt="License">
</p>

A robust, secure, and scalable **authentication system backend** built with Node.js, Express, and MongoDB. This project provides a complete authentication solution with JWT-based security, API key management, and user activity tracking — designed to be reusable across multiple projects.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [API Documentation](#-api-documentation)
  - [Authentication](#authentication-endpoints)
  - [API Keys](#api-key-endpoints)
  - [Dashboard](#dashboard-endpoints)
- [Database Models](#-database-models)
- [Security Features](#-security-features)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## ✨ Features

### 🔑 **Authentication**
- **User Registration** — Secure signup with email validation
- **User Login** — JWT-based authentication with token generation
- **User Logout** — Token blacklisting for secure session termination
- **Account Deactivation** — Soft delete functionality for user accounts

### 🔐 **API Key Management**
- **Generate API Keys** — Create secure, hashed API keys for external integrations
- **Revoke Single Key** — Disable individual API keys
- **Revoke All Keys** — Bulk disable all user API keys
- **Regenerate Keys** — Generate new keys while maintaining key identity

### 📊 **Dashboard & Analytics**
- **User Dashboard** — View account details and statistics
- **Token Overview** — List all active API keys with metadata
- **Usage Tracking** — Monitor API usage (mock implementation)

### 🌍 **Activity Tracking**
- **Login Activity Logging** — Track login attempts with timestamps
- **Geolocation Tracking** — Capture country and city from IP address
- **Logout Activity** — Record session terminations

### 🛡️ **Security**
- **JWT Token Verification** — Middleware for protected routes
- **Token Blacklisting** — Prevent use of revoked tokens
- **Password Hashing** — bcrypt integration for secure password storage
- **CORS Configuration** — Controlled cross-origin access
- **Input Validation** — Express-validator for request validation

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js v5** | Web application framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB object modeling (ODM) |
| **JWT** | JSON Web Token authentication |
| **bcrypt** | Password hashing |
| **geoip-lite** | IP-based geolocation |
| **express-validator** | Request validation middleware |
| **dotenv** | Environment variable management |
| **cors** | Cross-Origin Resource Sharing |
| **axios** | HTTP client (for external requests) |
| **cookie-parser** | Cookie parsing middleware |
| **nodemon** | Development auto-reload |

---

## 📁 Project Structure

```
Auth_system_Backend/
├── 📄 app.js                 # Express app initialization & middleware setup
├── 📄 server.js              # Server entry point
├── 📄 package.json           # Project dependencies & scripts
├── 📄 .env                   # Environment variables (not in repo)
├── 📄 .gitignore             # Git ignore rules
│
├── 📂 config/
│   ├── db.js                 # MongoDB connection configuration
│   └── jwt.js                # JWT configuration
│
├── 📂 controllers/
│   ├── 📂 auth/
│   │   ├── loginController.js         # Handle user login
│   │   ├── registerController.js      # Handle user registration
│   │   ├── logoutController.js        # Handle user logout
│   │   └── deactivateAccountController.js  # Account deactivation
│   │
│   ├── 📂 apis/
│   │   ├── createApiController.js           # Create new API key
│   │   ├── revokeSingleKeyController.js     # Revoke single API key
│   │   ├── revokeAllApiKeyController.js     # Revoke all API keys
│   │   └── regenerateSingleKeyController.js # Regenerate API key
│   │
│   └── 📂 dashboard/
│       └── dashboardController.js     # Dashboard data aggregation
│
├── 📂 middlewares/
│   ├── 📂 auth/
│   │   ├── loginMiddleware.js         # Login request validation
│   │   ├── registerMiddleware.js      # Registration validation
│   │   └── logoutMiddleware.js        # Logout validation
│   │
│   └── 📂 jwt/
│       └── jwtMiddleware.js           # JWT verification & protection
│
├── 📂 models/
│   ├── 📂 users/
│   │   ├── User.js                    # User schema
│   │   ├── LoginActivity.js           # Login activity tracking
│   │   └── LogoutActivity.js          # Logout activity tracking
│   │
│   ├── 📂 jwt/
│   │   ├── RefreshToken.js            # Refresh token storage
│   │   └── TokenBlacklist.js          # Blacklisted tokens
│   │
│   ├── 📂 apis/
│   │   └── Apikeys.js                 # API keys schema
│   │
│   └── Usage.js                       # API usage tracking
│
├── 📂 routes/
│   ├── globalRoutes.js                # Main route aggregator
│   ├── authRoutes.js                  # Authentication routes
│   └── apiRoutes.js                   # API key management routes
│
├── 📂 services/
│   ├── emailService.js                # Email notification service
│   └── tokenService.js                # Token generation service
│
└── 📂 utils/
    └── validators.js                  # Custom validation helpers
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) — [Download](https://nodejs.org/)
- **MongoDB** (v6.0 or higher) — [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **npm** or **yarn** package manager
- **Git** — [Download](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/esyice/Auth_system.git
   cd Auth_system_Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (see [Environment Variables](#environment-variables))

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **For production**
   ```bash
   npm start
   ```

The server will start at `http://localhost:3000` (or your configured PORT).

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/auth_system

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=1h

# Optional: JWT Refresh Token
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=7d
```

> ⚠️ **Important:** Never commit your `.env` file to version control. It's already included in `.gitignore`.

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

---

### Authentication Endpoints

#### 📝 Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "✅ User registered successfully",
  "user": {
    "id": "64abc123def456...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
| Status | Message |
|--------|---------|
| 400 | All fields are required |
| 409 | User already exists |
| 500 | Internal server error |

---

#### 🔑 Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64abc123def456...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
| Status | Code | Message |
|--------|------|---------|
| 400 | - | All fields are required |
| 400 | - | Invalid email or password |
| 403 | ACCOUNT_DEACTIVATED | Account is deactivated. Contact admin. |
| 404 | - | User not found |

---

#### 🚪 Logout User
```http
POST /api/auth/logout
```

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### ⛔ Deactivate Account
```http
PUT /api/auth/account/deactivate
```

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Account deactivated successfully"
}
```

---

### API Key Endpoints

> 🔒 **All API key endpoints require JWT authentication**

#### 🆕 Create API Key
```http
POST /api/apikeys/createApiKey
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "My Production Key",
  "expiresAt": "2025-12-31T23:59:59Z"  // Optional
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "API key created successfully",
  "apiKey": {
    "id": "64def789...",
    "name": "My Production Key",
    "key": "ak_live_xxxxxxxxxxxxxxxx",
    "expiresAt": "Dec 31, 2025, 11:59 PM"
  }
}
```

---

#### 🔄 Regenerate Single Key
```http
PUT /api/apikeys/:id/regenerateSingleKey
```

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "API key regenerated",
  "newKey": "ak_live_yyyyyyyyyyyyyyyy"
}
```

---

#### ❌ Revoke Single Key
```http
PUT /api/apikeys/:id/revokeSingleKey
```

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "API key revoked successfully"
}
```

---

#### 🗑️ Revoke All Keys
```http
PUT /api/apikeys/revokeAllKeys
```

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "All API keys revoked",
  "revokedCount": 5
}
```

---

### Dashboard Endpoints

#### 📊 Get Dashboard Data
```http
GET /api/dashboard
```

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "user": {
    "id": "64abc123def456...",
    "name": "John Doe",
    "email": "john@example.com",
    "status": true
  },
  "meta": {
    "totalTokens": 3,
    "lastIssuedToken": {
      "issuedAt": "Jan 15, 2025, 10:30 AM"
    }
  },
  "tokens": [
    {
      "id": "64def789...",
      "name": "Production Key",
      "active": true,
      "key": "ak_live_xxx...",
      "expiresAt": "Dec 31, 2025, 11:59 PM",
      "lastIssued": "Jan 15, 2025, 10:30 AM"
    }
  ],
  "usage": {
    "today": 124,
    "limit": 1000
  }
}
```

---

## 🗄️ Database Models

### User Model
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | User's full name (min 2 chars) |
| `email` | String | Unique email address |
| `password` | String | Hashed password (min 6 chars) |
| `role` | String | User role (`user` or `admin`) |
| `accountStatus` | Boolean | Account active status |
| `createdAt` | Date | Registration timestamp |
| `updatedAt` | Date | Last update timestamp |

### API Key Model
| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId | Reference to User |
| `name` | String | Key identifier name |
| `rawKey` | String | Plain API key (dev only) |
| `tokenHash` | String | Hashed API key |
| `active` | Boolean | Key validity status |
| `expiresAt` | Date | Optional expiration date |
| `createdAt` | Date | Creation timestamp |

### Token Blacklist Model
| Field | Type | Description |
|-------|------|-------------|
| `token` | String | Blacklisted JWT token |
| `createdAt` | Date | Blacklist timestamp |

---

## 🔐 Security Features

| Feature | Implementation |
|---------|----------------|
| **Password Hashing** | bcrypt with salt rounds of 10 |
| **JWT Tokens** | 1-hour expiration, secret-based signing |
| **Token Blacklisting** | Database-backed revocation |
| **Request Validation** | express-validator middleware |
| **CORS Protection** | Whitelisted origins only |
| **Input Sanitization** | Mongoose schema validation |
| **Account Status Check** | Blocks deactivated accounts |

---

## 💻 Development

### Available Scripts

```bash
# Start production server
npm start

# Start development server with hot reload
npm run dev

# Debug mode
npm run dev   # Includes --inspect flag
```

### CORS Configuration

Allowed origins (update in `app.js`):
```javascript
origin: [
  "http://localhost:5173",
  "http://192.168.31.48:5173",
]
```

### Debug Logging

The application includes console logging for:
- Database connection status
- Server startup confirmation
- JWT verification errors
- Request routing (commented by default)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Code Style
- Use ES Modules (`import`/`export`)
- Follow existing file structure patterns
- Add comments for complex logic
- Validate all user inputs

---

## 📄 License

This project is licensed under the **ISC License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**ezice**

- GitHub: [@esyice](https://github.com/esyice)

---

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) — Fast, unopinionated web framework
- [MongoDB](https://www.mongodb.com/) — Document database
- [JWT.io](https://jwt.io/) — JSON Web Token debugger

---

<p align="center">
  <b>⭐ Star this repository if you found it helpful!</b>
</p>
