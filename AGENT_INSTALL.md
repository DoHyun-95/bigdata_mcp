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
