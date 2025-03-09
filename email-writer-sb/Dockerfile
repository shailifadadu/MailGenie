# Use an official Java runtime as a parent image
FROM openjdk:20-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the Maven wrapper and pom.xml first to leverage Docker cache
COPY email-writer-sb/pom.xml email-writer-sb/mvnw email-writer-sb/.mvn/ ./

# Download dependencies
RUN chmod +x mvnw && ./mvnw dependency:go-offline

# Copy the entire source code
COPY email-writer-sb/ ./

# Build the JAR file
RUN ./mvnw clean package -DskipTests

# Expose the application's port (Render uses dynamic ports)
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/email-writer-sb-0.0.1-SNAPSHOT.jar"]
