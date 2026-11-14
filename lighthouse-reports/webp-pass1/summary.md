# Lighthouse webp-pass1

- Base: `http://localhost:3000`
- Runs per route/device: 1 (median)
- Generated: 2026-11-14T12:20:50.265Z

| Route | Device | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | SI | Status |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| / | mobile | 63 | 88 | 77 | 100 | 1207 | 3855 | 752 | 0 | 7170 | FAIL |
| / | desktop | 91 | 96 | 77 | 100 | 328 | 926 | 21 | 0.003 | 3474 | FAIL |
| /en | mobile | 64 | 88 | 77 | 100 | 1208 | 3626 | 729 | 0 | 9017 | FAIL |
| /en | desktop | 91 | 96 | 77 | 100 | 324 | 877 | 28 | 0 | 3612 | FAIL |
| /about | mobile | 58 | 93 | 100 | 100 | 1267 | 5158 | 968 | 0 | 3419 | FAIL |
| /about | desktop | 98 | 93 | 100 | 100 | 330 | 932 | 106 | 0.005 | 961 | PASS |
| /en/about | mobile | 56 | 93 | 100 | 100 | 1250 | 5414 | 690 | 0 | 6878 | FAIL |
| /en/about | desktop | 99 | 93 | 100 | 100 | 418 | 920 | 66 | 0.001 | 880 | PASS |
| /booking | mobile | 64 | 93 | 77 | 100 | 1982 | 5530 | 418 | 0 | 4962 | FAIL |
| /booking | desktop | 72 | 93 | 77 | 100 | 502 | 1028 | 48 | 1.671 | 1587 | FAIL |
| /en/booking | mobile | 49 | 93 | 54 | 100 | 1524 | 5314 | 966 | 0 | 10153 | FAIL |
| /en/booking | desktop | 73 | 93 | 77 | 100 | 367 | 990 | 28 | 1.667 | 1374 | FAIL |
| /contact | mobile | 84 | 100 | 96 | 100 | 1059 | 4003 | 195 | 0.006 | 1225 | FAIL |
| /contact | desktop | 99 | 100 | 100 | 100 | 287 | 867 | 0 | 0.004 | 477 | PASS |
| /blog | mobile | 61 | 91 | 77 | 100 | 927 | 4415 | 795 | 0 | 5854 | FAIL |
| /blog | desktop | 96 | 95 | 100 | 100 | 249 | 968 | 0 | 0.003 | 1851 | PASS |
| /categories | mobile | 87 | 95 | 100 | 100 | 1244 | 3989 | 27 | 0.001 | 1244 | FAIL |
| /categories | desktop | 99 | 95 | 100 | 100 | 251 | 829 | 0 | 0.004 | 371 | PASS |
| /offers | mobile | 85 | 96 | 100 | 100 | 1015 | 4007 | 159 | 0.001 | 1201 | FAIL |
| /offers | desktop | 99 | 97 | 100 | 100 | 274 | 856 | 0 | 0.041 | 410 | PASS |
