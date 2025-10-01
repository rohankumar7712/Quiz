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
## 📂 Project Structure

QuizApp/
│
├── admin/ # Admin pages
│ ├── createQuiz.html
│ ├── dashboard.html
│ ├── performance.html
│ ├── quizHistory.html
│ ├── review.html
│ ├── studentAllowance.html
│ └── studentManage.html
│
├── student/ # Student pages
│ ├── dashboard.html
│ ├── history.html
│ ├── quiz.html
│ ├── result.html
│ └── takeQuiz.html
│
├── js/ # JavaScript files
│ ├── admin.js
│ ├── quiz.js
│ └── student.js
│
├── .css # Stylesheets folder
├── .firebaserc # Firebase project config
├── firebase.json # Firebase hosting config
├── 404.html # Error page
├── admin.html # Admin entry point
├── student.html # Student entry point
├── quiz.html # Common quiz page
├── review.html # Review page
└── index.html # Main entry point



---

## ⚙️ Setup & Run  

### 🔹 Run Locally  
1. **Clone the repository**  
   ```bash
   git clone https://github.com/rohankumar7712/QuizApp.git
   cd QuizApp


Open in browser

Just double-click index.html to open in your browser.

🔹 Deploy on Firebase (Optional)

Install Firebase CLI:

npm install -g firebase-tools


Login to Firebase:

firebase login


Deploy to Firebase Hosting:

firebase deploy



