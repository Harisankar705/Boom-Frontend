✅ Boom Frontend - README.md
md
Copy
Edit
# 🎬 Boom - Frontend

Welcome to **Boom**, a MERN-stack-based video sharing and monetization platform. This repository contains the frontend built with **React** and **TypeScript**.

### 🔗 Live Demo
📺 Watch a walkthrough here: [YouTube Demo](https://www.youtube.com/watch?v=0mQErryCRSE)

---

## 🚀 Features

- 🎥 Upload and view long-form videos
- 💰 Wallet integration for purchases and gifts
- 🔐 User authentication (email + Google)
- 🛒 Purchase/pay-to-view content
- 🎁 Gift tokens to video creators
- 👤 User profiles and purchase history

---

## 🧑‍💻 Tech Stack

- React with TypeScript
- React Router
- Tailwind CSS
- Context API (Auth & Wallet)
- Axios for API requests

---

## 🔧 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Harisankar705/Boom-Frontend.git
cd Boom-Frontend
2. Install Dependencies
bash
Copy
Edit
npm install
3. Setup Environment
Create a .env file in the root with:

env
Copy
Edit
VITE_BACKEND_URL=http://localhost:5173
Adjust this URL based on your backend server address.

4. Run the Development Server
bash
Copy
Edit
npm run dev
📁 Folder Structure
cpp
Copy
Edit
src/
├── components/         // Reusable UI components
├── context/            // Auth and Wallet context
├── pages/              // Page components
├── utils/              // Axios config, helpers
└── App.tsx             // Root component
🤝 Contribution
Feel free to fork and contribute to this project. PRs are welcome!