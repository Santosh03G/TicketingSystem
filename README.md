<div align="center">

  <h1>🚀 Saazvat HelpDesk</h1>
  
  <p>
    <strong>A Modern, Full-Stack IT Support Ticketing System</strong>
  </p>
  
  <p>
    <a href="https://angular.io/" target="_blank">
      <img src="https://img.shields.io/badge/Frontend-Angular_17-dd0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
    </a>
    <a href="https://spring.io/projects/spring-boot" target="_blank">
      <img src="https://img.shields.io/badge/Backend-Spring_Boot-6db33f?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot" />
    </a>
    <a href="https://tailwindcss.com/" target="_blank">
      <img src="https://img.shields.io/badge/Styling-Tailwind_CSS-38b2ac?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    </a>
    <a href="https://www.java.com/" target="_blank">
      <img src="https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java" />
    </a>
  </p>

  <p>
    <i>Built with performance, security, and a premium user experience in mind.</i>
  </p>

  <br />
</div>

---

## 📖 Overview

**Saazvat HelpDesk** is a enterprise-grade ticketing solution designed to streamline IT support workflows. It combines a robust **Spring Boot** backend with a high-performance **Angular** frontend, wrapped in a stunning **Glassmorphism-inspired UI**. 

The system features role-based security, automated email notifications, bulk user management, and a dynamic dashboard to track support metrics in real-time.

---

## ✨ Key Features

### 🔐 Advanced Security & Auth
*   **Secure Login:** JWT-based authentication with encrypted passwords.
*   **Forgot Password:** Secure One-Time Password (OTP) email verification flow.
*   **Role-Based Access Control (RBAC):** Distinct interfaces for **Admin**, **Staff**, and **Users**.

### 🎫 Smart Ticket Management
*   **Rich Ticket Details:** Create, view, and manage tickets with priorities and categories.
*   **Lifecycle Management:** Assign, resolve, and reopen tickets with audit trails.
*   **Comments & Collaboration:** Real-time commenting system for agents and users.
*   **Auto-Assignment:** Optional smart logic to auto-route tickets to available staff.

### 🎨 Premium User Interface
*   **Glassmorphism Design:** Modern, translucent UI components with blur effects.
*   **Responsive Layout:** Fully optimized for desktop, tablet, and mobile.
*   **Interactive Animations:** Smooth transitions and micro-interactions powered by CSS and Angular animations.
*   **Custom Theming:** Professional deep-red and blue gradient aesthetic.

### ⚙️ Admin Power Tools
*   **Dashboard Analytics:** Visual overview of ticket stats (Open, Resolved, Pending).
*   **Bulk Import:** Upload Excel (`.xlsx`) files to create hundreds of users instantly using Apache POI.
*   **Dynamic Settings:** Configure categories, email triggers, and system rules on the fly.

---

## 🛠️ Technology Stack

### Frontend
*   **Framework:** Angular 17+ (Standalone Components)
*   **Styling:** Tailwind CSS, SCSS, Custom Glassmorphism Utility Classes
*   **State Management:** RxJS, Signals
*   **HTTP Client:** Angular Common HTTP

### Backend
*   **Framework:** Spring Boot 3.x
*   **Language:** Java 17
*   **Database:** JPA / Hibernate (H2/MySQL compatible)
*   **Utilities:** Apache POI (Excel), JavaMailSender (Emails)
*   **Build Tool:** Maven

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
*   Node.js (v18+)
*   Java JDK 17+
*   Maven

### 🔧 Backend Setup (Spring Boot)

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    mvn clean install
    ```
3.  **Run the application:**
    ```bash
    mvn spring-boot:run
    ```
    *The server will start on `http://localhost:8080`*

### 💻 Frontend Setup (Angular)

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    ng serve
    ```
    *The application will be available at `http://localhost:4200`*

---

## 📸 Usage

1.  Open your browser and navigate to `http://localhost:4200`.
2.  **Login** with your credentials or register a new account (if enabled).
3.  **Dashboard:** View your ticket overview.
4.  **Create Ticket:** Click the **+ New Ticket** button to submit an issue.
5.  **Settings (Admin):** Configure system preferences and import users.

---


<div align="center">
  <p>Made with ❤️ by <b>Santosh03G</b></p>
</div>
