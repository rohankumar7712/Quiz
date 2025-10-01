# 📚 QuizApp  

A simple and interactive **Quiz Application** built with HTML, CSS, JavaScript, and Firebase.  
The app provides two roles: **Admin** and **Student**, each with their own dashboards and functionalities.  

---
🛠️ Tech Stack

Frontend: HTML, CSS, JavaScript

Hosting & Config: Firebase

Database : Firebase Firestore

---

## 🚀 Features  

### 👨‍🏫 Admin (Teacher/Manager Role)  
The **Admin** manages quizzes and students.  

- **Create quizzes** → Set questions, options, and correct answers.  
- **Manage students** → Add, remove, or update student information.  
- **View quiz history** → Check records of all created/taken quizzes.  
- **Track performance** → Analyze student scores and progress.  
- **Review quizzes** → Moderate and review quiz submissions.  
- **Dashboard** → Central panel for admin actions.  

### 👩‍🎓 Student (Learner Role)  
The **Student** participates in quizzes and checks results.  

- **Dashboard** → Shows progress, upcoming quizzes, and results.  
- **Take quizzes** → Interface to answer quiz questions.  
- **View results** → Displays scores and performance.  
- **Quiz history** → See all previously attempted quizzes.  
- **Available quizzes** → Browse and attempt quizzes.  

---

## ⚙️ Setup & Run  

### 🔹 Run Locally  
1. **Clone the repository**  
   ```bash
   git clone https://github.com/rohankumar7712/QuizApp.git
   cd QuizApp

2. **Open in browser**  
  Simply double-click index.html or right-click → Open with → Browser.
Your app should now load locally.
### 🔹 Deploy on Firebase
1. **Install Firebase CLI**  
    ```bash
   npm install -g firebase-tools
2. **Login to Firebase**
    ```bash
    firebase login
3. **Initialize Firebase in your project (if not done already)**
    ```bash
    firebase init

    Select Hosting
    Choose your Firebase project
    Set public folder as your deployment folder (e.g., . or build)
    Configure as a single-page app if using SPA (Yes/No as needed)
4. **Deploy to Firebase Hosting**
    ```bash
    firebase deploy
