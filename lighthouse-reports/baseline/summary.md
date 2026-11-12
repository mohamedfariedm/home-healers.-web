# Lighthouse baseline

- Base URL: `http://localhost:3001`
- Runs per route/device: 1 (median reported)
- Generated: 2026-11-12T12:12:31.553Z

| Route | Device | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | SI | Status |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| / | mobile | 80 | 88 | 100 | 100 | 1205 | 4655 | 184 | 0 | 2398 | FAIL |
| / | desktop | 99 | 96 | 100 | 100 | 328 | 878 | 6 | 0.003 | 865 | PASS |
| /en | mobile | 83 | 88 | 100 | 100 | 1204 | 4129 | 193 | 0 | 2231 | FAIL |
| /en | desktop | 99 | 96 | 100 | 100 | 329 | 869 | 6 | 0 | 700 | PASS |
| /about | mobile | 37 | 93 | 73 | 100 | 1360 | 96983 | 4478 | 0 | 7644 | FAIL |
| /about | desktop | 62 | 93 | 73 | 100 | 331 | 3627 | 277 | 0.003 | 3200 | FAIL |
| /en/about | mobile | 39 | 93 | 73 | 100 | 1361 | 8084 | 2461 | 0 | 7685 | FAIL |
| /en/about | desktop | 65 | 93 | 73 | 100 | 370 | 3745 | 233 | 0 | 2776 | FAIL |
| /contact | mobile | 72 | 100 | 96 | 92 | 1065 | 5731 | 280 | 0.083 | 1771 | FAIL |
| /contact | desktop | 97 | 100 | 100 | 92 | 289 | 1258 | 0 | 0.003 | 676 | PASS |
| /en/contact | mobile | 74 | 96 | 96 | 100 | 1207 | 6539 | 198 | 0 | 1802 | FAIL |
| /en/contact | desktop | 97 | 96 | 100 | 92 | 328 | 1316 | 0 | 0 | 658 | PASS |
| /blog | mobile | 61 | 91 | 77 | 100 | 1210 | 5689 | 685 | 0 | 2715 | FAIL |
| /blog | desktop | 97 | 95 | 77 | 100 | 327 | 1250 | 40 | 0.003 | 940 | FAIL |
| /en/blog | mobile | 78 | 91 | 77 | 100 | 1209 | 5796 | 92 | 0 | 2406 | FAIL |
| /en/blog | desktop | 97 | 95 | 77 | 100 | 329 | 1241 | 0 | 0 | 755 | FAIL |
| /categories | mobile | 59 | 95 | 100 | 100 | 1055 | 5859 | 784 | 0 | 2326 | FAIL |
| /categories | desktop | 93 | 95 | 100 | 100 | 284 | 1148 | 179 | 0.004 | 910 | PASS |
| /en/categories | mobile | 56 | 95 | 100 | 100 | 1205 | 5935 | 1031 | 0 | 1766 | FAIL |
| /en/categories | desktop | 95 | 95 | 100 | 100 | 325 | 1230 | 121 | 0 | 893 | PASS |
| /offers | mobile | 69 | 96 | 100 | 100 | 943 | 7130 | 312 | 0 | 2494 | FAIL |
| /offers | desktop | 96 | 97 | 100 | 100 | 311 | 1456 | 0 | 0.031 | 650 | PASS |
| /en/offers | mobile | 70 | 96 | 100 | 100 | 944 | 7436 | 282 | 0 | 2112 | FAIL |
| /en/offers | desktop | 96 | 97 | 100 | 100 | 304 | 1414 | 0 | 0 | 841 | PASS |
| /booking | mobile | 40 | 93 | 58 | 100 | 2410 | 10152 | 1792 | 0 | 6032 | FAIL |
| /booking | desktop | 69 | 93 | 58 | 100 | 527 | 2173 | 344 | 0.003 | 2406 | FAIL |
| /en/booking | mobile | 40 | 93 | 58 | 100 | 1814 | 12435 | 2029 | 0 | 6613 | FAIL |
| /en/booking | desktop | 31 | 93 | 58 | 100 | 409 | 2470 | 527 | 1.632 | 3671 | FAIL |
| /doctors-apply | mobile | 82 | 92 | 96 | 100 | 854 | 4538 | 158 | 0 | 1111 | FAIL |
| /doctors-apply | desktop | 99 | 88 | 96 | 92 | 206 | 844 | 0 | 0.003 | 420 | FAIL |
| /en/doctors-apply | mobile | 76 | 88 | 96 | 100 | 906 | 4729 | 314 | 0 | 1248 | FAIL |
| /en/doctors-apply | desktop | 98 | 88 | 96 | 100 | 257 | 1082 | 0 | 0 | 592 | FAIL |
| /privacy | mobile | 76 | 100 | 100 | 100 | 1056 | 5712 | 149 | 0.083 | 1445 | FAIL |
| /privacy | desktop | 100 | 100 | 100 | 92 | 289 | 785 | 0 | 0.003 | 457 | PASS |
| /en/privacy | mobile | 86 | 96 | 100 | 100 | 1208 | 4074 | 106 | 0 | 1208 | FAIL |
| /en/privacy | desktop | 99 | 96 | 100 | 92 | 327 | 907 | 0 | 0 | 398 | PASS |
| /terms | mobile | 79 | 100 | 100 | 92 | 1059 | 3788 | 366 | 0.083 | 1126 | FAIL |
| /terms | desktop | 100 | 100 | 100 | 92 | 288 | 792 | 0 | 0.003 | 412 | PASS |
| /en/terms | mobile | 77 | 96 | 100 | 92 | 1206 | 5412 | 194 | 0 | 1206 | FAIL |
| /en/terms | desktop | 99 | 96 | 100 | 100 | 325 | 942 | 0 | 0 | 457 | PASS |
| /failed | mobile | 76 | 88 | 77 | 100 | 802 | 5597 | 192 | 0 | 2939 | FAIL |
| /failed | desktop | 97 | 96 | 100 | 100 | 222 | 1293 | 18 | 0.003 | 878 | PASS |
| /en/failed | mobile | 76 | 88 | 100 | 100 | 948 | 5811 | 183 | 0 | 2799 | FAIL |
| /en/failed | desktop | 97 | 96 | 77 | 100 | 258 | 1168 | 3 | 0 | 1120 | FAIL |
| /home | mobile | null | null | null | null | null | null | null | null | null | FAIL |
| /home | desktop | null | null | null | null | null | null | null | null | null | FAIL |
| /en/home | mobile | null | null | null | null | null | null | null | null | null | FAIL |
| /en/home | desktop | null | null | null | null | null | null | null | null | null | FAIL |
