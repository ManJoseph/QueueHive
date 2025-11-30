# REST API Documentation

This document provides details on the RESTful API endpoints for the QueueHive backend.
**Base URL:** `/api`

---

## Authentication (`/auth`)

### 1. Register User

-   **Endpoint:** `POST /auth/register`
-   **Description:** Registers a new user (customer or company admin).
-   **Request Body:**
    ```json
    {
      "fullName": "John Doe",
      "phone": "1234567890",
      "email": "john.doe@example.com",
      "password": "password123",
      "role": "CUSTOMER"
    }
    ```
-   **Success Response (200 OK):**
    ```json
    {
      "id": 1,
      "fullName": "John Doe",
      "phone": "1234567890",
      "email": "john.doe@example.com",
      "role": "CUSTOMER"
    }
    ```
-   **Error Response (400 Bad Request):** If validation fails (e.g., blank fields, invalid email).

### 2. Login User

-   **Endpoint:** `POST /auth/login`
-   **Description:** Authenticates a user and returns a token.
-   **Request Body:**
    ```json
    {
      "email": "john.doe@example.com",
      "password": "password123"
    }
    ```
-   **Success Response (200 OK):**
    ```json
    {
      "token": "placeholder-jwt-token-for-john.doe@example.com"
    }
    ```
-   **Error Response (401 Unauthorized):** If credentials are invalid.

---

## Companies (`/companies`)

### 1. Register Company

-   **Endpoint:** `POST /companies`
-   **Description:** Registers a new company. It will be unapproved by default.
-   **Request Body:**
    ```json
    {
      "name": "Global Tech Inc.",
      "category": "Technology"
    }
    ```
-   **Success Response (200 OK):**
    ```json
    {
        "id": 1,
        "name": "Global Tech Inc.",
        "category": "Technology",
        "approved": false,
        "createdAt": "2025-11-30T10:00:00.000000"
    }
    ```

### 2. Approve Company

-   **Endpoint:** `PUT /companies/{id}/approve`
-   **Description:** Marks a company as approved. (Admin action).
-   **URL Parameters:** `id` (long) - The ID of the company to approve.
-   **Success Response (200 OK):** The updated company object with `approved: true`.

### 3. List Approved Companies

-   **Endpoint:** `GET /companies`
-   **Description:** Returns a list of all approved companies.
-   **Success Response (200 OK):** An array of company objects.

---

## Services (`/companies/{companyId}/services`)

### 1. Add Service to Company

-   **Endpoint:** `POST /companies/{companyId}/services`
-   **Description:** Adds a new service type for a specific company.
-   **URL Parameters:** `companyId` (long) - The ID of the company.
-   **Request Body:**
    ```json
    {
      "name": "General Support",
      "averageServiceTime": 15
    }
    ```
-   **Success Response (200 OK):** The newly created service type object.

### 2. List Services for Company

-   **Endpoint:** `GET /companies/{companyId}/services`
-   **Description:** Returns a list of all services for a specific company.
-   **URL Parameters:** `companyId` (long) - The ID of the company.
-   **Success Response (200 OK):** An array of service type objects.

---

## Tokens (`/tokens`)

### 1. Create Token

-   **Endpoint:** `POST /tokens`
-   **Description:** Creates a new token for a user and a service.
-   **Request Body:**
    ```json
    {
      "userId": 1,
      "serviceId": 1
    }
    ```
-   **Success Response (200 OK):** The newly created token object.

### 2. Get Token Status

-   **Endpoint:** `GET /tokens/{id}`
-   **Description:** Retrieves a specific token by its ID.
-   **URL Parameters:** `id` (long) - The ID of the token.
-   **Success Response (200 OK):** The token object.
-   **Error Response (404 Not Found):** If the token does not exist.

### 3. Get Token Queue Position

-   **Endpoint:** `GET /tokens/{id}/position`
-   **Description:** Calculates and returns the number of people ahead of a specific token in its service queue.
-   **URL Parameters:** `id` (long) - The ID of the token.
-   **Success Response (200 OK):**
    ```json
    {
      "position": 5 
    }
    ```
-   **Error Response (404 Not Found):** If the token does not exist.
