FROM eclipse-temurin:24-jdk-alpine

WORKDIR /app

#COPY target/*.jar app.jar
COPY *.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
