# Lighthouse after-fixes

- Base: `http://localhost:3000`
- Runs per route/device: 1 (median)
- Generated: 2026-11-14T10:49:02.014Z

| Route | Device | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | SI | Status |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| / | mobile | 76 | 88 | 100 | 100 | 1235 | 4581 | 266 | 0.008 | 3998 | FAIL |
| / | desktop | 98 | 96 | 100 | 100 | 326 | 1002 | 0 | 0.003 | 1257 | PASS |
| /en | mobile | 82 | 88 | 100 | 100 | 1547 | 4506 | 60 | 0 | 3831 | FAIL |
| /en | desktop | 98 | 96 | 100 | 100 | 416 | 957 | 0 | 0 | 1111 | PASS |
| /about | mobile | 40 | 93 | 77 | 100 | 1847 | 8865 | 9076 | 0 | 5418 | FAIL |
| /about | desktop | 92 | 93 | 100 | 100 | 417 | 1353 | 165 | 0.005 | 1019 | PASS |
| /booking | mobile | 54 | 93 | 77 | 100 | 2343 | 7056 | 726 | 0 | 4332 | FAIL |
| /booking | desktop | 70 | 93 | 54 | 100 | 466 | 1286 | 29 | 1.615 | 1629 | FAIL |
| /offers | mobile | 75 | 96 | 100 | 100 | 1023 | 6801 | 154 | 0.001 | 1493 | FAIL |
| /offers | desktop | 96 | 97 | 100 | 100 | 299 | 1405 | 0 | 0.031 | 503 | PASS |
| /categories | mobile | 78 | 95 | 100 | 100 | 1244 | 5707 | 105 | 0.001 | 1244 | FAIL |
| /categories | desktop | 98 | 95 | 100 | 100 | 256 | 1146 | 0 | 0.004 | 411 | PASS |
| /blog | mobile | 66 | 91 | 100 | 100 | 1062 | 6266 | 181 | 0 | 9019 | FAIL |
| /blog | desktop | 94 | 95 | 100 | 100 | 284 | 1264 | 0 | 0.003 | 1739 | PASS |
| /contact | mobile | 78 | 100 | 96 | 100 | 1056 | 6012 | 63 | 0.001 | 1056 | FAIL |
| /contact | desktop | 98 | 100 | 100 | 100 | 286 | 1172 | 0 | 0.004 | 462 | PASS |
| /doctors-apply | mobile | 96 | 92 | 96 | 100 | 946 | 946 | 201 | 0.059 | 946 | PASS |
| /doctors-apply | desktop | 100 | 88 | 96 | 100 | 262 | 262 | 0 | 0.016 | 289 | FAIL |
| /privacy | mobile | 78 | 100 | 100 | 100 | 1056 | 5636 | 68 | 0.058 | 1056 | FAIL |
| /privacy | desktop | 98 | 100 | 100 | 100 | 287 | 1173 | 0 | 0.012 | 308 | PASS |
| /terms | mobile | 78 | 100 | 100 | 100 | 1055 | 5786 | 108 | 0.055 | 1055 | FAIL |
| /terms | desktop | 98 | 100 | 100 | 100 | 288 | 1176 | 0 | 0.017 | 320 | PASS |
