@echo off
echo =========================================================================
echo   CONTINUOUS INSURANCE-TO-VALUE (ITV) INTELLIGENCE ENGINE
echo   Guidewire Industry Elective Capstone Demo Launcher
echo =========================================================================
echo.

echo Starting Backend Service (Spring Boot 3 on port 8080)...
start "ITV Backend Server" cmd /k "cd backend && mvn spring-boot:run"

echo Waiting 5 seconds for backend initialization...
timeout /t 5 /nobreak >nul

echo Starting Frontend Dev Server (Vite React on port 5173)...
start "ITV Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo =========================================================================
echo Both services launched in separate windows!
echo Access the Frontend at:  http://localhost:5173
echo Access Swagger UI at:    http://localhost:8080/swagger-ui.html
echo Access H2 Console at:    http://localhost:8080/h2-console
echo.
echo Demo Credentials:
echo   Underwriter: underwriter / Underwriter@123
echo   Admin:       admin / Admin@123
echo   Reviewer:    reviewer / Reviewer@123
echo   Viewer:      viewer / Viewer@123
echo =========================================================================

