Neon PostgreSQL + Node.js + Frontend Demo

A simple full-stack project that connects a JavaScript frontend to a Node.js backend, which communicates with a PostgreSQL database hosted on Neon.

🚀 Project Structure
neon_demo/
├── backend/
│ ├── server.js # Main Express server
│ ├── routes/
│ │ └── users.js # User API routes
│ ├── db/
│ │ └── pool.js # Database connection (Neon)
│ ├── package.json # Backend dependencies
│ └── .env # Environment variables (DB URL, port)
│
└── frontend/
├── index.html # UI to interact with the API
├── script.js # Handles user input and API requests
└── style.css # Simple UI styling

⚙️ Backend Setup

1. Install Dependencies
   cd backend
   npm install

2. Create a .env file

Add your Neon PostgreSQL connection string:

DATABASE_URL=postgres://username:password@your-neon-host.neon.tech/neondb
PORT=3000

3. Run the Server
   npm start

or

node server.js

When you see:

🚀 Server running on port 3000

you’re good to go!

🧩 API Endpoints
Method Endpoint Description
GET /api/users/init Creates the users table if not already created
GET /api/users Retrieves all users
POST /api/users/add Adds a new user (JSON body: { "name": "Parham" })
🎨 Frontend

The frontend is located in the /frontend folder.
Open index.html in your browser — it allows you to:

Enter a user name

Add it to the Neon-hosted PostgreSQL database

Display all stored users in real time
