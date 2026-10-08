# 카카오 로그인 연결

기존 테스트 제출, 결과 조회, 공유, 코드로 궁합 조회 흐름은 유지한다.
Axios의 `withCredentials: true`는 fetch의 `credentials: "include"`에 해당한다.
API 기본 주소는 개발 빌드에서 `http://localhost:8001`, 운영 빌드에서
`https://api.pakit.kr`이다. `VITE_API_BASE_URL`을 지정하면 환경별 기본값을 덮어쓴다.

| 명세                                             | 연결 위치                                            |
| ------------------------------------------------ | ---------------------------------------------------- |
| 앱 진입 `GET /api/auth/me`                       | `src/hooks/useAuth.ts`, `src/layout/AppLayout.tsx`   |
| 카카오 로그인 페이지 이동, 현재 경로 저장        | `src/lib/auth.ts`의 `startKakaoLogin`                |
| `/auth/complete`: 로그인 확인 → 결과 연결 → 복귀 | `src/pages/AuthCompletePage.tsx`                     |
| 로컬 결과 코드 수집·중복 제거                    | `src/lib/auth.ts`의 `collectLocalResultCodes`        |
| `POST /api/auth/me/results/sync`                 | `src/api/auth.ts`의 `syncResults`                    |
| 내 결과 `GET /api/auth/me/results`               | `/my/results`, `src/pages/MyAccountPage.tsx`         |
| 내 궁합 `GET /api/auth/me/compatibilities`       | `/my/compatibilities`, `src/pages/MyAccountPage.tsx` |
| 기존 제출에 로그인 쿠키 전달                     | `src/api/assessment.ts`의 `submitAssessment`         |
| 로그아웃, 계정 캐시 초기화                       | `src/components/auth/AccountHeader.tsx`              |
| 이미지 참고 결과 보관 안내 모달                  | `src/components/auth/SaveResultPrompt.tsx`           |

홈에는 로그인 바를 추가하지 않는다. 홈 하단의 ‘내 보관함’으로 계정 목록에 접근하며, 계정 목록 헤더에서 내 결과·내 궁합·로그아웃을 제공한다.
내 결과 목록은 기존 `/result/:id`, 내 궁합 목록은 기존 `/compatibility?mine=...&friend=...` 화면으로 연결한다.
본인의 로컬 결과를 처음 열면 결과 화면 위에 계정 보관 모달을 한 번 자동으로 표시한다. ‘나중에 할게요’ 또는 배경을 눌러 닫으면 같은 탭에서는 같은 결과에 대해 재노출하지 않는다. 결과 히어로 아래의 보관 카드로 다시 열 수 있다. 로그인 시에는 해당 카드가 내 보관함 링크로 바뀐다. 공유받은 친구 결과에는 보관 모달을 띄우지 않는다.
카카오 사용자 정보는 인증 상태 확인에만 사용하고, 화면의 닉네임은 결과에 저장된 테스트 닉네임을 사용한다.

동기화는 `pakit-result-code`와 모든 `pakit-test-*`의 `state.resultCode`를 수집한다.
이전 문항 버전의 결과 코드가 있는 저장소도 삭제하지 않는다.
동기화 실패나 일부 코드 거절은 로그인 성공을 취소하지 않으며 로컬 결과를 삭제하지 않는다.
로그아웃은 인증 상태와 `account` 쿼리 캐시만 초기화한다.

## 검증

- `npm run build`, `npm run lint` 통과.
- 모의 검증: 내부 경로·쿼리·해시 복원, 외부 URL 차단, 완료 화면 복귀 루프 차단, 중복 코드 제거, 손상되거나 차단된 저장소 처리.
- 모의 검증: 완료 처리 중복 실행 방지, 코드 없으면 동기화 생략, 동기화 거절/네트워크 실패 후 정상 복귀, 인증 실패 시 동기화 방지.
- 운영 확인 필요: 실제 카카오 인증, `https://pakit.kr/auth/complete` 콜백, 서버의 credential CORS/쿠키 설정, 로그인 후 결과 연결 및 로그아웃.

## 로컬 모킹 실행

```bash
npm run dev:auth-mock
```

표시된 로컬 URL을 연다. 화면 위에 ‘로컬 API 모킹’ 안내가 나오며 카카오 버튼은 실제 카카오 사이트 대신 로컬 `/auth/complete`로 이동한다.
일반 `npm run dev`와 운영 빌드에는 모킹이 적용되지 않는다.
모킹은 개발 환경의 `VITE_AUTH_MOCK=true`에서만 켜진다. API 요청은 Axios adapter가 처리하며 운영 서버로 보내지 않는다.

1. 홈의 기존 ‘결과지 보기’에서 샘플 코드 `STORYMIN`을 입력한다. 닉네임은 ‘지은’이다.
2. 본인의 결과를 처음 열면 보관 모달이 자동으로 나타난다. 닫은 뒤에는 결과 상단의 ‘내 장난감, 오래 보관해요’ 카드로 다시 열 수 있다.
3. ‘카카오로 로그인하고 보관하기’를 누르면 로그인 확인 → 결과 동기화 → 원래 결과 화면 복귀를 실제 프론트 코드로 처리한다.
4. 홈 하단 ‘내 보관함’을 열어 ‘내 결과’에서 연결된 결과, ‘내 궁합’에서 샘플 친구 ‘선우’와 82점 궁합을 확인한다. 친구 결과 코드는 `STORYFRI`다.
5. 로그아웃하면 계정 목록은 로그인 안내로 바뀌며 기존 로컬 결과 코드는 유지된다.

모킹의 샘플 계정은 하나이며, 연결된 결과는 로컬 `pakit-auth-mock-linked`에 저장된다.
로그인 상태는 현재 탭의 `pakit-auth-mock-session`에만 저장된다. 실제 인증 쿠키를 대체하는 개발용 값이다.
샘플 궁합은 `STORYMIN`이 연결되어 있으면 제공된다.
새 테스트 제출 결과도 모킹하고, 테스트에서 입력한 닉네임으로 결과를 반환한다.
정의되지 않은 API는 모킹 404를 반환한다.

### 자동 브라우저 검증

```bash
npm run test:auth
```

설치된 Google Chrome을 사용하며 모킹 개발 서버를 `http://127.0.0.1:4173`에서 자동 실행하고 종료한다.
다른 환경에서는 Chrome 설치 또는 Playwright의 browser/channel 설정 변경이 필요하다.
브라우저 테스트는 각 테스트의 독립 저장소에서 실행하므로 사용자가 보관한 결과를 변경하지 않는다.
보관 모달과 내 궁합 목록의 확인 이미지는 `test-results/auth-save-modal.png`, `test-results/auth-my-compatibilities.png`에 저장한다.

오류 상황은 로컬 브라우저 콘솔에서 다음 중 하나를 설정한 후 로그인 또는 로그아웃 버튼으로 확인할 수 있다.

```js
sessionStorage.setItem("pakit-auth-mock-scenario", "sync-failure"); // 동기화 500
sessionStorage.setItem("pakit-auth-mock-scenario", "login-failure"); // 완료 화면 로그인 확인 401
sessionStorage.setItem("pakit-auth-mock-scenario", "logout-failure"); // 로그아웃 500
sessionStorage.removeItem("pakit-auth-mock-scenario"); // 정상 상태 복원
```

초기화할 때는 `pakit-auth-mock-` 접두사의 저장소 항목만 지운다. 기존 `pakit-result-code`, `pakit-test-*`는 유지한다.
