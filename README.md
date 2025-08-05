# Ramaera Industries – Website Backend 🏢

This is the official backend codebase for the **Ramaera Industries** public website. It powers the website's contact forms, career applications, email notifications, and content management APIs, using modern Node.js architecture.

---

## 🛠️ Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/)
- **Email Service:** [Nodemailer](https://nodemailer.com/)
- **Environment Config:** `dotenv`
- **Validation:** `express-validator` / `joi` (optional)
- **Security:** Helmet, CORS
- **Logging:** Morgan

---

## ✨ Features

- 📬 Contact form API to receive user inquiries
- 🧑‍💼 Career form API to handle job applications
- 📧 Automatic email notifications to admins using Nodemailer
- 🗂️ Content APIs for About, Services, etc. (optional CMS-style)
- 🔐 Admin-auth protected routes (JWT or token-based)
- 🧾 Clean RESTful structure with modular routing

---

## 📁 Folder Structure

```bash
ramaera-backend/
│
├── controllers/      # Route logic (contact, careers, etc.)
├── models/           # Mongoose schemas
├── routes/           # API route definitions
├── config/           # DB connection, mailer, and global configs
├── utils/            # Helper utilities (validators, logger, etc.)
├── middlewares/      # Custom middlewares (auth, error handlers)
├── .env              # Environment variables
├── app.js            # Express app entry
├── server.js         # Main server file
└── README.md         # You're here!



🚀 Getting Started
Prerequisites
Node.js v16+

MongoDB Atlas or local MongoDB

Yarn or npm

Install and Run Locally
bash
Copy
Edit
# 1. Clone the repo
git clone https://github.com/your-org/ramaera-backend.git
cd ramaera-backend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Start the server
npm run dev
🧾 Example .env Configuration
env
Copy
Edit
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ramaera?retryWrites=true&w=majority
ADMIN_EMAIL=admin@ramaera.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
