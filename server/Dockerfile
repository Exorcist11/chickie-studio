# Stage 1: Build source với Maven và Java 21 có sẵn
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

RUN apk add --no-cache maven

COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Production Runtime
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-Xms256m -Xmx768m"

COPY --from=builder /app/target/*.jar app.jar

RUN mkdir -p /app/uploads && chown -R chickie:chickie /app

USER chickie:chickie

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
