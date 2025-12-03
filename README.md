# Loyalty Rewards

## Project Introduction
Loyalty Rewards is a full-stack loyalty program web application that provides end-to-end functionality for regular users, cashiers, managers, event organizers, and superusers.
The system is built with a React.js frontend and an Express + Prisma backend.

The platform supports role-based access control, transaction logging, event management, promotions, and QR code generation/processing, all deployed on a publicly accessible production environment.

A pre-populated database (seed script) is included, containing sample users, transactions, events, and promotions to ensure that all features can be demonstrated immediately.

## Technology Stack

| Layer          | Technology                          | Description                                                                                 |
|----------------|-----------------------------------|---------------------------------------------------------------------------------------------|
| Backend        | Node.js, Express, Prisma ORM, uuid, CORS      | API server, business logic, database access                                                |
| Frontend       | React.js, Vite, qrcode.react | User interface, client-side, QR-code display rendering                                            |
| Database       | SQLite, Prisma ORM  | Persistent storage for users, transactions, promotions, events                             |
| Routing       | React Router | Client-side navigation between pages|
| Authentication | JWT, bcryptjs                     | Secure user authentication and password hashing                                           |
| Realtime       | socket.io                  | Real-time notifications and updates                                                       |
| Email          | Resend                      | Emails for password reset                 |
| Payments       | Stripe                     | Payment integration for donation feature

## Repo Structure
```
course-project/
├── backend/
│   ├── controllers/
│   ├── db/
│   │   └── prisma.js
│   ├── middleware/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── createsu.js
│   │   ├── dev.db
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── routes/
│   ├── utils/
│   │   ├── auth.js
│   │   ├── errors.js
│   │   ├── sendNotification.js
│   │   └── validationHelpers.js
│   ├── services/
│   ├── .gitignore
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   ├── apiClient.js
│   │   │   └── index.js
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── pages/
│   │   ├── utils/
│   │   │   └── socket.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Core Features Overview

Regular User
- View points balance and full transaction history
- Create redemption requests
- Transfer points to other users
- Browse events and promotions
- RSVP to events
- Display personal QR code for quick identification during transactions

Cashier
- Create purchase transactions
- Process redemption requests
- Apply automatic and one-time promotions when applicable

Manager
- Manage all users, transactions, events, and promotions
- Add or remove event organizers
- Mark transactions as suspicious
- Create adjustment transactions
- Create and update system-wide promotions and events
- Publish and edit events
- Award event points to guests
- View all users and all transactions

Event Organizer
- View and edit the events they are responsible for
- Add guests to events
- Award points to all guests or individual guests

Superuser
- Manage manager-level permissions
- Promote any user to any role

## Advanced Features
In addition to the required basic features, our team implemented several advanced features that improve usability, responsiveness, and integration with external services.

**1. Real-Time Notifications (WebSockets)**

We implemented real-time notifications using WebSockets so that important updates appear instantly without requiring a manual page refresh.

**2. Payment API Integration**

We integrated a third-party payment provider API so that you can donate us if you like.

**3. Email Service Integration**

We also integrated a third-party email service API to support password reset.

## Installation

For detailed setup and deployment instructions, please refer to **`INSTALL.md`** in the project root.

`INSTALL.md` includes:
- Required dependencies and environment (Node, database, etc.)
- How to set up and run the **backend** and **frontend**
- Available demo accounts
- How our project is **deployed** and how to access the public URL

### Deployment
See WEBSITE.md and INSTALL.md
