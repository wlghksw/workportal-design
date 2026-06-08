# WorkPortal Design Share

에듀올랩 통합 업무 포탈의 **디자인/UI 협업용** 저장소입니다.

서버·배포·DB·인증 로직은 포함하지 않았습니다. 화면 HTML/CSS/JS와 가이드 이미지 자산만 공유합니다.

## 포함된 파일

| 경로 | 설명 |
|------|------|
| `guide.html` | 이용 가이드 메인 (E-Book / PPT / 뉴스레터 / 회의록) |
| `index.html` | 포탈 홈 화면 |
| `login.html` | 로그인 화면 |
| `styles.css` | 포탈 홈 스타일 |
| `app.js` | 포탈 홈 프론트 스크립트 |
| `assets/` | 공통 헤더·로고 |
| `guide-assets/` | 가이드 스크린샷 이미지 |

## 로컬 미리보기

루트 경로(`/`) 기준으로 열리도록 작성되어 있어, 간단한 정적 서버로 확인하는 것을 권장합니다.

```bash
npx serve . -p 3000
```

브라우저에서:

- 가이드: http://localhost:3000/guide.html
- 포탈 홈: http://localhost:3000/index.html

## 협업 범위

- 레이아웃, 색상, 타이포, 컴포넌트 스타일 개선
- 가이드 핫스팟(번호 클릭 영역) UI 조정
- 반응형·다크모드 등 프론트 디자인 개선

## 제외된 항목

- `server.js`, DB, 사용자 인증
- nginx / systemd / deploy 스크립트
- `.env`, 운영 서버 설정

## 운영 저장소

실제 배포용 코드는 별도 private 저장소에서 관리합니다.  
이 저장소는 **디자인 개선안 공유** 목적의 public mirror입니다.
