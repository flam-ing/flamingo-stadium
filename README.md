# Flamingo Stadium 🦩

[![PLAY NOW](https://img.shields.io/badge/PLAY%20NOW-GitHub%20Pages-4caf50?style=for-the-badge&logo=githubpages&logoColor=white)](https://minwoo19930301.github.io/flamingo-stadium/) [![SOURCE CODE](https://img.shields.io/badge/SOURCE%20CODE-minwoo19930301-e7322d?style=for-the-badge&logo=github&logoColor=white)](https://github.com/minwoo19930301/flamingo-stadium)

포켓몬 스타디움 1·2 「키즈 클럽」 미니게임 21종을 플라밍고 스타일로 다시 만든 웹 미니게임 모음입니다. 빌드도 서버도 없이 `index.html`을 열면 됩니다. 바닐라 JS, 외부 라이브러리 없음.

**한 키보드로 1~4명이 같이 합니다.** 게임 타이틀 화면이나 결과 화면에서 숫자 `1~4`로 사람 수를 정하고, 타이틀에서 `K`로 각자 키를 바꿀 수 있습니다. 사람이 아닌 자리는 CPU가 채웁니다. 설정은 모든 게임에 함께 적용되고 브라우저에 저장됩니다.

| 플레이어 | 방향 | A | B |
|---|---|---|---|
| 1P | 방향키 | SPACE | ENTER |
| 2P | W A S D | C | V |
| 3P | I J K L | , | . |
| 4P | T F G H | B | N |

## 게임 목록

| # | 게임 | 원작 미니게임 | 조작 |
|---|---|---|---|
| 01 | [플라밍고 스플래시](games/splash.html) | Magikarp's Splash (Stadium 1) | A 꾹 눌러 힘 모으기 · 떼면 점프 |
| 02 | [플라밍고 세이즈](games/says.html) | Clefairy Says (Stadium 1) | ↑↓←→로 순서 입력 (A·B 미사용) |
| 03 | [달려라 플라밍고](games/run.html) | Run Rattata Run (Stadium 1) | A 연타 = 달리기 · ↑(또는 B) = 허들 점프 |
| 04 | [코골이 대결](games/snore.html) | Snore War (Stadium 1) | 추가 빨간 바늘을 지날 때 A (B도 가능) |
| 05 | [번개 발전기](games/dynamo.html) | Thundering Dynamo (Stadium 1) | 파랑 램프 A 연타 · 초록 램프 B 연타 |
| 06 | [파! 파! 파!](games/dig.html) | Dig! Dig! Dig! (Stadium 1) | ←→ 또는 A·B 번갈아 연타 |
| 07 | [링 던지기](games/hoop.html) | Ekans' Hoop Hurl (Stadium 1) | ←→ 조준 · A 길게 눌러 힘 모으기 · 떼면 던지기 |
| 08 | [딱딱하게!](games/harden.html) | Rock Harden (Stadium 1) | A 누르는 동안 딱딱해짐 · 바위 닿기 직전 톡! |
| 09 | [초밥 뷔페](games/sushi.html) | Sushi-Go-Round (Stadium 1) | ←→↑↓ 이동 · A 버튼으로 부리 뻗기 |
| 10 | [동굴 하트 플라밍고](games/golbat.html) | Gutsy Golbat (Stadium 2) | A 연타 = 날갯짓 · ←→ 이동 |
| 11 | [플라밍고 벌목왕](games/clearcut.html) | Clear Cut Challenge (Stadium 2) | A 버튼: 떨어지는 통나무 베기 (라운드당 1번) |
| 12 | [통통볼 플라밍고](games/furret.html) | Furret's Frolic (Stadium 2) | 방향키 꾹 눌러 칸 이동 · A 점프해 볼 치기 |
| 13 | [플라밍고 택배](games/delibird.html) | Delibird's Delivery (Stadium 2) | ←↑→↓ 이동 · 줍기·배달 자동 (A·B 안 씀) |
| 14 | [알 구조대](games/eggs.html) | Egg Emergency (Stadium 2) | ←→ 누르면 기울기 · 떼면 가운데 |
| 15 | [데굴데굴 플라밍고](games/togepi.html) | Tumbling Togepi (Stadium 2) | ↓ 누른 채 달리기 · ←→ 회피 · 버튼 없음 |
| 16 | [밍고 발전소](games/pichu.html) | Pichu's Power Plant (Stadium 2) | ←→↑↓ 전극 방향 · 파랑 A 연타 · 초록 B 연타 |
| 17 | [플라밍고 세기](games/stampede.html) | Streaming Stampede (Stadium 2) | A 버튼: 문제 플라밍고가 지나갈 때마다 한 번 |
| 18 | [돌돌 레이스](games/rollout.html) | Rampage Rollout (Stadium 2) | ↑↓←→ 방향 전환 · A 회오리 설치 |
| 19 | [플라밍고 배리어볼](games/barrier.html) | Barrier Ball (Stadium 2) | ←→(3P·4P ↑↓) 배리어 이동 · A 스매시 |
| 20 | [빙글빙글 링아웃](games/topsy.html) | Topsy-Turvy (Stadium 2) | ←→↑↓ 이동 · A 회전 공격(3초 재충전) |
| 21 | [잽싼 밍고](games/eevee.html) | Eager Eevee (Stadium 2) | 뚜껑 열리면 A · B 페이크 · 닫힌 뚜껑 A는 기절 |

각 게임의 원작 규칙·점수·연출을 정리한 스펙은 `specs/<id>.md`에 있습니다. 제작할 때 이 스펙을 기준으로 삼았고, 검수도 스펙 대비로 했습니다.

## 구조

- `common/stadium.js` — 공용 셸. 타이틀·키 설정·카운트다운·타이머·순위 결과 화면, 플라밍고 그리기(`drawFlamingo`, 포즈 11종), 플레이어별 입력(`g.p(i)`), 효과음(WebAudio), 최고 기록(localStorage).
- `common/style.css` — 공용 스타일.
- `games/*.html` — 게임 하나당 파일 하나. 모두 `STADIUM.Game({...})` 계약을 따릅니다. 자세한 규칙은 `CONTRACT.md`.
- `games.js` — 허브 카드 데이터. `python3 scripts/gen_games_js.py`로 다시 만듭니다.
- `specs/*.md` — 원작 미니게임 조사 스펙 21개.

## 검증

```sh
sh scripts/smoke.sh            # 헤드리스 크롬: 콘솔 에러 + 타이틀 스크린샷 (scripts/out/)
sh scripts/play.sh --humans 2  # Playwright: 시작 → 카운트다운 → 6초 플레이 → 스크린샷, 에러 검사
```

`play.sh`는 로컬 크롬과 `playwright-core`가 필요합니다(`CHROME`, `PW_MODULE` 환경변수로 경로 지정).

## 새 게임 추가

`games/_template.html`을 복사해서 `Game` 설정만 채우고, `scripts/gen_games_js.py`를 다시 돌리면 허브에 나타납니다.
