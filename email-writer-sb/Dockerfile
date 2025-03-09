# Use an official Java runtime as a parent image
FROM openjdk:20-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the Maven wrapper and pom.xml first to leverage Docker cache
COPY email-writer-sb/pom.xml email-writer-sb/mvnw ./
COPY email-writer-sb/.mvn/ .mvn/

# Download dependencies
RUN chmod +x mvnw && ./mvnw dependency:go-offline

# Copy the entire source code
COPY email-writer-sb /app

# Grant execute permission for Maven wrapper (Fix for Permission Denied)
RUN chmod +x mvnw

# Build the JAR file
RUN ./mvnw clean package -DskipTests

# Expose the application's port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/email-writer-sb-0.0.1-SNAPSHOT.jar"]
