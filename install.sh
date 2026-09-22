#!/usr/bin/env bash
set -e

echo "========================================================"
echo "        BIGDATA AI 에이전트 MCP 원클릭 자동 설치기"
echo "========================================================"
echo ""

TOKEN=$1
if [ -z "$TOKEN" ]; then
    read -p "발급받은 개인 액세스 토큰(PAT)을 입력하세요: " TOKEN
fi

if [ -z "$TOKEN" ]; then
    echo "[오류] 토큰이 입력되지 않아 설치를 중단합니다."
    echo "토큰 발급: https://bigdata.hijack7.co.kr/mypage/agent_connections.php"
    exit 1
fi

echo ""
echo "[1/3] 의존성 패키지 설치 중..."
npm install

echo ""
echo "[2/3] TypeScript 빌드 중..."
npm run build

echo ""
echo "[3/3] Claude Desktop 및 에이전트에 연동 정보 등록 중..."
node setup.mjs --token="$TOKEN"

echo ""
echo "========================================================"
echo "  설치가 완료되었습니다! Claude Desktop을 다시 켜주세요."
echo "========================================================"
