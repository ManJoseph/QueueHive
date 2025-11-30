# QueueHive Development Rules

You are working inside an existing Spring Boot (Maven) backend and a React create-react-app frontend. 
Never recreate project folders, node_modules, pom.xml, or overwrite unrelated files.

## 🚨 General Behavior Rules
- Follow Google Java Style Guide for all Java code.
- Follow Material Design 3 principles + my personal UI/UX design system.
- Use clean architecture: Controller → Service → Repository → Domain.
- Generate DTOs for all request and response bodies.
- Never put business logic in controllers.
- Never modify files outside requested scope.
- Use constructor-based dependency injection.
- Use meaningful, simple, readable class names.

## 🏗 Backend (Java + Spring Boot)
- Use Java 17+ and Spring Boot 3.
- Use JPA entities in `domain` package.
- Use Spring Data JPA repositories.
- Use Service interfaces + @Service implementations.
- Use @Transactional for token assignment logic.
- All new endpoints must be RESTful and return DTOs.
- All code must be self-contained in the backend folder.

## 🎨 Frontend (React)
- Use functional components and hooks.
- Use my UI/UX Blueprint rules:
  - MD3 layout spacing tokens
  - Rounded radius system
  - Smooth fade/slide animations
  - Card-based components
  - Accessible typography
- Never recreate the project; only add/update files inside `src`.

## 🧪 Testing
- Use JUnit 5 + Mockito.
- Use descriptive test names.
- Test service logic first.

## 📦 Docker
- Use a multi-stage Dockerfile.
- Use docker-compose for backend + database.

---

# Custom Commands

## `generate backend feature`
Generate backend code following all backend rules.

## `generate ui component`
Generate a React component following my UI/UX blueprint and MD3 rules.

## `generate service tests`
Generate JUnit + Mockito service-layer tests.

## `improve ui`
Apply UI/UX improvements using my design system (spacing, typography, layout, shadows).

## `explain architecture`
Explain decisions based on clean architecture, Google style, and project patterns.

