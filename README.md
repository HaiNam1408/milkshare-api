# Mia Milkshare API

## 📌 Introduction
Mia Milkshare API is a backend system built with **Node.js** and **Express.js** to provide APIs for the Mia Milkshare application. The project utilizes **Sequelize** as an ORM and supports **PostgreSQL** as the primary database.

## 🚀 Technologies Used
- **Node.js** - JavaScript runtime environment
- **Express.js** - Backend framework for Node.js
- **Sequelize** - ORM for managing PostgreSQL database
- **PostgreSQL** - Relational database management system
- **JWT (JSON Web Token)** - Authentication and authorization
- **Socket.io** - Real-time communication support
- **Multer** - File upload management
- **Firebase Admin** - Push notification support
- **Cloudflare R2** - Cloud file storage

## 📂 Project Structure
```
📦 mia_milkshare_api
 ┣ 📂 config/            # Environment and database configuration
 ┣ 📂 controllers/       # API logic controllers
 ┣ 📂 middlewares/       # Middleware for request handling
 ┣ 📂 models/            # Sequelize models
 ┣ 📂 routes/            # API route definitions
 ┣ 📂 services/          # Business logic processing
 ┣ 📂 utils/             # Utility functions
 ┣ 📜 server.js          # Application entry point
 ┣ 📜 .env               # Environment configuration
 ┣ 📜 package.json       # Dependency management
```

## ⚙️ Installation & Running the Application
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/mia_milkshare_api.git
cd mia_milkshare_api
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file based on `.env.example` and update the configuration:
```env
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/mia_milkshare_db
JWT_SECRET=your_secret_key
```

### 4️⃣ Run Database Migrations
```sh
npm run db:migrate
```

### 5️⃣ Start the Server
```sh
npm run dev   # Run in development mode
npm start     # Run in production mode
```

## 📌 API Documentation
Swagger is integrated to provide API documentation.
- After running the server, visit **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)** to access the API documentation.

## 📡 WebSocket Support
The application supports **Socket.io** for real-time features like chat or notifications.

## ✨ Key Features
✅ User account management (registration, login, JWT authentication)
✅ Post, comment, and favorite management
✅ File upload support via Cloudflare R2
✅ Push notification support via Firebase
✅ Real-time communication with Socket.io

## 🛠️ Dev Tools & Debugging
- **Morgan** - Request logging
- **Nodemon** - Auto-restart server on code changes
- **Postman** - Manual API testing
- **Sequelize CLI** - Database migrations management

## 🤝 Contribution
If you want to contribute to the project, fork this repository and create a pull request.

## 📄 License
This project is released under the **ISC License**.

