# UML Diagrams

This document contains Use Case, Class, and Activity diagrams to model the QueueHive system.

---

## 1. Use Case Diagram

This diagram shows the interactions between users (actors) and the main features of the system.

```mermaid
graph TD
    subgraph "QueueHive System"
        UC1(Register Account)
        UC2(Login)
        UC3(View Companies)
        UC4(Select Service)
        UC5(Generate Token)
        UC6(View Queue Position)
        
        UC7(Register Company)
        UC8(Approve Company)
        UC9(Add Service)
    end

    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC4
    Customer --> UC5
    Customer --> UC6

    CompanyAdmin(Company Admin) --> UC2
    CompanyAdmin --> UC7
    CompanyAdmin --> UC9
    
    SystemAdmin(System Admin) --> UC8

    style Customer fill:#F9E,stroke:#333,stroke-width:2px
    style CompanyAdmin fill:#B9F,stroke:#333,stroke-width:2px
    style SystemAdmin fill:#9BF,stroke:#333,stroke-width:2px
```

---

## 2. Class Diagram

This diagram represents the domain model and key components of the backend application.

```mermaid
classDiagram
    class User {
        +Long id
        +String fullName
        +String phone
        +String email
        +String passwordHash
        +String role
    }

    class Company {
        +Long id
        +String name
        +String category
        +Boolean approved
        +LocalDateTime createdAt
    }

    class ServiceType {
        +Long id
        +String name
        +Integer averageServiceTime
    }

    class Token {
        +Long id
        +Integer tokenNumber
        +String status
        +LocalDateTime createdAt
    }

    class QueueSequence {
      +Long id
      +Integer nextTokenNumber
    }

    User "1" -- "0..*" Token : has
    Company "1" -- "0..*" ServiceType : provides
    ServiceType "1" -- "0..*" Token : for
    ServiceType "1" -- "1" QueueSequence : has

    class TokenController {
      +createToken()
      +getTokenStatus()
    }
    class TokenService {
      +createToken()
    }
    class TokenRepository {
      +save()
      +findById()
    }
    
    TokenController --> TokenService
    TokenService --> TokenRepository
    TokenService --> Token

```

---

## 3. Activity Diagram

This diagram illustrates the user flow for generating a new queue token.

```mermaid
activityDiagram
    title Token Generation Flow

    start
    :User opens the application;
    :User views list of companies;
    :User selects a company;
    :System displays services for the selected company;
    :User selects a service;
    
    if (User is logged in?) then (Yes)
        :System generates a new token;
        partition "Transactional" {
            :Find or create QueueSequence for the service;
            :Assign nextTokenNumber to token;
            :Increment nextTokenNumber in QueueSequence;
        }
        :System saves the new token;
        :System broadcasts update via WebSocket;
        :Display token number and queue position to user;
    else (No)
        :Redirect to Login/Register page;
        stop
    endif
    
    stop
```
