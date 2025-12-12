
# QueueHive: A Smart Queue Token Management System

QueueHive is a modern, full-stack application designed to eliminate physical queues by providing a seamless digital token generation system. Customers can view companies, select services, and receive a queue token, all from a clean, real-time web interface.

## ✨ Features

- **Company & Service Management:** Companies can register and list their services.
- **User Authentication:** Secure registration and login for users.
- **Digital Token Generation:** Users can select a service and instantly receive a numbered token.
- **Real-time Queue Updates:** The UI updates in real-time using WebSockets as new tokens are issued.
- **Clean, Modern UI:** A responsive and intuitive user interface built with React, following Material Design principles.
- **Dockerized Deployment:** The entire backend environment is containerized for easy setup and deployment.

## 🛠️ Tech Stack

| Category      | Technology                                    |
|---------------|-----------------------------------------------|
| **Backend**   | Java 21, Spring Boot 3, Spring Data JPA, Spring Security, WebSocket |
| **Frontend**  | React, Axios, STOMP.js, CSS Modules           |
| **Database**  | PostgreSQL                                    |
| **DevOps**    | Docker, Docker Compose, Maven                 |

## 🚀 Getting Started

For the quickest setup, it is recommended to run the project using Docker.

For detailed steps on running the project with Docker or setting up the frontend and backend manually, please refer to the **[Setup Instructions](./docs/Setup_Instructions.md)**.

## 📂 Project Structure

The project is organized into two main folders:

-   `QueueHive_BE/`: Contains the Spring Boot backend application.
-   `QueueHive_FE/`: Contains the React frontend application.

All documentation, including UML diagrams and API specifications, can be found in the `/docs` directory.
