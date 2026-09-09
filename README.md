# Flamingo Stadium 🦩

포켓몬 스타디움 1·2의 미니게임을 플라밍고 스타일로 다시 만든 웹 미니게임 모음입니다. 빌드도 서버도 없이 `index.html`을 열면 됩니다. 바닐라 JS, 외부 라이브러리 없음.

| # | 게임 | 원작 미니게임 | 조작 |
|---|---|---|---|
| 01 | 플라밍고 스플래시 | Magikarp's Splash | SPACE 연타 |
| 02 | 플라밍고 세이즈 | Clefairy Says | 방향키 |
| 03 | 달려라 플라밍고 | Run Rattata Run | ←→ 번갈아, SPACE 점프 |
| 04 | 코골이 대결 | Snore War | SPACE 타이밍 |
| 05 | 번개 발전기 | Thundering Dynamo | A(파랑) / L(노랑) 연타 |
| 06 | 파! 파! 파! | Dig! Dig! Dig! | ←→ 번갈아 |
| 07 | 링 던지기 | Ekans' Hoop Hurl | ←→ 조준, SPACE 홀드 |
| 08 | 딱딱하게! | Rock Harden | SPACE 홀드 |
| 09 | 초밥 뷔페 | Sushi-Go-Round | SPACE |
| 10 | 알 구조대 | Egg Emergency | ←→ |

## 구조

- `common/stadium.js` — 공용 셸. 타이틀·카운트다운·타이머·결과 화면, 플라밍고 그리기(`drawFlamingo`), 키 입력, 효과음(WebAudio), 최고 기록(localStorage).
- `common/style.css` — 공용 스타일.
- `games/*.html` — 게임 하나당 파일 하나. 모두 `STADIUM.Game({...})` 계약을 따릅니다: `init / update(dt) / draw(ctx) / result()`.
- `index.html` — 허브.

## 검증

`scripts/smoke.sh`가 헤드리스 크롬으로 모든 게임을 열어 콘솔 에러 여부와 타이틀 화면 스크린샷을 확인합니다.

```sh
sh scripts/smoke.sh
```

## 새 게임 추가

`games/_template.html`을 복사해서 `Game` 설정만 채우면 됩니다. `index.html`의 `GAMES` 배열에 한 줄 추가합니다.
