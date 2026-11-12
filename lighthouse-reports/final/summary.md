# Lighthouse final

- Base URL: `http://localhost:3001`
- Runs per route/device: 1 (median reported)
- Generated: 2026-11-12T12:24:49.385Z

| Route | Device | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | SI | Status |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| / | mobile | 78 | 88 | 100 | 100 | 1222 | 4887 | 210 | 0 | 2336 | FAIL |
| / | desktop | 97 | 96 | 100 | 100 | 354 | 1255 | 0 | 0.003 | 623 | PASS |
| /en | mobile | 82 | 88 | 100 | 100 | 1550 | 4359 | 175 | 0 | 2426 | FAIL |
| /en | desktop | 99 | 96 | 100 | 100 | 418 | 943 | 0 | 0 | 564 | PASS |
| /about | mobile | 44 | 93 | 73 | 100 | 1357 | 95932 | 2373 | 0 | 4284 | FAIL |
| /about | desktop | 93 | 93 | 73 | 100 | 419 | 1337 | 145 | 0.005 | 1183 | FAIL |
| /en/about | mobile | — | — | — | — | — | — | — | — | — | ERROR |
| /en/about | desktop | 93 | 93 | 73 | 100 | 459 | 1357 | 145 | 0.001 | 1209 | FAIL |
| /contact | mobile | 77 | 100 | 96 | 100 | 1061 | 6022 | 125 | 0.001 | 1296 | FAIL |
| /contact | desktop | 98 | 100 | 100 | 100 | 289 | 1178 | 0 | 0.004 | 476 | PASS |
| /en/contact | mobile | 78 | 96 | 96 | 100 | 1209 | 5953 | 110 | 0 | 1209 | FAIL |
| /en/contact | desktop | 97 | 96 | 100 | 100 | 328 | 1216 | 0 | 0 | 493 | PASS |
| /blog | mobile | 77 | 91 | 77 | 100 | 1209 | 6193 | 111 | 0 | 2490 | FAIL |
| /blog | desktop | 97 | 95 | 77 | 100 | 330 | 1268 | 0 | 0.003 | 924 | FAIL |
| /en/blog | mobile | 84 | 91 | 100 | 100 | 1211 | 4314 | 124 | 0 | 1620 | FAIL |
| /en/blog | desktop | 97 | 95 | 100 | 100 | 330 | 1219 | 0 | 0 | 519 | PASS |
| /categories | mobile | 76 | 95 | 100 | 100 | 1060 | 4369 | 382 | 0.001 | 1090 | FAIL |
| /categories | desktop | 94 | 95 | 77 | 100 | 284 | 1188 | 164 | 0.004 | 767 | FAIL |
| /en/categories | mobile | 70 | 95 | 100 | 100 | 1204 | 6106 | 336 | 0 | 2216 | FAIL |
| /en/categories | desktop | 76 | 95 | 77 | 100 | 326 | 1232 | 504 | 0 | 824 | FAIL |
| /offers | mobile | 69 | 96 | 100 | 100 | 1034 | 6805 | 348 | 0.001 | 1674 | FAIL |
| /offers | desktop | 96 | 97 | 100 | 100 | 285 | 1439 | 0 | 0.031 | 469 | PASS |
| /en/offers | mobile | 75 | 96 | 100 | 100 | 1175 | 6730 | 148 | 0 | 1516 | FAIL |
| /en/offers | desktop | 95 | 97 | 100 | 100 | 314 | 1480 | 7 | 0 | 494 | PASS |
| /booking | mobile | 48 | 93 | 54 | 100 | 2600 | 7147 | 1188 | 0 | 3460 | FAIL |
| /booking | desktop | 87 | 93 | 54 | 100 | 538 | 1378 | 216 | 0.005 | 1635 | FAIL |
| /en/booking | mobile | 49 | 93 | 58 | 100 | 1681 | 6768 | 1447 | 0 | 3699 | FAIL |
| /en/booking | desktop | 73 | 93 | 54 | 100 | 385 | 1886 | 382 | 0.001 | 1542 | FAIL |
| /doctors-apply | mobile | 92 | 92 | 96 | 100 | 959 | 959 | 319 | 0.059 | 959 | PASS |
| /doctors-apply | desktop | 100 | 88 | 96 | 100 | 286 | 286 | 1 | 0.016 | 320 | FAIL |
| /en/doctors-apply | mobile | 93 | 88 | 96 | 100 | 952 | 952 | 330 | 0.027 | 952 | FAIL |
| /en/doctors-apply | desktop | 100 | 88 | 96 | 100 | 318 | 318 | 0 | 0.002 | 333 | FAIL |
| /privacy | mobile | 75 | 100 | 100 | 100 | 1080 | 5791 | 186 | 0.058 | 1080 | FAIL |
| /privacy | desktop | 98 | 100 | 100 | 100 | 290 | 1141 | 0 | 0.012 | 345 | PASS |
| /en/privacy | mobile | 78 | 96 | 100 | 100 | 1208 | 6091 | 81 | 0.009 | 1208 | FAIL |
| /en/privacy | desktop | 98 | 96 | 100 | 100 | 329 | 1197 | 0 | 0 | 363 | PASS |
| /terms | mobile | 73 | 100 | 100 | 100 | 1059 | 5718 | 261 | 0.055 | 1059 | FAIL |
| /terms | desktop | 98 | 100 | 100 | 100 | 289 | 1159 | 0 | 0.017 | 322 | PASS |
| /en/terms | mobile | 76 | 96 | 100 | 100 | 1211 | 5722 | 208 | 0 | 1211 | FAIL |
| /en/terms | desktop | 97 | 96 | 100 | 100 | 329 | 1218 | 2 | 0.001 | 361 | PASS |
| /failed | mobile | 69 | 88 | 100 | 100 | 964 | 6483 | 327 | 0 | 2895 | FAIL |
| /failed | desktop | 90 | 96 | 100 | 100 | 268 | 2045 | 24 | 0.003 | 848 | PASS |
| /en/failed | mobile | 68 | 88 | 100 | 100 | 1112 | 7302 | 333 | 0 | 3045 | FAIL |
| /en/failed | desktop | 94 | 96 | 100 | 100 | 300 | 1658 | 40 | 0 | 945 | PASS |
