# Velora – Fashion E-Commerce Platform

A full-stack fashion e-commerce application built with Angular, Node.js, Express.js, and MongoDB.

**🌐 Live Demo:** [Visit Velora](https://velora-j05j52cto-velora-8fdf.vercel.app/login)

**💻 GitHub Repository:** https://github.com/4bhi-ji8/velora

## Overview

Velora is a fashion e-commerce platform designed to provide customers with a smooth online shopping experience and administrators with tools to manage products and store operations.

This project is being developed as a practical full-stack development project to explore frontend development, REST APIs, authentication, database management, and deployment.

## Tech Stack

**Frontend**
- Angular 21
- TypeScript
- Tailwind CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## Features

- User registration and login
- JWT-based authentication
- Role-based access for customers and administrators
- Product listing and browsing
- Admin dashboard
- Product management
- Category management
- REST API integration

## Project Structure

```text
velora-clone/
├── src/                 # Angular frontend
├── server/              # Node.js backend
├── docs/                # Project documentation
└── README.md
```

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/4bhi-ji8/velora.git
cd velora
```

### 2. Run the frontend

```bash
npm install
ng serve
```

Open `http://localhost:4200/` in your browser.

### 3. Run the backend

Open another terminal:

```bash
cd server
npm install
npm run dev
```

Configure your backend environment variables in a `.env` file before starting the server. Never commit your actual secrets or credentials.

## Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

## Project Status

Velora is an ongoing project. New features and improvements are being added as development progresses.
