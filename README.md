# PropertyPro 🏠 – AI-Powered Troubleshooting Companion

PropertyPro is an AI-powered assistant that helps landlords, tenants, and property-management teams diagnose and resolve property-related issues in minutes.  
Powered by OpenAI’s Chat Completion API, it delivers step-by-step guidance, safety advice, and professional recommendations tailored to real-estate maintenance, legal compliance, and investment questions.

---

## Table of Contents
1. [Key Features](#key-features)
2. [Tech Stack](#tech-stack)
3. [System Architecture](#system-architecture)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Running Locally](#running-locally)
7. [Deployment](#deployment)
8. [Contributing](#contributing)
9. [License](#license)

---

## Key Features
- **Conversational troubleshooting** – chat with a specialized assistant for plumbing, electrical, HVAC, structural, and legal issues.
- **Context-aware advice** – messages are stored in Firestore so the assistant remembers the conversation.
- **Multi-role authentication** – secure login for tenants, landlords, and admins using JWT.
- **Responsive web UI** – Vue 3 + Tailwind CSS delivers a modern chat experience that works on mobile and desktop.
- **Serverless backend** – Firebase Cloud Functions (Express) scale to zero and require no server management.
- **Local emulators** – develop entirely offline with Firebase & OpenAI stubs.

---

## Tech Stack
| Layer      | Technology |
|------------|------------|
| Frontend   | [Vue 3](https://vuejs.org/) · [Vite](https://vitejs.dev/) · [Tailwind CSS](https://tailwindcss.com/) |
| State      | Pinia |
| Backend    | Node.js · Express · Firebase Cloud Functions |
| Database   | Cloud Firestore |
| Auth       | Firebase Auth (JWT) |
| AI Engine  | OpenAI GPT-3.5/4 Chat Completion API |
| Dev Tools  | Docker · ESLint/Prettier · Firebase Emulators |

---

## System Architecture
```
┌─────────────┐        HTTPS         ┌───────────────────────────┐
│  Vue 3 SPA  │ ───────────────► │  Firebase Cloud Function  │
│  (frontend) │  REST /chat etc   │  (Express API + OpenAI)   │
└─────────────┘ ◄─────────────── └───────────────────────────┘
       ▲                                        │
       │  Firestore SDK                         │  OpenAI API
       │                                        ▼
┌─────────────┐                         ┌────────────────┐
│  Firestore  │◄────────────────────────│  OpenAI GPT    │
└─────────────┘                         └────────────────┘
```

---

## Project Structure
```
PropertyPro-AI-Powered-Troubleshooting-Companion/
├─ frontend/            # Vue 3 SPA
│  ├─ src/
│  ├─ public/
│  └─ README.md
├─ firebase-backend/    # Cloud Functions source (Express API)
│  ├─ routes/
│  ├─ middlewares/
│  ├─ config/
│  └─ index.js
├─ firestore.rules      # Security rules
├─ firebase.json        # Firebase project config
└─ README.md            # ← you are here
```

---

## Getting Started
### Prerequisites
* Node.js ≥ 18
* npm ≥ 9 (or pnpm/yarn)
* A [Firebase](https://firebase.google.com/) project
* An OpenAI API key

### Clone the repo
```bash
# SSH
git clone git@github.com:YOUR_USERNAME/PropertyPro-AI-Powered-Troubleshooting-Companion.git
# or HTTPS
git clone https://github.com/YOUR_USERNAME/PropertyPro-AI-Powered-Troubleshooting-Companion.git
cd PropertyPro-AI-Powered-Troubleshooting-Companion
```

### Environment Variables
Create a `.env.local` file at the project root **and** inside `frontend/` with the following keys:

```properties
# ==== Shared ====
OPENAI_API_KEY=sk-************************

# ==== Frontend ====
# (prefix with VITE_ so Vite exposes them)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
# …and any other Firebase values you use
```

The backend reads `OPENAI_API_KEY` from the function environment variables. When developing locally you can export it in your shell or use a `.env` file inside `firebase-backend/`.

---

## Running Locally
1. **Install dependencies**
   ```bash
   # Install backend deps
   cd firebase-backend && npm install && cd ..
   
   # Install frontend deps
   cd frontend && npm install && cd ..
   ```
2. **Start Firebase emulators & functions**
   ```bash
   firebase emulators:start
   ```
3. **Run the frontend in dev mode**
   ```bash
   cd frontend
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser and log in with a test user.

> 💡  The frontend is configured to automatically connect to the Firebase emulators when `import.meta.env.DEV` is `true`.

---

## Deployment
The project is optimised for Firebase Hosting + Cloud Functions:
```bash
# Build SPA
cd frontend && npm run build && cd ..

# Deploy hosting & functions
firebase deploy
```
Alternatively, you can containerise the frontend with Docker (`frontend/dockerfile`) and serve it with nginx.

---

## Contributing
Pull requests are welcome! Feel free to open issues for feature requests, bugs, or questions.

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m "feat: add amazing feature"`
4. Push to the branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

### Code Style
This project uses **ESLint** + **Prettier**. Before committing, run:
```bash
npm run lint
```

---

## License
Distributed under the MIT License. See `LICENSE` for details.

---

## Acknowledgements
* [OpenAI](https://openai.com/) – language intelligence
* [Firebase](https://firebase.google.com/) – friction-less backend
* [Vue.js](https://vuejs.org/) & [Tailwind CSS](https://tailwindcss.com/) – delightful frontend
