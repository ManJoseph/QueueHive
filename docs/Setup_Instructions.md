# Setup and Installation Guide

This guide provides instructions for setting up and running the QueueHive project. The recommended method is using Docker Compose, as it simplifies the setup process.

---

## 1. Running with Docker Compose (Recommended)

This method runs the backend, frontend, database, and database admin tool using Docker Compose.

### Prerequisites

-   [Docker Desktop](https://www.docker.com/get-started) (includes Docker Compose)

### Steps

1.  **Navigate to the Project Root:**
    Open a terminal and navigate to the QueueHive project folder.
    ```sh
    cd QueueHive
    ```

2.  **Build and Start Services:**
    Run the following command to build the application and start all services. The `-d` flag runs the containers in detached mode.
    ```sh
    docker-compose up --build -d
    ```

3.  **Access Services:**
    -   **Frontend & Backend API:** `http://localhost:8080`
    -   **pgAdmin (Database GUI):** `http://localhost:5050`
        -   **Login:** `admin@queuehive.com`
        -   **Password:** `admin`
    -   **PostgreSQL Port:** `5432`

For detailed Docker instructions, deployment options, and troubleshooting, see **[README-DOCKER.md](../README-DOCKER.md)**.

---

## 2. Running the Backend Manually

### Prerequisites

-   Java (JDK 21)
-   Maven
-   PostgreSQL

### Steps

1.  **Setup PostgreSQL Database:**
    Create a new database with the following credentials:
    -   **Database:** `queuehive_db`
    -   **Username:** `queuehive_user`
    -   **Password:** `queuehive_pass`

2.  **Configure Application Properties:**
    Open the `QueueHive_BE/src/main/resources/application.properties` file and add the following lines to connect to your local database:
    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/queuehive_db
    spring.datasource.username=queuehive_user
    spring.datasource.password=queuehive_pass
    spring.jpa.hibernate.ddl-auto=update
    ```

3.  **Run the Application:**
    Navigate to the `QueueHive_BE` directory in your terminal and run the following Maven command:
    ```sh
    mvn spring-boot:run
    ```
    The backend will start on `http://localhost:8080`.

---

## 3. Running the Frontend Manually

### Prerequisites

-   Node.js (LTS version)
-   npm (included with Node.js)

### Steps

1.  **Navigate to the Frontend Directory:**
    Open a separate terminal and navigate to the React project folder.
    ```sh
    cd QueueHive_FE/queuehive
    ```

2.  **Install Dependencies:**
    If you haven't already, install the required node modules.
    ```sh
    npm install
    ```

3.  **Start the Development Server:**
    ```sh
    npm start
    ```
    The frontend application will open in your browser at `http://localhost:3000`. It will automatically connect to the backend running on port `8080`.
