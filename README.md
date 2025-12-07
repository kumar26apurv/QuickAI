# ⚡ QuickAI – Full Stack AI SaaS Application (PERN Stack)
QuickAI is a powerful **AI SaaS platform** built using the **PERN Stack (PostgreSQL, Express, React, Node.js)** that provides multiple AI-powered tools under a subscription-based model. This project demonstrates how to create, scale, and deploy a real-world SaaS application with modern UI, secure authentication, and premium AI features.

## 🚀 Project Overview
QuickAI allows users to access multiple AI utilities through a single platform with free and premium plans. It integrates AI APIs, subscription billing, serverless database, and cloud-based image processing to deliver a complete SaaS experience.

This project is ideal for showcasing:

* Full Stack Development Skills
* SaaS Architecture Knowledge
* AI Integration Expertise
* Payment & Subscription Handling

---

## 🌐 Live Preview

🔗 **Live App:** [https://quick-ai-liart-two.vercel.app/](https://quick-ai-liart-two.vercel.app/)

---

## 🧠 AI Features

* ✍️ **Article Generator** – Provide title & length to generate AI-written articles
* 📰 **Blog Title Generator** – Input keyword & category to get SEO-friendly blog titles
* 🎨 **Image Generator** – Generate AI images using text prompts
* 🪄 **Background Remover** – Upload image and get transparent background
* ✂️ **Object Remover** – Remove specific objects from uploaded images
* 📄 **Resume Analyzer** – Upload resume and receive AI-powered feedback

---

## 🔧 Tech Stack

### Frontend

* React JS
* Vite
* Tailwind CSS
* Clerk Authentication

### Backend

* Node.js
* Express.js
* PostgreSQL (Neon Serverless)
* Groq AI API
* Cloudinary

---

## ✨ Core Features

* 🔐 Secure User Authentication (Clerk)
* 💳 Subscription Billing System
* 🧾 Usage Limit for Free Users
* ⚡ Premium AI Features Unlock
* 🗄️ Serverless PostgreSQL (Neon)
* ☁️ AI Image Processing via Cloudinary
* 📊 Dashboard for User Activity

---

## 📦 Installation Guide

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd quickai
```

### 2️⃣ Install Dependencies

#### Client

```bash
cd client
npm install
npm run dev
```

#### Server

```bash
cd server
npm install
npm start
```

---

## 🔐 Environment Variables

### Client `.env`

```
VITE_CLERK_PUBLISHABLE_KEY=
VITE_BASE_URL=
```

### Server `.env`

```
DATABASE_URL=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
GROQ_API_KEY=
CLIPDROP_API_KEY=
CLOUDINARY_CLDN_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 🗂️ Folder Structure

```
quickai/
├── client/
│   ├── src/
│   ├── components/
│   └── pages/
├── server/
│   ├── routes/
│   ├── controllers/
│   └── models/
```

---

## 📈 SaaS Workflow

1. User signs up via Clerk
2. Selects AI tool from dashboard
3. Free or Premium plan validation
4. AI request processed
5. Result delivered in real-time

---

## 🛠 Deployment

* Frontend: Vercel
* Backend: Render / Railway
* Database: Neon PostgreSQL
* Image Processing: Cloudinary

---

## ✅ Why This Project Stands Out

* Demonstrates complete SaaS architecture
* Shows mastery of AI integrations
* Covers subscription & role management
* Production-ready structure
* Scalable full stack design

Perfect project to add in your portfolio or resume 🚀

---

## 🙌 Support & Feedback

If you found this project helpful, consider:

* ⭐ Starring the repository
* 📢 Sharing with others
* ☕ Supporting the creator

---

## ❤️ Final Note

QuickAI is more than just a project — it's a complete demonstration of how modern AI SaaS platforms are built from scratch using scalable technologies.

Happy Building! 🚀
