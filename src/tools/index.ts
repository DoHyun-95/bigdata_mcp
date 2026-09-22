import { BigdataApiClient } from '../client.js';

export function registerTools(apiClient: BigdataApiClient) {
  return [
    {
      name: 'get_account_context',
      description: '연결된 BIGDATA 계정, 권한(Scopes), 기능 활성화 여부, 제한 한도를 확인합니다.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      handler: async () => {
        return await apiClient.get('/me');
      },
    },
    {
      name: 'get_catalog',
      description: '지문 또는 문항의 카테고리(분류 체계) 목록을 계층별로 조회합니다.',
      inputSchema: {
        type: 'object',
        properties: {
          resource: {
            type: 'string',
            enum: ['passages', 'questions'],
            description: '분류 대상 (passages: 지문, questions: 문항)',
            default: 'passages',
          },
          level: {
            type: 'integer',
            minimum: 1,
            maximum: 5,
            description: '카테고리 레벨 (1~5)',
            default: 1,
          },
          parents: {
            type: 'array',
            items: { type: 'string' },
            description: '상위 레벨 선택값 배열 (level-1개)',
          },
          limit: {
            type: 'integer',
            default: 20,
            maximum: 50,
          },
          cursor: {
            type: 'string',
          },
        },
      },
      handler: async (args: any) => {
        return await apiClient.get('/catalog', args);
      },
    },
    {
      name: 'get_question_types',
      description: 'BIGDATA에서 지원하는 문제 유형(대분류, 제목, q_type, 쓰기 가능 여부 등) 목록을 조회합니다.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      handler: async () => {
        return await apiClient.get('/question-types');
      },
    },
    {
      name: 'get_question_schema',
      description: '특정 문제 유형(type_id)의 세부 JSON 규격, 보기 칸수, 설명 및 예시를 조회합니다.',
      inputSchema: {
        type: 'object',
        required: ['type_id'],
        properties: {
          type_id: {
            type: 'string',
            description: '문제 유형 ID (예: qt:101)',
          },
        },
      },
      handler: async (args: { type_id: string }) => {
        return await apiClient.get(`/question-types/${encodeURIComponent(args.type_id)}/schema`);
      },
    },
    {
      name: 'search_passages',
      description: '접근 가능한 영어 원문 지문을 검색합니다. (검색어, 카테고리 필터 지원)',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: '검색 키워드 (영어 또는 한국어, 최대 200자)',
          },
          category_path: {
            type: 'array',
            items: { type: 'string' },
            description: '카테고리 경로 필터 (예: ["고2", "2023년 3월"])',
          },
          limit: {
            type: 'integer',
            default: 20,
            maximum: 50,
          },
          cursor: {
            type: 'string',
            description: '페이지네이션 커서',
          },
        },
      },
      handler: async (args: any) => {
        return await apiClient.get('/passages', args);
      },
    },
    {
      name: 'get_passage',
      description: '특정 지문의 전체 영어 원문과 한국어 해석, 해시값을 조회합니다.',
      inputSchema: {
        type: 'object',
        required: ['passage_id'],
        properties: {
          passage_id: {
            type: 'string',
            description: '지문 ID (예: passage:123)',
          },
        },
      },
      handler: async (args: { passage_id: string }) => {
        return await apiClient.get(`/passages/${encodeURIComponent(args.passage_id)}`);
      },
    },
    {
      name: 'search_questions',
      description: '보관함(saved) 또는 문제은행(bank)에서 문항 목록을 검색합니다.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: '검색 키워드 (최대 200자)',
          },
          source: {
            type: 'string',
            enum: ['saved', 'bank'],
            default: 'saved',
            description: '문항 출처 (saved: 내 보관함, bank: 문제은행)',
          },
          type_id: {
            type: 'string',
            description: '문제 유형 ID 필터',
          },
          category_path: {
            type: 'array',
            items: { type: 'string' },
            description: '카테고리 경로',
          },
          limit: {
            type: 'integer',
            default: 20,
            maximum: 50,
          },
          cursor: {
            type: 'string',
          },
        },
      },
      handler: async (args: any) => {
        return await apiClient.get('/questions', args);
      },
    },
    {
      name: 'get_question',
      description: '특정 문항의 문제, 선택지, 정답, 해설 등 세부 정보를 표준 Question 규격으로 조회합니다.',
      inputSchema: {
        type: 'object',
        required: ['question_id'],
        properties: {
          question_id: {
            type: 'string',
            description: '문항 ID (예: saved:456 또는 bank:789)',
          },
        },
      },
      handler: async (args: { question_id: string }) => {
        return await apiClient.get(`/questions/${encodeURIComponent(args.question_id)}`);
      },
    },
    {
      name: 'validate_questions',
      description: '작성한 문항 데이터가 BIGDATA 저장 규격에 맞는지 사전 검증합니다. (DB에 저장하지 않음)',
      inputSchema: {
        type: 'object',
        required: ['questions'],
        properties: {
          schema_version: {
            type: 'string',
            default: '1.0',
          },
          questions: {
            type: 'array',
            description: '검증할 Question 객체 배열 (1~20개)',
            items: { type: 'object' },
          },
        },
      },
      handler: async (args: any) => {
        return await apiClient.post('/questions/validate', args);
      },
    },
    {
      name: 'save_questions',
      description: '검증된 문항들을 BIGDATA 개인 보관함(비공개)에 신규 저장합니다. (멱등키 필수)',
      inputSchema: {
        type: 'object',
        required: ['questions', 'idempotency_key'],
        properties: {
          schema_version: {
            type: 'string',
            default: '1.0',
          },
          idempotency_key: {
            type: 'string',
            description: '중복 저장 방지를 위한 멱등키 (UUID 등 16~128자)',
          },
          questions: {
            type: 'array',
            description: '저장할 Question 객체 배열 (1~20개)',
            items: { type: 'object' },
          },
        },
      },
      handler: async (args: { questions: any[]; idempotency_key: string; schema_version?: string }) => {
        const { idempotency_key, ...body } = args;
        return await apiClient.post('/questions', body, idempotency_key);
      },
    },
  ];
}
