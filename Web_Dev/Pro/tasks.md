# 🔴 Pro (Advanced) Task – Build a Form Page with Error Handling & Database Connection

Welcome to the **Pro Level Web Development Challenge** for the Nile GDSC Web Dev Team!  
This task tests your ability to combine **frontend, backend, and database logic** into a seamless, user-friendly application.

---

## 🎯 Objective

Create a **form submission system** with **real-time error handling** and **database connectivity**.  
You’ll be building a small but complete app that captures data from users, validates it, and stores it safely in a database.

---

## 🧩 Requirements

### 🧱 Core Features

1. Use **Node.js (Express)** for the backend.  
2. Create a **form** (e.g., user registration, feedback, or contact form) that collects:
   - **Name**  
   - **Email**  
   - **Message / Feedback**  
3. **Validate all inputs**:
   - No empty fields  
   - Valid email format  
   - Handle invalid inputs gracefully  
4. Implement **error handling** using a **toast notification library** (such as `react-hot-toast`, `react-toastify`, or any preferred alternative).  
5. Connect your app to **any database** of your choice:
   - **MongoDB**
   - **PostgreSQL**
   - **Firebase**
   - **SQLite**
   - (or another equivalent)
6. Display a **success toast** after a successful submission.

---

## 🖥️ Technical Requirements

- **Frontend:** HTML/CSS/JS or React (your choice)  
- **Backend:** Node.js with Express  
- **Database:** Any supported DB (MongoDB, PostgreSQL, etc.)  
- Proper folder structure:
```
project/
├── client/
│ └── (frontend files)
├── server/
│ ├── server.js
│ └── db/
│ └── connection.js
└── package.json
```

- Implement **error and success handling** both on frontend and backend.  
- Use **environment variables** for database credentials.  

---

## 🌟 Bonus (Optional Enhancements)

- 🚀 **Deploy your backend** using Render, Vercel, or Netlify.  
- 🔐 Add **authentication** (JWT or session-based).  
- 📊 Include a **dashboard** page to display submitted entries.  

---

## 🧪 Grading Focus

| Area | Description |
|------|--------------|
| 🧱 Backend Structure | Organized, modular Express server setup |
| 🗃️ Data Handling | Secure database operations (CRUD basics) |
| 🧠 Validation | Robust client & server-side form validation |
| 🚨 Error Handling | Toast notifications for errors and successes |
| 🎨 UI/UX | Clean design, smooth user experience |
| ⚙️ Deployment | Properly hosted backend and database integration |

---

## 🚀 Submission Instructions

1. **Fork this repository** to your GitHub account.  
2. Complete your project inside the `starter/` folder.  
3. **Commit and push** your changes to your forked repository.  
4. Deploy your app if possible (bonus points!).  
5. Submit a **Pull Request** titled:  
 `submission: [Your Name] - Form Page with Database`

---

## 💬 Need Help?

- Review the `tasks.md` and this `README` carefully.  
- Check out resources like:
- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://www.mongodb.com/docs/)
- [React Toastify](https://fkhadra.github.io/react-toastify/introduction)
- Reach out on the **GDSC Web Dev Group Chat** if you have questions.

---

## ✨ Final Note

This challenge simulates a **real-world web app workflow** — frontend + backend + database + UX.  
Focus on **clean code**, **maintainable structure**, and **smooth user experience**.  
Good luck building your app! 💻🔥
