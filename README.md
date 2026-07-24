# AI-Based Books Recommendation Management System

**Case Study:** ES Kagarama Library  
**Author:** Komezusenge Javan (BBICTR/2023/67884)  
**Institution:** Mount Kigali University  

## 📖 Overview
This project is a decoupled, modern web application designed to digitize and enhance the library management operations at ES Kagarama. Moving beyond a standard digital catalog, it integrates the **Google Gemini 2.5 Flash API** to act as an intelligent "AI Librarian," generating context-aware reading recommendations based on individual student borrowing histories.

## ✨ Core Features
* **Role-Based Access Control (RBAC):** Strict JWT-secured routing for Students, Librarians, and Administrators.
* **Intelligent Recommendations:** Uses Google's Gemini LLM to analyze student reading patterns and suggest new books.
* **Real-Time Inventory Synchronization:** Automatically decrements physical book stock upon checkout and prevents negative stock values.
* **Automated Cover Fetching:** Integrates with the Google Books API to automatically pull high-quality book covers during data entry.

## 🛠️ Technology Stack
* **Frontend Layer:** React.js (Vite), Tailwind CSS, React Router, Axios.
* **Backend Layer:** Python, Django, Django REST Framework.
* **Database:** PostgreSQL (Production) / SQLite (Local Dev).
* **Authentication:** JSON Web Tokens (`rest_framework_simplejwt`).
* **AI Integration:** `google-genai` SDK.

## 🚀 Local Setup & Installation

### 1. Backend (Django API)
Navigate to the backend directory and set up your Python environment:
```bash
cd backend
python -m venv env
source env/Scripts/activate  # On Windows use: .\env\Scripts\activate
pip install -r requirements.txt

Create a .env file in the backend root and add your Google Gemini API Key:

Plaintext
GEMINI_API_KEY=your_secret_api_key_here
Run the database migrations and start the server:

Bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
2. Frontend (React UI)
Open a new terminal, navigate to the frontend directory, and install the Node dependencies:

Bash
cd frontend
npm install
npm run dev
The application will be available at http://localhost:5173.