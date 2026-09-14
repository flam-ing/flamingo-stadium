import json,re,os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data=json.loads(re.sub(r'^window\.GAMES_DATA=|;\s*$','',open(os.path.join(ROOT,'games.js'),encoding='utf-8').read().strip()))
rows=[]
for i,g in enumerate(data,1):
    rows.append(f"| {i:02d} | [{g['title']}](games/{g['id']}.html) | {g['orig']} (Stadium {g['series']}) | {g['controls']} |")
table="\n".join(rows)
md=f"""# Flamingo Stadium 🦩

[![PLAY NOW](https://img.shields.io/badge/PLAY%20NOW-GitHub%20Pages-4caf50?style=for-the-badge&logo=githubpages&logoColor=white)](https://minwoo19930301.github.io/flamingo-stadium/) [![SOURCE CODE](https://img.shields.io/badge/SOURCE%20CODE-minwoo19930301-e7322d?style=for-the-badge&logo=github&logoColor=white)](https://github.com/minwoo19930301/flamingo-stadium)

포켓몬 스타디움 1·2 「키즈 클럽」 미니게임 21종을 플라밍고 스타일로 다시 만든 웹 미니게임 모음입니다. 빌드도 서버도 없이 `index.html`을 열면 됩니다. 바닐라 JS, 외부 라이브러리 없음.

**한 키보드로 1~4명이 같이 합니다.** 게임 타이틀에서 숫자 `1~4`로 사람 수를 정하고, `K`로 각자 키를 바꿀 수 있습니다. 사람이 아닌 자리는 CPU가 채웁니다. 설정은 모든 게임에 함께 적용되고 브라우저에 저장됩니다.

| 플레이어 | 방향 | A | B |
|---|---|---|---|
| 1P | 방향키 | SPACE | ENTER |
| 2P | W A S D | C | V |
| 3P | I J K L | , | . |
| 4P | T F G H | B | N |

## 게임 목록

| # | 게임 | 원작 미니게임 | 조작 |
|---|---|---|---|
{table}

각 게임의 원작 규칙·점수·연출을 정리한 스펙은 `specs/<id>.md`에 있습니다. 제작할 때 이 스펙을 기준으로 삼았고, 검수도 스펙 대비로 했습니다.

## 구조

- `common/stadium.js` — 공용 셸. 타이틀·키 설정·카운트다운·타이머·순위 결과 화면, 플라밍고 그리기(`drawFlamingo`, 포즈 11종), 플레이어별 입력(`g.p(i)`), 효과음(WebAudio), 최고 기록(localStorage).
- `common/style.css` — 공용 스타일.
- `games/*.html` — 게임 하나당 파일 하나. 모두 `STADIUM.Game({{...}})` 계약을 따릅니다. 자세한 규칙은 `CONTRACT.md`.
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
"""
open(os.path.join(ROOT,'README.md'),'w',encoding='utf-8').write(md)
print('README ok', len(data))
