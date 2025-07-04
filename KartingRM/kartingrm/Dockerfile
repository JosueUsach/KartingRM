FROM openjdk:17

# Set working directory
WORKDIR /app

# Copy the JAR
ARG JAR_FILE=target/WebAppKartingRM.jar
COPY ${JAR_FILE} app.jar

EXPOSE 8090

# Just wait 15 seconds before starting
ENTRYPOINT ["sh", "-c", "sleep 8 && java -jar app.jar"]
