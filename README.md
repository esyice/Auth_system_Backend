# 🔐 Auth System Backend

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-v5.1-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Redis-Token%20Blacklist-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis">
  <img src="https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" alt="License">
</p>

A robust, secure, and scalable **authentication system backend** built with Node.js, Express, and MongoDB. Designed to be a reusable auth layer across multiple projects — supporting native users, external project users (via API keys), OTP-based password reset, and a full developer API for user management.

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
  - [External Auth (v1)](#external-auth-endpoints-v1)
  - [Developer Routes](#developer-routes)
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
- **User Login** — JWT-based authentication with access + refresh tokens
- **User Logout** — Redis-backed token blacklisting for secure session termination
- **Account Deactivation** — Soft delete functionality for user accounts
- **OTP Verification** — Send & verify time-limited one-time passwords via email
- **Password Reset** — Secure password reset flow (OTP → reset)

### 🌐 **External Auth (API-Key Gated)**
- **External User Registration** — Register users into a specific project via API key
- **External User Login** — Authenticate external/project users with API key validation

### 👨‍💻 **Developer Dashboard**
- **List Project Users** — Get all users of a project (with pagination, search, sort)
- **Update Project User** — Update a specific user's details within a project
- **Delete Project User** — Soft delete a user from a project
- **Create Project User** — Programmatically create a user inside a project

### 🔐 **API Key Management**
- **Generate API Keys** — Create secure, hashed API keys for external integrations
- **Revoke Single Key** — Disable an individual API key
- **Revoke All Keys** — Bulk disable all user API keys
- **Regenerate Keys** — Generate new keys while preserving key identity

### 📊 **Dashboard & Analytics**
- **User Dashboard** — View account details, active tokens, and usage stats
- **Token Overview** — List all active API keys with metadata
- **Usage Tracking** — Monitor API usage per key

### 🌍 **Activity Tracking**
- **Login Activity Logging** — Track login attempts with timestamps
- **Geolocation Tracking** — Capture country and city from IP address
- **Logout Activity** — Record session terminations

### 🛡️ **Security**
- **JWT Token Verification** — Middleware for all protected routes
- **Redis Token Blacklisting** — Fast, in-memory revocation of JWTs
- **API Key Middleware** — `verifyApiKey` middleware for external route protection
- **Password Hashing** — bcrypt with configurable salt rounds
- **CORS Configuration** — Whitelisted origins only
- **Input Validation** — express-validator for request validation
- **OTP Expiry** — Time-limited OTPs stored with TTL in MongoDB

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js v5** | Web application framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB object modeling (ODM) |
| **Redis** | Token blacklisting & session invalidation |
| **JWT** | JSON Web Token authentication |
| **bcrypt** | Password hashing |
| **geoip-lite** | IP-based geolocation |
| **express-validator** | Request validation middleware |
| **dotenv** | Environment variable management |
| **cors** | Cross-Origin Resource Sharing |
| **axios** | HTTP client (for external requests) |
| **cookie-parser** | Cookie parsing middleware |
| **validator** | String validation utilities |
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
│   ├── redis.js              # Redis connection configuration
│   └── jwt.js                # JWT configuration
│
├── 📂 controllers/
│   ├── 📂 auth/
│   │   ├── loginController.js              # Handle user login
│   │   ├── registerController.js           # Handle user registration
│   │   ├── logoutController.js             # Handle user logout
│   │   ├── deactivateAccountController.js  # Account deactivation
│   │   ├── resetPasswordController.js      # Password reset handler
│   │   └── 📂 otp/
│   │       ├── sendOtpController.js        # Send OTP via email
│   │       └── verifyOtpController.js      # Verify OTP code
│   │
│   ├── 📂 apis/
│   │   ├── createApiController.js              # Create new API key
│   │   ├── revokeSingleKeyController.js        # Revoke single API key
│   │   ├── revokeAllApiKeyController.js        # Revoke all API keys
│   │   └── regenerateSingleKeyController.js    # Regenerate API key
│   │
│   ├── 📂 dashboard/
│   │   └── dashboardController.js          # Dashboard data aggregation
│   │
│   ├── 📂 developer/
│   │   ├── getAllUsersController.js         # List all project users
│   │   ├── updateUserController.js          # Update a project user
│   │   └── deleteUserController.js          # Soft delete a project user
│   │
│   └── 📂 external/
│       ├── registerExternalController.js    # Register an external user
│       └── loginExternalController.js       # Login an external user
│
├── 📂 middlewares/
│   ├── 📂 auth/
│   │   ├── loginMiddleware.js              # Login request validation
│   │   ├── registerMiddleware.js           # Registration validation
│   │   └── logoutMiddleware.js             # Logout validation
│   │
│   ├── 📂 jwt/
│   │   └── jwtMiddleware.js               # JWT verification & protection
│   │
│   └── 📂 api/
│       └── verifyApiKey.js                # API key validation middleware
│
├── 📂 models/
│   ├── 📂 users/
│   │   ├── User.js                    # Native user schema
│   │   ├── ExternalUser.js            # External/project user schema
│   │   ├── LoginActivity.js           # Login activity tracking
│   │   └── LogoutActivity.js          # Logout activity tracking
│   │
│   ├── 📂 jwt/
│   │   ├── RefreshToken.js            # Refresh token storage
│   │   └── TokenBlacklist.js          # Blacklisted tokens (DB fallback)
│   │
│   ├── 📂 apis/
│   │   └── Apikeys.js                 # API keys schema
│   │
│   ├── 📂 verification/
│   │   └── OtpVerification.js         # OTP records with expiry
│   │
│   └── Usage.js                       # API usage tracking
│
├── 📂 routes/
│   ├── globalRoutes.js                # Main route aggregator
│   ├── authRoutes.js                  # Authentication routes
│   ├── apiRoutes.js                   # API key management routes
│   ├── externalRoutes.js              # External (v1) auth routes
│   └── developerRoutes.js             # Developer project-user routes
│
├── 📂 services/
│   ├── emailService.js                # Email / OTP notification service
│   └── tokenService.js                # Token generation service
│
└── 📂 utils/
    ├── validators.js                  # Custom validation helpers
    └── attachProjectContext.js        # Middleware utility for project context
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher) — [Download](https://nodejs.org/)
- **MongoDB** (v6.0+) — [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Redis** — [Download](https://redis.io/download) or use a managed service (e.g., Redis Cloud, Upstash)
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

5. **Start Redis** (if running locally)
   ```bash
   redis-server
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **For production**
   ```bash
   npm start
   ```

The server will start at `http://localhost:3000` (or your configured `PORT`).

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/auth_system

# Redis Connection
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=7d

# Email / OTP Service
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=noreply@example.com
EMAIL_PASS=your_email_password
```

> ⚠️ **Important:** Never commit your `.env` file to version control. It is already included in `.gitignore`.

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
  "user": { "id": "64abc123...", "name": "John Doe", "email": "john@example.com" }
}
```

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
  "token": "eyJhbGci...",
  "user": { "id": "64abc123...", "name": "John Doe", "email": "john@example.com" }
}
```

| Status | Message |
|--------|---------|
| 400 | All fields are required / Invalid email or password |
| 403 | Account is deactivated. Contact admin. |
| 404 | User not found |

---

#### 🚪 Logout User
```http
POST /api/auth/logout
```
**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{ "success": true, "message": "Logged out successfully" }
```

---

#### ⛔ Deactivate Account
```http
PUT /api/auth/account/deactivate
```
**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{ "success": true, "message": "Account deactivated successfully" }
```

---

#### 📧 Send OTP
```http
POST /api/auth/send-otp
```

**Request Body:**
```json
{ "email": "john@example.com" }
```

**Success Response (200):**
```json
{ "success": true, "message": "OTP sent to your email" }
```

---

#### ✅ Verify OTP
```http
POST /api/auth/verify-otp
```

**Request Body:**
```json
{ "email": "john@example.com", "otp": "123456" }
```

**Success Response (200):**
```json
{ "success": true, "message": "OTP verified successfully" }
```

---

#### 🔒 Reset Password
```http
POST /api/auth/reset-password
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newSecurePass456"
}
```

**Success Response (200):**
```json
{ "success": true, "message": "Password reset successfully" }
```

---

### API Key Endpoints

> 🔒 **All API key endpoints require JWT authentication**

#### 🆕 Create API Key
```http
POST /api/apikeys/createApiKey
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "My Production Key",
  "expiresAt": "2025-12-31T23:59:59Z"
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
**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{ "success": true, "message": "API key regenerated", "newKey": "ak_live_yyyyyyyy" }
```

---

#### ❌ Revoke Single Key
```http
PUT /api/apikeys/:id/revokeSingleKey
```
**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{ "success": true, "message": "API key revoked successfully" }
```

---

#### 🗑️ Revoke All Keys
```http
PUT /api/apikeys/revokeAllKeys
```
**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{ "success": true, "message": "All API keys revoked", "revokedCount": 5 }
```

---

### Dashboard Endpoints

#### 📊 Get Dashboard Data
```http
GET /api/dashboard
```
**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "user": { "id": "64abc123...", "name": "John Doe", "email": "john@example.com", "status": true },
  "meta": { "totalTokens": 3, "lastIssuedToken": { "issuedAt": "Jan 15, 2025, 10:30 AM" } },
  "tokens": [
    { "id": "64def789...", "name": "Production Key", "active": true, "key": "ak_live_xxx...", "expiresAt": "Dec 31, 2025, 11:59 PM" }
  ],
  "usage": { "today": 124, "limit": 1000 }
}
```

---

### External Auth Endpoints (v1)

> 🔑 **All `/api/v1` routes require a valid API key in the request header**
>
> `X-API-Key: ak_live_xxxxxxxxxxxxxxxx`

These endpoints allow your **other applications** to register and log in their own users through this auth system.

#### 📝 Register External User
```http
POST /api/v1/register
```
**Headers:** `X-API-Key: <your_api_key>`

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@yourapp.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{ "success": true, "message": "External user registered successfully" }
```

---

#### 🔑 Login External User
```http
POST /api/v1/login
```
**Headers:** `X-API-Key: <your_api_key>`

**Request Body:**
```json
{
  "email": "jane@yourapp.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{ "success": true, "token": "eyJhbGci...", "user": { "id": "...", "email": "jane@yourapp.com" } }
```

---

### Developer Routes

> 🔒 **All `/api/developer` routes require JWT authentication**

These routes allow authenticated developers to programmatically manage users within their projects.

#### 👥 Get All Project Users
```http
GET /api/developer/projects/:projectId/users
```
Supports query params: `page`, `limit`, `search`, `sort`

---

#### ✏️ Update Project User
```http
PUT /api/developer/projects/:projectId/users/:userId
```

---

#### 🗑️ Delete Project User (Soft Delete)
```http
DELETE /api/developer/projects/:projectId/users/:userId
```

---

#### ➕ Create Project User
```http
POST /api/developer/projects/:projectId/users
```

---

## 🗄️ Database Models

### User Model (Native)
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Full name (min 2 chars) |
| `email` | String | Unique email address |
| `password` | String | Hashed password |
| `role` | String | `user` or `admin` |
| `accountStatus` | Boolean | Account active status |
| `createdAt` | Date | Registration timestamp |

### ExternalUser Model
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Full name |
| `email` | String | Email address |
| `password` | String | Hashed password |
| `projectId` | String | Project this user belongs to |
| `accountStatus` | Boolean | Account active status |
| `createdAt` | Date | Registration timestamp |

### API Key Model
| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId | Reference to User |
| `name` | String | Key identifier name |
| `rawKey` | String | Plain API key (dev only) |
| `tokenHash` | String | Hashed API key |
| `active` | Boolean | Key validity status |
| `expiresAt` | Date | Optional expiration date |

### OTP Verification Model
| Field | Type | Description |
|-------|------|-------------|
| `email` | String | Target email address |
| `otp` | String | Hashed OTP code |
| `createdAt` | Date | Issue timestamp (with TTL) |

### Token Blacklist Model
| Field | Type | Description |
|-------|------|-------------|
| `token` | String | Blacklisted JWT token |
| `createdAt` | Date | Blacklist timestamp |

---

## 🔐 Security Features

| Feature | Implementation |
|---------|---------------|
| **Password Hashing** | bcrypt with salt rounds of 10 |
| **JWT Tokens** | Short-lived access tokens, secret-based signing |
| **Redis Token Blacklisting** | In-memory fast revocation on logout |
| **API Key Validation** | Hashed key storage, `verifyApiKey` middleware |
| **OTP Expiry** | Time-limited OTPs with MongoDB TTL index |
| **Request Validation** | express-validator middleware |
| **CORS Protection** | Whitelisted origins only |
| **Input Sanitization** | Mongoose schema validation |
| **Account Status Check** | Blocks deactivated accounts on login |

---

## 💻 Development

### Available Scripts

```bash
# Start production server
npm start

# Start development server with hot reload & inspector
npm run dev
```

### CORS Configuration

Allowed origins (update in `app.js`):
```javascript
origin: [
  "http://localhost:5173",
  "http://192.168.31.48:5173",
  "http://100.85.107.120:5173",
]
```

### Debug Logging

The application includes console logging for:
- Database & Redis connection status
- Server startup confirmation
- JWT verification errors
- Request routing (commented out by default)

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
- [Redis](https://redis.io/) — In-memory data store for token management
- [JWT.io](https://jwt.io/) — JSON Web Token debugger

---

<p align="center">
  <b>⭐ Star this repository if you found it helpful!</b>
</p>
