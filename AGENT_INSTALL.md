# 🤖 AI Agent Installation & Execution Guide

This document is an actionable instruction manual for **AI Coding Agents** (Claude Code, Google Antigravity, Cursor, Windsurf, Codex, etc.) to autonomously install, configure, and operate the **BIGDATA MCP Server**.

---

## ⚡ 1. Autonomous Installation (Automated)

When the user says:
> *"BIGDATA MCP를 설치해줘. 내 토큰은 `bigdata_pat_...` 야"*
> or
> *"Install the BIGDATA MCP server for my environment with token `...`"*

Execute the following commands in the root of this repository:

```bash
# 1. 의존성 설치
npm install

# 2. 자동 환경 설정 (Claude Desktop, Antigravity, Cursor, Windsurf 전역 자동 등록)
node setup.mjs --token="<USER_TOKEN>"
```
*(Note: `setup.mjs` will automatically compile TypeScript `tsc` if `dist/server.js` is not yet built.)*

If the user has **Claude Code CLI**, you can also register the tool via CLI:
```bash
claude mcp add bigdata node "<ABSOLUTE_PATH_TO_THIS_REPO>/dist/server.js" \
  -e BIGDATA_MCP_TOKEN="<USER_TOKEN>" \
  -e BIGDATA_API_BASE_URL="https://bigdata.hijack7.co.kr/api/v1"
```

---

## 🔑 2. How to Handle Missing Token

If the user did not provide a token, prompt them immediately:
> *"BIGDATA MCP 연동을 위해 개인 액세스 토큰(PAT)이 필요합니다. [빅데이터 마이페이지](https://bigdata.hijack7.co.kr/mypage/agent_connections.php)에서 토큰을 발급받으신 후 알려주세요."*

---

## 🛠 3. Manual Configuration (Fallback)

If `setup.mjs` cannot be run, add the following entry to the target environment's MCP config:

```json
{
  "mcpServers": {
    "bigdata": {
      "command": "node",
      "args": ["<ABSOLUTE_PATH_TO_THIS_REPO>/dist/server.js"],
      "env": {
        "BIGDATA_API_BASE_URL": "https://bigdata.hijack7.co.kr/api/v1",
        "BIGDATA_MCP_TOKEN": "<USER_PAT_TOKEN>"
      }
    }
  }
}
```

### Configuration File Locations:
- **Claude Desktop (Windows)**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Claude Desktop (macOS)**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Google Antigravity**: `~/.gemini/antigravity/mcp_config.json`
- **Cursor IDE**: `~/.cursor/mcp.json` or `.cursor/mcp.json` in workspace
- **Windsurf**: `~/.codeium/windsurf/mcp_config.json`

---

## 📦 4. Available MCP Tools

Once installed and the IDE/app is restarted, the following tools become available to you:

| Tool | Purpose |
|------|---------|
| `search_passages` | Search passages by keyword, curriculum, category, or source. |
| `get_passage` | Fetch full English passage text and official Korean translation. |
| `list_question_types` | List all 25 supported Korean CSAT/EBS question types. |
| `get_question_schema` | Get schema, prompt instructions, and fixed question wording for a type. |
| `validate_questions` | Dry-run validation of generated questions before saving. |
| `save_questions` | Save newly authored questions into the user's private question bank. |
| `search_questions` | Search existing authored questions by passage ID or type. |
| `get_question` | Fetch details of a specific saved question. |
| `get_health` | Verify API connectivity and database status. |
| `get_my_profile` | Check current user info, tier, and remaining tokens. |

---

## ✍ 5. Essential Question Authoring Rules

When authoring English questions for BIGDATA:
1. **Reference Specification**: Read [`DEVDH_RULES.md`](./DEVDH_RULES.md) for full 25-type details.
2. **0-based `answer_index`**: Correct answer index must be `0`, `1`, `2`, `3`, or `4`.
3. **5 Choices Required**: Every multiple-choice question must have exactly 5 options.
4. **Box Delimiters**:
   - 3-Box (`어법박스`, `어휘박스`, `연결어(3개)`): Format options as `A / B / C`
   - 2-Box (`요약`, `심경변화`, `연결어(2개)`, `이중빈칸`): Format options as `A / B`
5. **Structural Question Fields**:
   - `순서`: Paragraphs in `content_1`((A)), `content_2`((B)), `content_3`((C)).
   - `삽입`: Sentence to insert in `content_1`.
   - `요약`: Summary sentence in `content_1`.

