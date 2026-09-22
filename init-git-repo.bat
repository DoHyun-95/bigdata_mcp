@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================================
echo   BIGDATA MCP 독립 Git 저장소 초기화 및 GitHub 푸시 도구
echo ========================================================
echo.

cd /d "%~dp0"

if not exist ".git" (
    echo [1/4] Git 저장소 초기화 중 (git init)...
    git init
    git branch -M main
) else (
    echo [1/4] 기존 Git 저장소를 감지했습니다.
)

echo.
echo [2/4] 파일 스테이징 및 커밋 생성 중...
git add .
git commit -m "feat: initial release of BIGDATA MCP Gateway with auto-install"

echo.
echo [3/4] GitHub 원격 저장소 URL 확인...
set REPO_URL=%1
if "%REPO_URL%"=="" (
    set /p REPO_URL="GitHub 원격 저장소 주소를 입력하세요 (기본: https://github.com/DoHyun-95/bigdata-mcp.git): "
)
if "%REPO_URL%"=="" (
    set REPO_URL=https://github.com/DoHyun-95/bigdata-mcp.git
)

git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo.
echo [4/4] GitHub 원격 저장소로 푸시 중 (git push -u origin main)...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo   🎉 GitHub 저장소 배포가 성공적으로 완료되었습니다!
    echo   저장소 URL: %REPO_URL%
    echo   이제 원장님과 에이전트들이 위 URL로 원클릭 설치를 수행할 수 있습니다.
    echo ========================================================
) else (
    echo.
    echo [안내] 푸시 중 오류가 발생했습니다. GitHub에서 먼저 빈 저장소를 생성했는지, 권한이 있는지 확인해 주세요.
)

pause
