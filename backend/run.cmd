@echo off
echo Iniciando AutoTrack BR - Backend...

set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot
set PATH=%JAVA_HOME%\bin;C:\maven\apache-maven-3.9.16\bin;%PATH%

set JWT_SECRET=autotrack-secret-key-para-desenvolvimento-local-2024
set DB_USER=root
set DB_PASS=Panigale1504

echo Compilando...
call mvn package -Dmaven.test.skip=true -q

echo.
echo Rodando servidor na porta 8080...
echo Swagger: http://localhost:8080/swagger-ui.html
echo.
"%JAVA_HOME%\bin\java" -jar target\backend-0.0.1-SNAPSHOT.jar
