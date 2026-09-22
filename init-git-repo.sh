#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "========================================================"
echo "  BIGDATA MCP Git 저장소 초기화 및 GitHub 푸시 도구"
echo "========================================================"
echo ""

if [ ! -d ".git" ]; then
    echo "[1/4] Git 저장소 초기화 중..."
    git init
    git branch -M main
fi

echo "[2/4] 파일 스테이징 및 커밋..."
git add .
git commit -m "feat: initial release of BIGDATA MCP Gateway with auto-install" || true

REPO_URL="$1"
if [ -z "$REPO_URL" ]; then
    read -p "GitHub 원격 저장소 주소 입력 (기본: https://github.com/devdhlabs/bigdata-mcp.git): " REPO_URL
fi
if [ -z "$REPO_URL" ]; then
    REPO_URL="https://github.com/devdhlabs/bigdata-mcp.git"
fi

echo "[3/4] 원격 저장소 설정..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

echo "[4/4] GitHub로 푸시 중..."
git push -u origin main

echo ""
echo "🎉 저장소 푸시 완료: $REPO_URL"
