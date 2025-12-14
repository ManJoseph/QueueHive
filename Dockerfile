# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the Maven project files
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
COPY mvnw.cmd .

# Download dependencies
RUN mvn dependency:go-offline

# Copy the source code and build the application
COPY src src
RUN mvn clean install -DskipTests

# Stage 2: Create the final lean image
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy the application JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Set the entrypoint to run the application with the "docker" profile active
ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar", "app.jar"]
