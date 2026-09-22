# BIGDATA MCP Gateway

> **BIGDATA 수능/내신 영어 문제은행을 Claude, Antigravity, Cursor 등 모든 AI 에이전트에 직결하는 공식 MCP(Model Context Protocol) 서버입니다.**

외부 AI 에이전트에서 내 BIGDATA 문제은행 지문을 실시간 검색하고, 25개 수능/내신 정식 유형으로 문제를 생성한 뒤, **내 개인 보관함에 원클릭으로 직접 저장**할 수 있습니다.

---

## ⚡ 1. 가장 빠른 설치 방법 (Fast Track)

### 🤖 AI 에이전트에게 설치를 맡길 때 (가장 추천)
Claude Code, Antigravity, Cursor 등의 채팅창에 아래와 같이 입력하세요:
> *"이 저장소(`https://github.com/DoHyun-95/bigdata_mcp`)를 보고 BIGDATA MCP 서버를 내 환경에 설치해줘. 내 토큰은 `bigdata_pat_...` 이야."*

에이전트가 [`AGENT_INSTALL.md`](./AGENT_INSTALL.md)를 스스로 읽고 빌드와 설정을 전자동으로 완료합니다.

---

### 💻 사용자가 직접 1클릭 설치할 때

1. **토큰 발급**: 
   - [BIGDATA 마이페이지 > AI 에이전트 연결](https://bigdata.hijack7.co.kr/mypage/agent_connections.php)에서 개인 액세스 토큰(PAT)을 발급받습니다.
2. **저장소 클론 & 실행**:
   - **Windows 사용자**: 
     ```cmd
     git clone https://github.com/DoHyun-95/bigdata_mcp.git
     cd bigdata_mcp
     install.bat
     ```
     (토큰 입력창이 뜨면 발급받은 토큰을 붙여넣기만 하면 Claude Desktop과 Antigravity 설정이 1초 만에 자동 완료됩니다.)
   - **Mac / Linux 사용자**:
     ```bash
     git clone https://github.com/DoHyun-95/bigdata_mcp.git
     cd bigdata_mcp
     ./install.sh
     ```

---

## 🛠️ 2. 수동 설정 가이드 (Manual Setup)

Node.js(v18+) 환경에서 빌드 후 각 클라이언트 설정 파일에 등록합니다:

```bash
npm install
npm run build
```

### Claude Desktop (`claude_desktop_config.json`)
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "bigdata": {
      "command": "node",
      "args": ["<저장소_절대경로>/dist/server.js"],
      "env": {
        "BIGDATA_API_BASE_URL": "https://bigdata.hijack7.co.kr/api/v1",
        "BIGDATA_MCP_TOKEN": "발급받은_PAT_토큰_입력"
      }
    }
  }
}
```

### Google Antigravity (`~/.gemini/antigravity/mcp_config.json`)
```json
{
  "mcpServers": {
    "bigdata": {
      "command": "node",
      "args": ["<저장소_절대경로>/dist/server.js"],
      "env": {
        "BIGDATA_API_BASE_URL": "https://bigdata.hijack7.co.kr/api/v1",
        "BIGDATA_MCP_TOKEN": "발급받은_PAT_토큰_입력"
      }
    }
  }
}
```

---

## 🧰 3. 제공되는 MCP 도구 (Tools) 목록

| 도구명 | 설명 |
|---|---|
| `get_account_context` | 연결된 회원 계정, 권한(Scopes), 한도 정보 조회 |
| `get_catalog` | 지문/문항의 분류 체계 목록 계층별 조회 |
| `get_question_types` | 지원하는 25개 문제 유형(대분류, 제목, q_type 등) 목록 조회 |
| `get_question_schema` | 특정 문제 유형의 세부 JSON 규격, 보기 칸수, 고정 발문 및 출제 지침 조회 |
| `search_passages` | 접근 가능한 영어 원문 지문 검색 (키워드, 카테고리 필터) |
| `get_passage` | 특정 지문의 영어 원문과 한국어 해석, 고유 해시값 조회 |
| `search_questions` | 보관함(saved) 또는 문제은행(bank) 문항 검색 |
| `get_question` | 특정 문항의 상세 정보 조회 |
| `validate_questions` | 작성한 문항들의 규격 적합성 사전 검증 (DB 저장 없음) |
| `save_questions` | 검증된 문항들을 개인 보관함(비공개)에 신규 저장 (멱등키 자동 보장) |

---

## 📝 4. 출제 및 프롬프트 가이드
AI가 출제할 때 따라야 하는 25개 수능/내신 세부 유형(속담, 어조, 요약, 순서, 삽입, 어법박스 등)의 출제 규격과 JSON 규칙은 [`DEVDH_RULES.md`](./DEVDH_RULES.md)에 모두 정리되어 있습니다.