---

## 🏷 6. Problem Title (`quiz_name`) vs Type (`kr_title`) & Interactive Naming

### 📌 Role Distinction
- **`kr_title` (공식 문제 유형)**: 수능/내신 기준의 공식 25개 문제 유형명 (예: `주제`, `단일빈칸`, `어법박스`, `순서`, `삽입`, `요약` 등).
- **`quiz_name` (문제 제목 / 시험지 타이틀)**: 사용자/원장님이 직접 명명하는 개별 문항 또는 워크시트 제목 (예: `2024년 고1 3월 학평 31번 변형`, `1학기 기말고사 대비 빈칸 워크시트` 등). BIGDATA 웹 사이트의 보관함 카드 상단 및 인쇄/다운로드 헤더 타이틀로 출력됩니다.

### 💬 Interactive Question Naming Rule for Agents
문제를 생성할 때, 에이전트는 사용자에게 문제 제목을 사전에 능동적으로 확인하거나 입력받도록 합니다:
- **에이전트 권장 질문 예시**:
  > *"문제를 생성하기 전에, 문제 제목(`quiz_name`)을 무엇으로 지정할까요? (예: '2024년 고1 3월 31번 변형' / 따로 말씀하지 않으시면 '단일빈칸'과 같은 문제 유형명으로 자동 지정됩니다)"*
- **사용자가 제목을 지정한 경우**:
  - `quiz_name`: 사용자가 지정한 제목 (예: `"1학기 기말 31번 변형"`)
  - `kr_title`: 해당 문제의 공식 유형 (예: `"단일빈칸"`)
- **사용자가 제목을 생략하거나 따로 언급하지 않은 경우**:
  - `quiz_name`에 `kr_title` 값을 넣거나 생략합니다 (BIGDATA 시스템이 자동으로 `kr_title`을 기본 제목으로 채워 저장합니다).

---

## 🛡 7. User Review Before Upload Protocol (절대 규칙: 사전 검수 후 업로드)

**⚠️ CRITICAL AGENT RULE: 문제를 생성하자마자 즉시 `save_questions`를 호출하여 사이트에 자동 저장하지 마십시오!**

문제를 출제할 때는 반드시 아래의 **검수 후 저장 워크플로우**를 엄격히 준수해야 합니다:

```
[1. 지문 확보/선택] ──> [2. 문제 제목 확인] ──> [3. 문항 작성 & validate_questions 검증] 
                                                               │
                                                               ▼
[5. save_questions 업로드] <── [사용자 최종 승인] <── [4. 사용자에게 문항 검수 제시]
```

### 📋 상세 실행 절차:
1. **문항 작성 및 사전 검증 (`validate_questions`)**:
   - 문항 작성 후, DB에 직접 저장하지 않는 `validate_questions` 도구를 먼저 호출하여 규격 오류(5개 선택지, 정답 인덱스, 발문 등)를 사전 검증합니다.
2. **사용자에게 문항 검수 제시 (Inspection & Approval)**:
   - 완성된 문항을 사용자 채팅창에 가독성 높은 마크다운 형식으로 보여줍니다:
     - **문제 제목**: `[2024년 고1 3월 31번 변형]`
     - **문제 유형**: `단일빈칸` (고정 발문: `다음 빈칸에 들어갈 말로 가장 적절한 것은?`)
     - **지문**: 영어 원문 또는 변형된 본문
     - **선택지**: ① ~ ⑤ 보기
     - **정답 및 해설**: 정답 번호, 상세 해설 및 오답 분석
   - **에이전트 필수 확인 질문 출력**:
     > *"출제된 문항의 지문, 선택지, 정답 및 해설을 검수해 주세요.*
     > *수정하고 싶은 부분이 있으신가요, 아니면 이대로 BIGDATA 보관함에 업로드(저장)할까요?"*
3. **사용자 승인 시에만 최종 저장 (`save_questions`)**:
   - 사용자가 **"좋아", "저장해줘", "업로드해줘", "이대로 올려줘", "확인했어"** 등 명시적으로 승인한 경우에만 `save_questions` 도구를 호출하여 BIGDATA 개인 보관함에 업로드합니다.
   - 사용자가 수정을 요청한 경우(예: "3번 보기 단어 바꿔줘", "빈칸 위치를 세 번째 줄로 변경해줘"), 수정을 완료한 뒤 다시 검수를 요청합니다.


