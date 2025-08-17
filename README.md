# SkillSphere – AI Assisted Learning Platform (Backend)

This is the backend service for **SkillSphere**, an AI-assisted learning platform built with the MERN stack.  
It provides authentication, user management, and role-based access control as the foundation for the system.  

---

## 🚀 Tech Stack
- **Node.js** with **Express.js** – Backend framework
- **MongoDB** with **Mongoose** – Database
- **JWT (JSON Web Tokens)** – Authentication
- **Bcrypt.js** – Password hashing
- **Cookie-based auth (HTTP-only cookies)** – Secure token storage

---

## 📅 Development Progress

### ✅ Day 1: Project Setup
- Initialized project structure
- Setup backend environment (`/backend`)
- Installed core dependencies (express, mongoose, dotenv, nodemon)

### ✅ Day 2: User Authentication (Register & Login)
- Added **User model** with schema (name, email, password)
- Implemented **password hashing** with `bcrypt` (`userSchema.pre('save')`)
- Created **isCorrectPassword()** method for login
- Built **register** and **login** APIs
- Setup **JWT generation** (access + refresh tokens)
- Stored tokens in **HTTP-only cookies**

### ✅ Day 3: JWT Middleware & Refresh Token
- Connected backend to MongoDB
- Implemented **JWT middleware** to protect API routes
- Added **refresh token** handling on login
- Ensured tokens are verified before allowing protected requests

### ✅ Day 4: User Profile API
- Added `GET /api/v1/users/me` endpoint (get current logged-in user)
- Token-based user identification via middleware
- Updated controllers & routes for profile management

### ✅ Day 5: Role-Based Access Control
- Added **role field** to `User` model (`user.models.js`)
- Created `roleMiddleware.js` to restrict APIs by user role
- Implemented **user controller & routes** for role-based endpoints
- Example: only `admin` can access admin APIs
- Best commit practices applied:
  - `feat(user): add user controller and routes`
  - `feat(auth): add role-based middleware for access control`

---

## 🔐 Authentication Flow
1. User registers → password is hashed with bcrypt → stored in DB  
2. On login → server generates:
   - **Access Token** (short-lived, stored in HTTP-only cookie)
   - **Refresh Token** (longer-lived, also stored in cookie & DB)  
3. Protected routes use **JWT middleware** to validate access token  
4. Role-based middleware ensures only specific roles can access certain APIs  

---

## 📂 Project Structure (Backend)
backend/
|--src/
| |---controllers/
| | |---auth.controller.js
| | |---user.controller.js
| |
| |---middlewares/
| | |---authMiddleware.js
| | |---roleMiddleware.js
| |
| |---models/
| | |---user.models.js
| |
| |---routes/
| | |---auth.route.js
| | |---user.route.js
| |
| |---app.js
|
|--server.js
|--package.json
|--.env
|--README.md



