# 외국어 학습 앱

## 소개
본 프로젝트는 외국어 학습에서 가장 기본이 되는 **단어 암기**를 효율적으로 돕기 위해 제작된 애플리케이션입니다.  
사용자는 단어를 입력하고 번역 및 예문을 확인하며, 플래시카드 형식으로 반복 학습할 수 있습니다.

---

## 핵심 기능
- 단어장
  - 입력한 단어 자동 번역 및 저장
  - 단어, 뜻, 발음 제공
  - 삭제 가능
- 플래시카드 학습
  - 앞면: 외국어 단어/발음
  - 뒷면: 번역
  - 카드 뒤집기 애니메이션
  - 이를 통해 꾸준한 학습 가능
- 데이터 저장
  - JSON 또는 LocalStorage 기반
  - 새로고침 후에도 단어 목록 유지

---

## 기술 스택
- **Frontend**: React + TailwindCSS  
- **Backend**: Node.js (Express, 추후 확장 가능)  
- **Data**: JSON / LocalStorage  
- **API**: Google Translate API 또는 OpenAI API  

---

## 실행 방법

### 1. 프로젝트 클론
```bash
git clone https://github.com/ai-modeling-jr/2nd-test-SeoRace.git
cd 2nd-test-SeoRace
```
`npm install`
`npm start`