# Use an official Java 20 runtime as a parent image
FROM openjdk:20-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file into the container
COPY target/email-writer-sb-0.0.1-SNAPSHOT.jar app.jar

# Expose the application's port (Render uses dynamic ports)
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
