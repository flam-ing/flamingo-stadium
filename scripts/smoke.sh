#!/bin/sh
# Opens every game headlessly, records console errors and a title screenshot into scripts/out/.
cd "$(dirname "$0")/.." || exit 1
mkdir -p scripts/out
python3 -m http.server 8799 >/dev/null 2>&1 & PID=$!
sleep 1
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
fail=0
for f in index.html games/*.html; do
  case "$f" in *_template*) continue;; esac
  n=$(basename "$f" .html)
  log=$("$CHROME" --headless=new --disable-gpu --window-size=1000,620 --virtual-time-budget=3000 --enable-logging=stderr --v=0 --screenshot="scripts/out/$n.png" "http://localhost:8799/$f" 2>&1 | grep -E 'CONSOLE|Uncaught|ReferenceError|TypeError|SyntaxError' | grep -v 'CVDisplayLink')
  if [ -n "$log" ]; then echo "FAIL $f"; echo "$log"; fail=1; else echo "ok   $f"; fi
done
kill $PID
exit $fail
