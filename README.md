# Urban Landscape Perception Survey (도시경관 인식 설문조사)

이 프로젝트는 도시 경관 이미지에 대한 심리적 인식을 조사하기 위한 웹 어플리케이션입니다. React와 TypeScript로 제작되었으며, Tailwind CSS로 스타일링되었습니다. 데이터 저장은 Google Sheets와 연동됩니다.

## 1. 프로젝트 개요

- **목적**: 도시 경관 이미지 10장에 대한 심리적 척도(심미성, 안정성, 정체성, 우울함, 지루함) 조사
- **대상**: 전체 500장의 이미지 중 10장을 무작위/순차적으로 배정
- **기술 스택**: React, TypeScript, Tailwind CSS, Google Apps Script (Backend)

## 2. 폴더 구조

```
/
├── index.html          # 메인 HTML 파일
├── index.tsx           # React 진입점
├── App.tsx             # 메인 앱 로직 및 상태 관리
├── types.ts            # TypeScript 타입 정의
├── constants.ts        # 설정 값 (GitHub URL, Google Script URL 등)
├── vite.config.ts      # Vite 빌드 설정
├── package.json        # 의존성 및 스크립트
├── components/         # UI 컴포넌트
│   ├── StartPage.tsx   # 시작 화면 (인적사항)
│   ├── SurveyPage.tsx  # 설문 화면 (이미지 + 리커트 척도)
│   ├── EndPage.tsx     # 완료 화면
│   └── ProgressBar.tsx # 진행바
└── services/           # 로직 처리
    ├── api.ts          # Google Sheets API 연동
    └── imageService.ts # 이미지 URL 및 그룹 할당 로직
```

## 3. 설치 및 실행 방법

### 3.1 필수 요구사항
- Node.js 설치 (v16 이상 권장)
- Git 설치

### 3.2 로컬 실행
1. 프로젝트 폴더에서 터미널 열기
2. 의존성 설치:
   ```bash
   npm install
   ```
3. 개발 서버 실행:
   ```bash
   npm run dev
   ```
   브라우저에서 `http://localhost:5173` 접속

## 4. GitHub Pages 배포 방법 (자동화)

이 프로젝트는 `gh-pages` 패키지를 사용하여 GitHub Pages에 쉽게 배포할 수 있도록 설정되어 있습니다.

1. `constants.ts` 파일 확인:
   - `GITHUB_USERNAME`, `GITHUB_REPO`가 본인의 저장소와 일치하는지 확인하세요.

2. `vite.config.ts` 파일 확인:
   - `base` 설정이 저장소 이름과 일치하는지 확인하세요.
   - 예: 저장소 이름이 `hy_urban`이면 `base: '/hy_urban/'` 이어야 합니다.

3. 배포 명령어 실행:
   ```bash
   npm run deploy
   ```
   - 이 명령어는 프로젝트를 빌드하고 `gh-pages` 브랜치에 업로드합니다.

4. GitHub 설정 확인:
   - GitHub 저장소의 **Settings** > **Pages**로 이동합니다.
   - Source가 `gh-pages` 브랜치로 설정되어 있는지 확인합니다.
   - 배포된 URL로 접속하여 확인합니다.

## 5. Google Sheets 연동 (Backend)

이 웹앱은 Serverless 구조로, Google Apps Script(GAS)를 통해 Google Sheets에 데이터를 저장합니다.

### 5.1 Google Sheet 준비
1. 새 Google Sheet 생성
2. 시트 이름을 `Results`로 변경하고, 1행(헤더)에 다음 컬럼을 만드세요:
   `Timestamp`, `Gender`, `Age`, `Job`, `GroupId`, `ImageId`, `Aesthetics`, `Stability`, `Identity`, `Depression`, `Boredom`
3. 시트 하나를 더 만들고 이름을 `Tracking`으로 하세요 (그룹 할당 추적용). 
   - A열: `StrataKey` (예: 남성_20대)
   - B열: `LastGroup` (마지막으로 할당된 그룹 번호, 초기값 0)

### 5.2 Apps Script 작성
1. Google Sheet에서 `확장 프로그램` > `Apps Script` 실행
2. 아래 코드를 복사하여 붙여넣기 (`Code.gs`)

```javascript
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE"; // 시트 ID를 입력하세요
const TOTAL_GROUPS = 50;

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'assignGroup') {
    return handleGroupAssignment(e);
  }
  
  return ContentService.createTextOutput("Invalid Action");
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.action === 'submit') {
      saveResults(data);
      return ContentService.createTextOutput("Success");
    }
  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.toString());
  }
}

function handleGroupAssignment(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const trackSheet = ss.getSheetByName("Tracking");
  const gender = e.parameter.gender;
  const age = e.parameter.age;
  const key = gender + "_" + age;
  
  // 간단한 라운드 로빈 로직
  let rowIndex = -1;
  const data = trackSheet.getDataRange().getValues();
  
  // 1. 해당 스트라타 찾기
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] == key) {
      rowIndex = i + 1;
      break;
    }
  }
  
  let nextGroup = 1;
  
  if (rowIndex === -1) {
    // 새로운 스트라타면 추가
    trackSheet.appendRow([key, 1]);
    nextGroup = 1;
  } else {
    // 기존 스트라타면 그룹 번호 증가
    const lastGroup = data[rowIndex - 1][1];
    nextGroup = (lastGroup % TOTAL_GROUPS) + 1;
    trackSheet.getRange(rowIndex, 2).setValue(nextGroup);
  }
  
  const result = { groupId: nextGroup };
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function saveResults(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("Results");
  
  const timestamp = new Date();
  const demo = data.demographics;
  
  data.responses.forEach(res => {
    sheet.appendRow([
      timestamp,
      demo.gender,
      demo.age,
      demo.job,
      data.groupId,
      res.imageId,
      res.aesthetics,
      res.stability,
      res.identity,
      res.depression,
      res.boredom
    ]);
  });
}
```

3. **배포**:
   - 우측 상단 `배포` > `새 배포`
   - 유형: `웹 앱`
   - 액세스 권한: `모든 사용자` (필수)
   - 생성된 URL을 복사하여 `constants.ts`의 `GOOGLE_SCRIPT_URL` 변수에 넣으세요.
