# 🧭 PathFinder AI

> **An AI-powered career guidance platform that helps users discover suitable career paths, identify skill gaps, generate personalized learning roadmaps, and prepare for interviews.**

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-AI-blue?style=for-the-badge)

---

## 📖 Overview

PathFinder AI is an intelligent career guidance platform designed to help students and professionals make informed career decisions. The application analyzes user skills, recommends suitable career paths, identifies missing skills, generates personalized learning roadmaps, and assists with interview preparation using AI.

---

## ✨ Features

- 🤖 AI-based Career Recommendation
- 📄 Resume & Skill Analysis
- 🎯 Personalized Career Suggestions
- 📚 Skill Gap Identification
- 🛣️ AI-Generated Learning Roadmap
- 🎤 Interview Question Generation
- 💬 AI Career Mentor
- 📊 Interactive Dashboard
- 🔐 Secure User Authentication
- 📱 Responsive User Interface

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- Framer Motion
- Recharts

### Backend
- FastAPI
- Python
- SQLAlchemy
- JWT Authentication
- SQLite
- Pydantic

### AI & Machine Learning
- Groq API
- NLP
- Career Recommendation Engine

---

## 📂 Project Structure

```
PathFinder-AI
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ArjunShajan/PathFinder-AI.git
```

```bash
cd PathFinder-AI
```

---

### 2. Backend Setup

```bash
cd backend
```

Create a virtual environment

```bash
python -m venv venv
```

Activate it

**Windows**

```bash
venv\Scripts\activate
```

**Linux/Mac**

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Create a `.env` file

```env
GROQ_API_KEY=your_api_key_here
SECRET_KEY=your_secret_key
```

Run the backend

```bash
uvicorn app.main:app --reload
```

Backend runs at

```
http://127.0.0.1:8000
```

---

### 3. Frontend Setup

```bash
cd frontend
```

Install packages

```bash
npm install
```

Start the development server

```bash
npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

## 📸 Screenshots

Add screenshots of:

- 🏠 Home Page
- 🔐 Login/Register
- 📊 Dashboard
- 🎯 Career Recommendation
- 🛣️ Learning Roadmap
- 🤖 AI Chat Assistant

Example:

```
screenshots/
├── home.png
├── dashboard.png
├── roadmap.png
└── recommendation.png
```

---

## 🔮 Future Enhancements

- Resume PDF Upload
- Job Recommendation Engine
- LinkedIn Integration
- AI Mock Interviews
- Voice-based Career Assistant
- Multi-language Support
- Cloud Deployment

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Add new feature"
```

4. Push changes

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 👨‍💻 Author

**Arjun Shajan**

- GitHub: https://github.com/ArjunShajan
- Email: arjunshajan193@gmail.com

---

## ⭐ Support

If you found this project helpful, please consider giving it a **⭐ Star** on GitHub.

It helps others discover the project and supports future development.

---

## 📄 License

This project is licensed under the **MIT License**.
