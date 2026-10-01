# 🌱 KindSwap

### Give What You Can. Get What You Need.

KindSwap is a community-driven resource-sharing platform designed to connect **Donors, NGOs/Volunteers, and Administrators** so that useful resources can reach the people and communities that need them.

Instead of letting usable items go to waste, KindSwap creates a simple digital bridge between people who can give and organizations that can help distribute those resources.

---

## ✨ Why KindSwap?

Every community has unused resources.

Someone may have clothes they no longer need.
Someone else may need them.

Someone may have books sitting unused.
An organization may be looking for educational materials.

**KindSwap connects the two. 🤝**

The platform makes it easier to:

- 🎁 Share unused resources
- 🔎 Discover available resources
- 🤝 Connect donors with NGOs
- 📍 Match resources based on location
- 📦 Track donation progress
- 🌱 Encourage community-driven sharing

---

## 🖥️ Features

### 🔐 Authentication

- User registration and login
- Role-based access
- Donor, NGO/Volunteer, and Administrator roles
- Location/state selection
- Secure backend authentication

### 🎁 Donor Dashboard

Donors can:

- Create new donations
- Add resource descriptions
- Select categories
- Specify quantities
- Track their donations
- View donation status
- Mark assigned resources as delivered

### 🤝 NGO / Volunteer Dashboard

NGOs and volunteers can:

- Browse available resources
- Discover resources in their region
- View matching information
- Request available resources
- Track request status

### 🛠️ Administrator Dashboard

Administrators can:

- View pending requests
- Review resource requests
- Assign donations to NGOs
- Manage the resource-sharing workflow
- Track donation/request status

### 📍 Location-Based Matching

KindSwap uses location information to help connect available resources with relevant requests in the same region.

### 🎨 Modern User Interface

The redesigned interface focuses on:

- Warm community-inspired aesthetics
- Soft gradients
- Rounded cards
- Glassmorphism
- Smooth transitions
- Hover interactions
- Responsive layouts
- Mobile-friendly navigation
- Clear status indicators

---

## 🌿 Design Philosophy

KindSwap follows a visual concept called:

> **Warm Community + Modern Digital**

The interface combines a friendly community feeling with a modern digital experience.

### 🎨 Color Direction

The visual system uses soft, welcoming tones inspired by:

- 🧈 Butter Yellow
- 🍞 Toast
- 💜 Lavender Frost
- 🤍 White Sand
- ☁️ White Smoke

The goal is to make the platform feel:

**Friendly · Trustworthy · Modern · Human · Accessible**

---

## 🔄 How It Works

```text
                    KIND SWAP
                        │
                        ▼
                  Create Account
                        │
             ┌──────────┼──────────┐
             ▼          ▼          ▼
           DONOR       NGO       ADMIN
             │          │          │
             ▼          ▼          ▼
        Add Resource   Browse    Review
             │       Resources   Requests
             │          │          │
             └──────┬───┘          │
                    ▼              ▼
                  MATCH       Assign Resource
                    │              │
                    └──────┬───────┘
                           ▼
                       DELIVERY
                           │
                           ▼
                         IMPACT 🌱
```

## 🧩 Tech Stack
### Frontend
HTML5
CSS3
Vanilla JavaScript
Vite
### Backend
Node.js
Express.js
REST APIs
### Database
MySQL
mysql2
### Development Tools
Git
GitHub
Nodemon
dotenv
## 📁 Project Structure
```text
KindSwap/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── services/
│   │   ├── assets/
│   │   ├── main.js
│   │   └── style.css
│   │
│   └── index.html
│
├── backend/
│   ├── server.js
│   ├── app.js
│   ├── routes/
│   ├── controllers/
│   └── database/
│
├── .gitignore
└── README.md
```
The exact structure may evolve as the project continues to be developed.

##🚀 Getting Started
1. Clone the repository
git clone https://github.com/anushka1330/KindSwap.git
cd KindSwap
2. Install dependencies

Install frontend dependencies:

cd frontend
npm install

Install backend dependencies:

cd ../backend
npm install

3. Configure environment variables

Create the required .env files using the project's environment configuration.

Example:

VITE_API_URL=http://localhost:5000/api

Never commit real API keys, passwords, database credentials, or other secrets.

4. Start the backend
cd backend
npm run dev
5. Start the frontend

In another terminal:

cd frontend
npm run dev

Then open the local Vite URL shown in the terminal.

## 🧪 User Workflow
### Donor
Sign Up / Login
      ↓
Donor Dashboard
      ↓
Create Donation
      ↓
Donation Listed
      ↓
NGO Requests Resource
      ↓
Admin Assigns Resource
      ↓
Donor Delivers
### NGO / Volunteer
Sign Up / Login
      ↓
NGO Dashboard
      ↓
Browse Available Resources
      ↓
Request Resource
      ↓
Admin Reviews Request
      ↓
Resource Assigned
### Administrator
Login
 ↓
Admin Dashboard
 ↓
View Pending Requests
 ↓
Review Request
 ↓
Assign Donation
 ↓
Track Status
📱 Responsive Design

### KindSwap is designed to work across:

🖥️ Desktop
💻 Laptop
📱 Mobile
📟 Tablet

The interface adapts navigation, cards, forms, dashboards, and content layouts for different screen sizes.

### 🔮 Future Improvements

Planned improvements include:

📧 Email OTP authentication

🔔 Real-time notifications

📊 Advanced impact analytics

🗺️ Privacy-friendly community network visualization

💬 Community messaging

🏆 Trust and contribution badges

📈 Donation impact tracking

🔒 Enhanced authentication and security

☁️ Production deployment

### 🎓 Academic Project

KindSwap is developed as a Final Year Project exploring how technology can support community resource sharing and improve the connection between donors and organizations.

The project demonstrates concepts including:

Full-stack web development
REST API architecture
Database integration
Role-based access control
Location-based matching
User experience design
Responsive web development
Git-based development workflow

### 🌱 Vision

A world where useful resources find the people who need them.

KindSwap aims to make giving simpler, discovering resources easier, and community impact more visible.

### 👩‍💻 Developer

Anushka

Final Year Project · KindSwap

### 📄 License

This project is developed for academic and educational purposes.


### ✨ One thing I'd add later

Once your website is looking good, put a **real screenshot/GIF of KindSwap at the very top** of the README. That will make the GitHub repository look *much* more polished than a text-only README.

For example:

```markdown
<div align="center">

# 🌱 KindSwap

### Give What You Can. Get What You Need.

<img src="frontend/src/assets/kindSwap-preview.png" width="900">

</div>
