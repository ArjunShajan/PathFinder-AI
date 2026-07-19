# 🧭 PathFinder AI

An AI-powered **Career Discovery & Skill Development Platform** that helps students and professionals identify suitable career paths, analyze their skills, discover skill gaps, and generate personalized learning roadmaps using Artificial Intelligence.

---

## 📌 Features

* 🤖 AI-powered career recommendations
* 📄 Resume and skill analysis
* 🎯 Personalized career guidance
* 📚 Skill gap identification
* 🛣️ AI-generated learning roadmap
* 💬 AI career assistant powered by Groq
* 📊 Interactive user dashboard
* 🔐 Secure user authentication using JWT
* ⚡ Fast and responsive web application

---

## 🛠️ Tech Stack

### Frontend
* React.js
* Vite
* React Router
* Axios
* CSS

### Backend
* Python
* FastAPI
* SQLAlchemy
* SQLite
* JWT Authentication
* Pydantic

### AI & Machine Learning
* Groq API
* Natural Language Processing (NLP)
* Prompt Engineering

---

## 📂 Project Structure

```text
PathFinder-AI/
│
├── backend/
│   ├── app/
│   ├── requirements.txt
│   ├── .env
│   └── main.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── README.md
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ArjunShajan/PathFinder-AI.git
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

**Linux/macOS**

```bash
source venv/bin/activate
```

Install the required packages

```bash
pip install -r requirements.txt
```

Create a `.env` file

```env
GROQ_API_KEY=your_groq_api_key
SECRET_KEY=your_secret_key
```

Run the backend server

```bash
uvicorn app.main:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

---

### 3. Frontend Setup

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🧠 How It Works

1. User signs in to the platform.
2. User enters skills or uploads career-related information.
3. AI analyzes the user's profile.
4. Suitable career paths are recommended.
5. Missing skills are identified.
6. A personalized learning roadmap is generated.
7. Users can interact with the AI Career Assistant for additional guidance.

---

## 📋 Requirements

* Python 3.10+
* Node.js 18+
* npm
* FastAPI
* React
* SQLite
* Groq API Key

---

## 📷 Screenshots

Add screenshots of:

* 🏠 Home Page
* 🔐 Login/Register
* 📊 Dashboard
* 🎯 Career Recommendations
* 🛣️ Learning Roadmap
* 💬 AI Career Assistant

Example:

```text
screenshots/
├── home.png
├── login.png
├── dashboard.png
├── roadmap.png
└── recommendation.png
```

---

## 🌟 Future Enhancements

* 📄 Resume PDF Parsing
* 🎤 AI Mock Interview Module
* 💼 Job Recommendation Engine
* 📈 Skill Progress Tracking
* 🌐 Multi-language Support
* ☁️ Cloud Deployment
* 📱 Mobile Application
* 🔗 LinkedIn Integration


---

## 👨‍💻 Author

**Arjun Shajan**

B.Tech – Artificial Intelligence & Data Science

📧 Email: **arjunshajan193@gmail.com**

🌐 GitHub: **https://github.com/ArjunShajan**

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.
