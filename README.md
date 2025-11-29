# YouTube AI Agent Frontend

This repository contains the frontend application for the YouTube AI Agent project. The application is built using **Next.js**, **React**, and **Tailwind CSS**, and communicates with the MCP backend to perform actions such as liking, commenting, and subscribing to YouTube videos.

---

## 🚀 Features

* 🔐 Google OAuth Login (YouTube Authentication)
* ▶️ Watch YouTube videos directly inside the app
* 💬 Comment using AI-generated responses
* 👍 Auto-like videos
* 🔔 Auto-subscribe to channels
* 🤖 Uses MCP (Model Context Protocol) to interact with AI tools
* ⚡ Fast and optimized UI using Turbopack

---

## 📂 Project Structure

```
frontend/
│── app/
│   ├── auth/
│   │   └── callback/page.tsx
│   ├── page.tsx
│── components/
│   ├── VideoCard.tsx
│   ├── CommentBox.tsx
│   | 
│── lib/
│   ├── api.js
│   |
│── public/
│── README.md
│── package.json
```

---

## 🛠️ Tech Stack

* **Next.js 14+** (App Router)
* **React 18**
* **Tailwind CSS**
* **ShadCN UI** components
* **Google OAuth**
* **YouTube Data API v3**
* **MCP Client** for AI actions

---

## 🔧 Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone <repo_url>
cd frontend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create `.env.local`

Create a new file:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

### 4️⃣ Run the development server

```bash
npm run dev
```

App will run at: **[http://localhost:3000](http://localhost:3000)**

---

## 🔗 Backend Integration

The frontend communicates with your MCP agent backend for:

* AI-generated comments
* Liking videos
* Subscribing to channels

Backend repo: *(Add link here)*

---

## 🧪 Build for Production

```bash
npm run build
npm start
```

---

