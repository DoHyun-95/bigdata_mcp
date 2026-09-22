#!/usr/bin/env node
/**
 * BIGDATA MCP Auto-Configuration Script
 * Claude Desktop, Antigravity, Cursor, Windsurf 환경에 MCP 설정을 자동으로 주입합니다.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 파라미터 파싱 (--token=..., --api-url=...)
const args = process.argv.slice(2);
let token = process.env.BIGDATA_MCP_TOKEN || '';
let apiUrl = process.env.BIGDATA_API_BASE_URL || 'https://bigdata.hijack7.co.kr/api/v1';

for (const arg of args) {
  if (arg.startsWith('--token=')) {
    token = arg.split('=')[1].trim();
  } else if (arg.startsWith('--api-url=')) {
    apiUrl = arg.split('=')[1].trim();
  } else if (!arg.startsWith('--') && !token) {
    token = arg.trim();
  }
}

if (!token) {
  console.error('\x1b[31m[오류] 토큰(PAT)이 지정되지 않았습니다.\x1b[0m');
  console.log('사용법: node setup.mjs --token=<발급받은_토큰> [--api-url=<API주소>]');
  console.log('토큰 발급: https://bigdata.hijack7.co.kr/mypage/agent_connections.php');
  process.exit(1);
}

const serverScriptPath = path.resolve(__dirname, 'dist', 'server.js').replace(/\\/g, '/');

// 빌드 확인 및 자동 빌드 시도
if (!fs.existsSync(path.resolve(__dirname, 'dist', 'server.js'))) {
  console.log('\x1b[33m[안내] 빌드 파일(dist/server.js)이 없어 빌드를 자동 실행합니다...\x1b[0m');
  try {
    execSync('npm run build', { cwd: __dirname, stdio: 'inherit' });
  } catch (e) {
    console.warn('\x1b[33m[경고] 빌드 명령 실행 실패. 사전에 npm install && npm run build 가 완료되었는지 확인해 주세요.\x1b[0m');
  }
}

console.log('\x1b[36m=== BIGDATA MCP 자동 연동 설정 시작 ===\x1b[0m');
console.log(`서버 경로: ${serverScriptPath}`);
console.log(`API 주소 : ${apiUrl}`);

// 설정 주입 함수
function injectConfig(filePath, clientName) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let config = { mcpServers: {} };
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        config = JSON.parse(raw);
        if (!config.mcpServers) config.mcpServers = {};
      } catch (e) {
        console.warn(`[경고] 기존 ${clientName} 설정 파일 파싱 실패. 백업 후 새로 작성합니다.`);
        fs.writeFileSync(`${filePath}.bak.${Date.now()}`, fs.readFileSync(filePath));
        config = { mcpServers: {} };
      }
    }

    config.mcpServers['bigdata'] = {
      command: 'node',
      args: [serverScriptPath],
      env: {
        BIGDATA_API_BASE_URL: apiUrl,
        BIGDATA_MCP_TOKEN: token,
      },
    };

    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf-8');
    console.log(`\x1b[32m✔ ${clientName} 설정 완료:\x1b[0m ${filePath}`);
    return true;
  } catch (err) {
    console.error(`\x1b[31m✘ ${clientName} 설정 중 오류:\x1b[0m`, err.message);
    return false;
  }
}

const platform = os.platform();
const homeDir = os.homedir();

// 1. Claude Desktop 설정
let claudeConfigDir = '';
if (platform === 'win32') {
  claudeConfigDir = path.join(process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming'), 'Claude');
} else if (platform === 'darwin') {
  claudeConfigDir = path.join(homeDir, 'Library', 'Application Support', 'Claude');
} else {
  claudeConfigDir = path.join(homeDir, '.config', 'Claude');
}
const claudeConfigFile = path.join(claudeConfigDir, 'claude_desktop_config.json');
injectConfig(claudeConfigFile, 'Claude Desktop');

// 2. Google Antigravity 설정
const antigravityConfigFile = path.join(homeDir, '.gemini', 'antigravity', 'mcp_config.json');
injectConfig(antigravityConfigFile, 'Google Antigravity');

// 3. Cursor Global 설정
const cursorGlobalConfigFile = path.join(homeDir, '.cursor', 'mcp.json');
injectConfig(cursorGlobalConfigFile, 'Cursor Global');

// 4. Windsurf 설정
const windsurfConfigFile = path.join(homeDir, '.codeium', 'windsurf', 'mcp_config.json');
injectConfig(windsurfConfigFile, 'Windsurf');

// 5. 로컬 프로젝트 Cursor 설정 (있을 경우 주입)
const localCursorConfig = path.resolve(__dirname, '..', '..', '.cursor', 'mcp.json');
if (fs.existsSync(path.dirname(localCursorConfig))) {
  injectConfig(localCursorConfig, 'Cursor Workspace');
}

console.log('\n\x1b[32m🎉 모든 에이전트/IDE 연동 설정이 성공적으로 등록되었습니다!\x1b[0m');
console.log('👉 Claude Desktop, Antigravity, Cursor, Windsurf를 재실행하시면 [bigdata] 도구들이 활성화됩니다.');
