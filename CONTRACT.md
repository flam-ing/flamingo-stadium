# Flamingo Stadium — 게임 작성 계약 (v2)

모든 게임은 `games/<id>.html` 한 파일. `games/_template.html` 구조를 그대로 복사한다. 외부 라이브러리 금지, 바닐라 JS. `common/*`는 수정 금지.

## 셸 API (`common/stadium.js` → `window.STADIUM`)

- `Game({ id, title, howto:[...], duration, init(), update(dt), draw(ctx), result() })` → `g`
  - `duration` 초. `0`이면 무제한이며 게임이 직접 `g.finish()`를 부른다.
  - 셸은 첫 프레임에 `init()`을 한 번 부르고(타이틀 화면 뒤에 게임 장면을 그리기 위해; 이때 `g`는 이미 할당돼 있음), 시작할 때마다 다시 부른다. `draw()`는 `init()` 이후에만 호출된다.
  - `g.W=960, g.H=540, g.time, g.timeLeft, g.humans, g.slots(), g.isHuman(i), g.nameOf(i), g.p(i)`.
- **플레이어 슬롯 4개 고정**: `slots()` → `[{i, name:'1P'.., color, human:boolean, keys}]`. 사람 수(1~4)는 타이틀에서 숫자키로 정하고 셸이 저장한다. 게임은 **항상 4명(또는 그 게임의 최대 인원)을 만들고**, `human`이면 입력을, 아니면 CPU AI를 쓴다. 1P가 항상 사람이고 사람은 0..humans-1 슬롯.
- **입력**: `g.p(i).hit('a')` (그 프레임에 눌림), `g.p(i).down('a')` (누르고 있음), 액션은 `up down left right a b`. `g.p(i).axis()` → `{x,y}`. 키 코드는 절대 직접 쓰지 말 것(`input.hit('Space')` 금지). 안내 문구에는 키 이름 대신 `A 버튼`, `←→` 처럼 액션 이름을 쓴다(각 플레이어 키는 타이틀에 표시됨).
- **결과**: `result()`는 `{ scores:[4개 숫자], text:'', lowerIsBetter?:true }`를 돌려준다. 셸이 순위 화면을 그린다. 탈락/실패한 플레이어는 낮은 점수를 주면 된다.
- 그리기: `drawFlamingo(ctx,x,y,scale,pose,t,color,{flip,rot,alpha})`, 포즈 `idle jump run sleep dig eat dizzy harden fly ball hit`. `drawPlayerTag(ctx,x,y,i)`는 "1P"/"2P CPU" 배지. `bg, text, rr, rand, clamp, lerp, palette(players[4], gold, red, ...)`.
- 효과음: `sfx.tap good bad win lose tick count go hit pop`, `sfx.beep(freq,dur,type,vol)`.

## 품질 기준

- 원작(포켓몬 스타디움 1·2) 미니게임의 **규칙·조작·점수·시간·난이도 곡선·화면 구성·연출 타이밍**을 `specs/<id>.md`에 맞춰 최대한 그대로 재현한다. 캐릭터만 플라밍고로 바꾼다.
- CPU는 원작처럼 난이도 있는 상대여야 한다(무작위가 아니라 반응 지연·정확도 모델).
- 화면 문구는 전부 한국어. 한 화면에 각 플레이어의 상태(점수/체력/순위)가 항상 보여야 한다.
- 파일 300줄 이내 권장. 콘솔 에러 0. `sh scripts/smoke.sh <id>`와 `node scripts/play.mjs <id> <port>`를 통과해야 한다.
