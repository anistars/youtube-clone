# 🎬 YouTube Clone – MERN Stack

A full-stack YouTube-like video streaming platform built using the **MERN stack**.  
Users can upload, manage, watch, like/dislike videos, comment, and manage their own channels.

---

## 🚀 Features

### 👤 Authentication
- User signup & login (JWT based)
![Login Page](Screenshots/Screenshot%202026-01-04%20223732.png)
![Sign up](Screenshots/Screenshot%202026-01-04%20223757.png)
- Secure protected routes
- User dropdown with channel & video management


### 📺 Video
- Upload videos with thumbnail
- Watch videos with view count
![Video with views](Screenshots/Screenshot%202026-01-04%20225043.png)
- Like & dislike functionality
![Likes](Screenshots/Screenshot%202026-01-04%20225210.png)
![Dislikes](Screenshots/Screenshot%202026-01-04%20225219.png)
- Comment on videos
![Videos with comments](Screenshots/Screenshot%202026-01-04%20225107.png)
Open Channel of Certain person
![Channel](Screenshots/Screenshot%202026-01-04%20225649.png)
### 📂 Channel & Video Management
- Create and manage your own channel
![Create Video](Screenshots/Screenshot%202026-01-04%20224531.png)
- Upload, edit & delete videos
- Edit video details (title, description, tags, category)
- Replace video & thumbnail while editing
![Edit video](Screenshots/Screenshot%202026-01-04%20224547.png)
![Delete Vide](Screenshots/Screenshot%202026-01-04%20224609.png)

### 📌 UI / UX
- YouTube-like layout
- Sidebar always open on Home
- Sidebar collapses on Watch page and slides in on toggle
- Responsive layout
- Modal-based video upload & edit

---

## 🛠 Tech Stack

### Frontend
- React
- React Router
- React Bootstrap
- Axios

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (video & thumbnail uploads)

---

## 📁 Project Structure
client/
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ ├── utils/
│ ├── App.jsx
│ └── main.jsx

server/
├── routes/
├── models/
├── middleware/
├── uploads/
└── index.js


## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

git clone https://github.com/anistars/youtube-clone.git
cd youtube-clone

### 2️⃣ Backend Setup
cd backend
npm install

### 3️⃣ Create .env file
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

### 4️⃣ Start backend server
npm start
http://localhost:5000

### 🌐 Frontend Setup
### 5️⃣ Go to frontend folder
cd frontend
npm install
npm run dev
http://localhost:5173


## 📡 API Endpoints (Key)
| Method | Endpoint                  | Description      |
| ------ | ------------------------- | ---------------- |
| POST   | `/api/auth/login`         | Login            |
| POST   | `/api/auth/register`      | Register         |
| POST   | `/api/videos/upload`      | Upload video     |
| GET    | `/api/videos`             | Get all videos   |
| GET    | `/api/videos/:id`         | Get single video |
| PUT    | `/api/videos/:id`         | Update video     |
| DELETE | `/api/videos/:id`         | Delete video     |
| POST   | `/api/videos/:id/like`    | Like video       |
| POST   | `/api/videos/:id/dislike` | Dislike video    |
| POST   | `/api/videos/:id/comment` | Add comment      |

## 🔐 Authentication Flow

JWT stored in localStorage

Axios interceptor attaches token automatically

Protected routes via middleware

## 👨‍💻 Author

### Aniket Rahalkar
