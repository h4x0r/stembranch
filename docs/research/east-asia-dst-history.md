# East Asian DST History - Comprehensive Research

Sources: IANA tz database (asia file), timeanddate.com, Wikipedia, ChineseFortuneCalendar.com

---

## 1. Taiwan (中華民國) - Asia/Taipei

### Timezone History
| Period | Offset | Name |
|--------|--------|------|
| 1896-01-01 to 1937-09-30 | UTC+8 | Western Standard Time (西部標準時) |
| 1937-10-01 to 1945-09-21 | UTC+9 | Central Standard Time / JST (中央標準時) |
| 1945-09-21 onward | UTC+8 | Chungyuan Standard Time (中原標準時間), later National Standard Time (國家標準時間) |

### IANA tz Rules (Rule Taiwan)
All transitions at 00:00 local time. DST = UTC+9 (CDT), Standard = UTC+8 (CST).

| Year | DST Start | DST End | Notes |
|------|-----------|---------|-------|
| 1946 | May 15 | Oct 1 | First post-war DST |
| 1947 | Apr 15 | Nov 1 | |
| 1948 | May 1 | Oct 1 | |
| 1949 | May 1 | Oct 1 | |
| 1950 | May 1 | Oct 1 | |
| 1951 | May 1 | Oct 1 | |
| 1952 | Mar 1 | Nov 1 | Earlier start, later end |
| 1953 | Apr 1 | Nov 1 | |
| 1954 | Apr 1 | Nov 1 | |
| 1955 | Apr 1 | Oct 1 | |
| 1956 | Apr 1 | Oct 1 | |
| 1957 | Apr 1 | Oct 1 | |
| 1958 | Apr 1 | Oct 1 | |
| 1959 | Apr 1 | Oct 1 | |
| 1960 | Jun 1 | Oct 1 | Later start |
| 1961 | Jun 1 | Oct 1 | Last regular DST year |
| 1962-1973 | -- | -- | NO DST |
| 1974 | Apr 1 | Oct 1 | Energy crisis revival |
| 1975 | Apr 1 | Oct 1 | |
| 1976-1978 | -- | -- | NO DST |
| 1979 | Jul 1 | Oct 1 | Final DST year, late start |

### IANA Zone Definition
```
Zone Asia/Taipei  8:06:00 -    LMT    1896 Jan  1
                  8:00    -    CST    1937 Oct  1
                  9:00    -    JST    1945 Sep 21  1:00
                  8:00    Taiwan C%sT
```

### IANA Rule Definition
```
Rule  Taiwan  1946  only  -  May  15     0:00  1:00  D
Rule  Taiwan  1946  only  -  Oct   1     0:00  0     S
Rule  Taiwan  1947  only  -  Apr  15     0:00  1:00  D
Rule  Taiwan  1947  only  -  Nov   1     0:00  0     S
Rule  Taiwan  1948  1951  -  May   1     0:00  1:00  D
Rule  Taiwan  1948  1951  -  Oct   1     0:00  0     S
Rule  Taiwan  1952  only  -  Mar   1     0:00  1:00  D
Rule  Taiwan  1952  1954  -  Nov   1     0:00  0     S
Rule  Taiwan  1953  1959  -  Apr   1     0:00  1:00  D
Rule  Taiwan  1955  1961  -  Oct   1     0:00  0     S
Rule  Taiwan  1960  1961  -  Jun   1     0:00  1:00  D
Rule  Taiwan  1974  1975  -  Apr   1     0:00  1:00  D
Rule  Taiwan  1974  1975  -  Oct   1     0:00  0     S
Rule  Taiwan  1979  only  -  Jul   1     0:00  1:00  D
Rule  Taiwan  1979  only  -  Oct   1     0:00  0     S
```

---

## 2. Hong Kong - Asia/Hong_Kong

### Timezone History
| Period | Offset | Name |
|--------|--------|------|
| Before 1904-10-29 | UTC+7:36:42 | LMT |
| 1904-10-29 to 1941-06-15 | UTC+8 | HKT (no DST) |
| 1941-06-15 to 1941-10-01 | UTC+9 | HKST (summer time) |
| 1941-10-01 to 1941-12-25 | UTC+8:30 | HKWT (winter time, half-hour) |
| 1941-12-25 to 1945-11-18 | UTC+9 | JST (Japanese occupation) |
| 1945-11-18 onward | UTC+8 | HKT (with DST until 1979) |

### DST Dates (UTC+8 -> UTC+9, HKST)
Transition times: Start usually at 03:30 local, End usually at 03:30 or 04:30 local.

| Year | DST Start | DST End | Start Time | End Time |
|------|-----------|---------|------------|----------|
| 1941 | Jun 15 | Oct 1 | 03:00 | 04:00 (-> HKWT +8:30) |
| 1946 | Apr 21 | Dec 1 | 00:00 | 03:30s |
| 1947 | Apr 13 | Nov 30 | 03:30s | 03:30s |
| 1948 | May 2 | Oct 31 (Sun>=28) | 03:30s | 03:30s |
| 1949 | Apr 3 (Sun>=1) | Oct 30 (Sun>=28) | 03:30 | 03:30s |
| 1950 | Apr 2 (Sun>=1) | Oct 29 (Sun>=28) | 03:30 | 03:30s |
| 1951 | Apr 1 (Sun>=1) | Oct 28 (Sun>=28) | 03:30 | 03:30s |
| 1952 | Apr 6 (Sun>=1) | Oct 25 (Sun>=28) | 03:30 | 03:30s |
| 1953 | Apr 5 (Sun>=1) | Nov 1 (Sun>=31) | 03:30 | 03:30 |
| 1954 | Mar 21 (Sun>=18) | Oct 31 (Sun>=31) | 03:30 | 03:30 |
| 1955 | Mar 20 (Sun>=18) | Nov 6 (Sun>=31) | 03:30 | 03:30 |
| 1956 | Mar 18 (Sun>=18) | Nov 4 (Sun>=31) | 03:30 | 03:30 |
| 1957 | Mar 24 (Sun>=18) | Nov 3 (Sun>=31) | 03:30 | 03:30 |
| 1958 | Mar 23 (Sun>=18) | Nov 2 (Sun>=31) | 03:30 | 03:30 |
| 1959 | Mar 22 (Sun>=18) | Nov 1 (Sun>=31) | 03:30 | 03:30 |
| 1960 | Mar 20 (Sun>=18) | Nov 6 (Sun>=31) | 03:30 | 03:30 |
| 1961 | Mar 19 (Sun>=18) | Nov 5 (Sun>=31) | 03:30 | 03:30 |
| 1962 | Mar 18 (Sun>=18) | Nov 4 (Sun>=31) | 03:30 | 03:30 |
| 1963 | Mar 24 (Sun>=18) | Nov 3 (Sun>=31) | 03:30 | 03:30 |
| 1964 | Mar 22 (Sun>=18) | Nov 1 (Sun>=31) | 03:30 | 03:30 |
| 1965 | Apr 18 (Sun>=16) | Oct 17 (Sun>=16) | 03:30 | 03:30 |
| 1966 | Apr 17 (Sun>=16) | Oct 16 (Sun>=16) | 03:30 | 03:30 |
| 1967 | Apr 16 (Sun>=16) | Oct 22 (Sun>=16) | 03:30 | 03:30 |
| 1968 | Apr 21 (Sun>=16) | Oct 20 (Sun>=16) | 03:30 | 03:30 |
| 1969 | Apr 20 (Sun>=16) | Oct 19 (Sun>=16) | 03:30 | 03:30 |
| 1970 | Apr 19 (Sun>=16) | Oct 18 (Sun>=16) | 03:30 | 03:30 |
| 1971 | Apr 18 (Sun>=16) | Oct 17 (Sun>=16) | 03:30 | 03:30 |
| 1972 | Apr 16 (Sun>=16) | Oct 22 (Sun>=16) | 03:30 | 03:30 |
| 1973 | Apr 22 (Sun>=16) | Oct 21 (Sun>=16) | 03:30 | 03:30 |
| 1973* | Dec 30 | -- | 03:30 | (energy crisis, extended into 1974) |
| 1974 | (continued from Dec 30 1973) | Oct 20 (Sun>=16) | -- | 03:30 |
| 1975 | Apr 20 (Sun>=16) | Oct 19 (Sun>=16) | 03:30 | 03:30 |
| 1976 | Apr 18 (Sun>=16) | Oct 17 (Sun>=16) | 03:30 | 03:30 |
| 1977 | -- | -- | NO DST | |
| 1978 | -- | -- | NO DST | |
| 1979 | May 13 | Oct 21 | 03:30 | 03:30 |

Note: 1977-1978 had NO DST. 1979 was the final year. DST was formally repealed after 1979.

### IANA Zone Definition
```
Zone Asia/Hong_Kong  7:36:42 -    LMT   1904 Oct 29 17:00u
                     8:00    -    HKT   1941 Jun 15  3:00
                     8:00    1:00 HKST  1941 Oct  1  4:00
                     8:00    0:30 HKWT  1941 Dec 25
                     9:00    -    JST   1945 Nov 18  2:00
                     8:00    HK   HK%sT
```

### IANA Rule Definition
```
Rule  HK  1946  only  -  Apr  21       0:00    1:00  S
Rule  HK  1946  only  -  Dec   1       3:30s   0     -
Rule  HK  1947  only  -  Apr  13       3:30s   1:00  S
Rule  HK  1947  only  -  Nov  30       3:30s   0     -
Rule  HK  1948  only  -  May   2       3:30s   1:00  S
Rule  HK  1948  1952  -  Oct  Sun>=28  3:30s   0     -
Rule  HK  1949  1953  -  Apr  Sun>=1   3:30    1:00  S
Rule  HK  1953  1964  -  Oct  Sun>=31  3:30    0     -
Rule  HK  1954  1964  -  Mar  Sun>=18  3:30    1:00  S
Rule  HK  1965  1976  -  Apr  Sun>=16  3:30    1:00  S
Rule  HK  1965  1976  -  Oct  Sun>=16  3:30    0     -
Rule  HK  1973  only  -  Dec  30       3:30    1:00  S
Rule  HK  1979  only  -  May  13       3:30    1:00  S
Rule  HK  1979  only  -  Oct  21       3:30    0     -
```

---

## 3. Macau - Asia/Macau

### Timezone History
| Period | Offset | Name |
|--------|--------|------|
| Before 1904-10-30 | UTC+7:34:10 | LMT |
| 1904-10-30 to 1941-12-21 | UTC+8 | CST |
| 1941-12-21 23:00 to 1945-09-30 | UTC+9 | +09 (Japanese occupation era, with DST rules) |
| 1945-10-01 onward | UTC+8 | CST (with DST until 1979) |

### DST Rules (from IANA)
During Japanese occupation (1942-1943), DST was on top of UTC+9. After 1945, DST was UTC+8 -> UTC+9.

| Year | DST Start | DST End | Notes |
|------|-----------|---------|-------|
| 1942 | Apr 30, 23:00 | Nov 17, 23:00 | On top of UTC+9 base -> UTC+10 |
| 1943 | Apr 30, 23:00 | Sep 30, 23:00 | On top of UTC+9 base -> UTC+10 |
| 1946 | Apr 30, 23:00s | Sep 30, 23:00s | Post-war, UTC+8 -> +9 |
| 1947 | Apr 19, 23:00s | Nov 30, 23:00s | |
| 1948 | May 2, 23:00s | Oct 31, 23:00s | |
| 1949 | Apr Sat>=1, 23:00s | Oct lastSat, 23:00s | Apr 2 / Oct 29 |
| 1950 | Apr Sat>=1, 23:00s | Oct lastSat, 23:00s | Apr 1 / Oct 28 |
| 1951 | Mar 31, 23:00s | Oct 28, 23:00s | |
| 1952 | Apr Sat>=1, 23:00s | Nov 1, 23:00s | Apr 5 |
| 1953 | Apr Sat>=1, 23:00s | Oct lastSat, 23:00s | Apr 4 / Oct 31 |
| 1954 | Mar Sat>=17, 23:00s | Oct lastSat, 23:00s | Mar 20 / Oct 30 |
| 1955 | Mar Sat>=17, 23:00s | Nov 5, 23:00s | Mar 19 |
| 1956 | Mar Sat>=17, 23:00s | Nov Sun>=1, 03:30 | Mar 17 / Nov 4 |
| 1957 | Mar Sun>=18, 03:30 | Nov Sun>=1, 03:30 | Mar 24 / Nov 3 |
| 1958 | Mar Sun>=18, 03:30 | Nov Sun>=1, 03:30 | Mar 23 / Nov 2 |
| 1959 | Mar Sun>=18, 03:30 | Nov Sun>=1, 03:30 | Mar 22 / Nov 1 |
| 1960 | Mar Sun>=18, 03:30 | Nov Sun>=1, 03:30 | Mar 20 / Nov 6 |
| 1961 | Mar Sun>=18, 03:30 | Nov Sun>=1, 03:30 | Mar 19 / Nov 5 |
| 1962 | Mar Sun>=18, 03:30 | Nov Sun>=1, 03:30 | Mar 18 / Nov 4 |
| 1963 | Mar Sun>=18, 03:30 | Nov Sun>=1, 03:30 | Mar 24 / Nov 3 |
| 1964 | Mar Sun>=18, 03:30 | Nov Sun>=1, 03:30 | Mar 22 / Nov 1 |
| 1965 | Apr Sun>=16, 03:30 | Oct Sun>=16, 02:30 | Apr 18 / Oct 17 |
| 1966 | Apr Sun>=16, 03:30 | Oct Sun>=16, 02:30 | Apr 17 / Oct 16 |
| 1967 | Apr Sun>=16, 03:30 | Oct Sun>=16, 03:30 | Apr 16 / Oct 22 |
| 1968 | Apr Sun>=16, 03:30 | Oct Sun>=16, 03:30 | Apr 21 / Oct 20 |
| 1969 | Apr Sun>=16, 03:30 | Oct Sun>=16, 03:30 | Apr 20 / Oct 19 |
| 1970 | Apr Sun>=16, 03:30 | Oct Sun>=16, 03:30 | Apr 19 / Oct 18 |
| 1971 | Apr Sun>=16, 03:30 | Oct Sun>=16, 03:30 | Apr 18 / Oct 17 |
| 1972 | Apr Sun>=16, 03:30 | Oct Sun>=16, 03:30 | Apr 16 / Oct 22 |
| 1973 | Apr Sun>=16, 03:30 | Oct Sun>=16, 03:30 | Apr 22 / Oct 21 |
| 1973* | Dec 30, 03:30 | -- | Energy crisis extension |
| 1974 | (continued) | Oct Sun>=16, 03:30 | Oct 20 |
| 1975 | Apr Sun>=16, 03:30 | Oct Sun>=16, 03:30 | Apr 20 / Oct 19 |
| 1976 | Apr Sun>=16, 03:30 | Oct Sun>=16, 03:30 | Apr 18 / Oct 17 |
| 1977-1978 | -- | -- | NO DST |
| 1979 | May 13, 03:30 | Oct Sun>=16, 03:30 | Oct 21. Final year. |

### IANA Zone Definition
```
Zone Asia/Macau  7:34:10 -     LMT  1904 Oct 30
                 8:00    -     CST  1941 Dec 21 23:00
                 9:00    Macau %z   1945 Sep 30 24:00
                 8:00    Macau C%sT
```

### IANA Rule Definition
```
Rule  Macau  1942  1943  -  Apr  30        23:00   1:00  -
Rule  Macau  1942  only  -  Nov  17        23:00   0     -
Rule  Macau  1943  only  -  Sep  30        23:00   0     S
Rule  Macau  1946  only  -  Apr  30        23:00s  1:00  D
Rule  Macau  1946  only  -  Sep  30        23:00s  0     S
Rule  Macau  1947  only  -  Apr  19        23:00s  1:00  D
Rule  Macau  1947  only  -  Nov  30        23:00s  0     S
Rule  Macau  1948  only  -  May   2        23:00s  1:00  D
Rule  Macau  1948  only  -  Oct  31        23:00s  0     S
Rule  Macau  1949  1950  -  Apr  Sat>=1    23:00s  1:00  D
Rule  Macau  1949  1950  -  Oct  lastSat   23:00s  0     S
Rule  Macau  1951  only  -  Mar  31        23:00s  1:00  D
Rule  Macau  1951  only  -  Oct  28        23:00s  0     S
Rule  Macau  1952  1953  -  Apr  Sat>=1    23:00s  1:00  D
Rule  Macau  1952  only  -  Nov   1        23:00s  0     S
Rule  Macau  1953  1954  -  Oct  lastSat   23:00s  0     S
Rule  Macau  1954  1956  -  Mar  Sat>=17   23:00s  1:00  D
Rule  Macau  1955  only  -  Nov   5        23:00s  0     S
Rule  Macau  1956  1964  -  Nov  Sun>=1    03:30   0     S
Rule  Macau  1957  1964  -  Mar  Sun>=18   03:30   1:00  D
Rule  Macau  1965  1973  -  Apr  Sun>=16   03:30   1:00  D
Rule  Macau  1965  1966  -  Oct  Sun>=16   02:30   0     S
Rule  Macau  1967  1976  -  Oct  Sun>=16   03:30   0     S
Rule  Macau  1973  only  -  Dec  30        03:30   1:00  D
Rule  Macau  1975  1976  -  Apr  Sun>=16   03:30   1:00  D
Rule  Macau  1979  only  -  May  13        03:30   1:00  D
Rule  Macau  1979  only  -  Oct  Sun>=16   03:30   0     S
```

Note: Macau's DST rules closely mirrored Hong Kong's from 1965 onward (same rule patterns).
From 1946-1964, Macau used slightly different transition times (23:00s instead of 03:30).

---

## 4. Japan - Asia/Tokyo

### Timezone History
| Period | Offset | Name |
|--------|--------|------|
| Before 1887-12-31 | UTC+9:18:59 | LMT |
| 1888-01-01 onward | UTC+9 | JST (Japan Standard Time) |

Note: Japan also had "Western Standard Time" (UTC+8) for Taiwan/Okinawa 1896-1937, but Tokyo was always UTC+9.

### DST During US Occupation (1948-1951)
DST = UTC+10 (JDT). Imposed by US occupation authorities.
Start: 24:00 on first Saturday in May (i.e., midnight starting Sunday)
End: 25:00 on Saturday >= 8th of September (i.e., 01:00 Sunday)

| Year | DST Start | DST End |
|------|-----------|---------|
| 1948 | May 1, 24:00 (= May 2, 00:00) | Sep 11, 25:00 (= Sep 12, 01:00) |
| 1949 | Apr 2, 24:00 (= Apr 3, 00:00) | Sep 10, 25:00 (= Sep 11, 01:00) |
| 1950 | May 6, 24:00 (= May 7, 00:00) | Sep 9, 25:00 (= Sep 10, 01:00) |
| 1951 | May 5, 24:00 (= May 6, 00:00) | Sep 8, 25:00 (= Sep 9, 01:00) |

DST was deeply unpopular. A 1951 government poll showed 53% wanted to scrap it vs 30% who wanted to keep it. The Diet passed a bill to abolish it in October 1951, shortly after the San Francisco Peace Treaty was signed.

### IANA Zone Definition
```
Zone Asia/Tokyo  9:18:59 -     LMT   1887 Dec 31 15:00u
                 9:00    Japan J%sT
```

### IANA Rule Definition
```
Rule  Japan  1948  only  -  May  Sat>=1   24:00  1:00  D
Rule  Japan  1948  1951  -  Sep  Sat>=8   25:00  0     S
Rule  Japan  1949  only  -  Apr  Sat>=1   24:00  1:00  D
Rule  Japan  1950  1951  -  May  Sat>=1   24:00  1:00  D
```

---

## 5. South Korea - Asia/Seoul

### Timezone History
| Period | Offset | Name |
|--------|--------|------|
| Before 1908-04-01 | UTC+8:27:52 | LMT |
| 1908-04-01 to 1912-01-01 | UTC+8:30 | KST (Korean Empire standard) |
| 1912-01-01 to 1945-09-08 | UTC+9 | JST (Japanese occupation) |
| 1945-09-08 to 1954-03-21 | UTC+9 | KST (with DST via ROK rules) |
| 1954-03-21 to 1961-08-10 | UTC+8:30 | KST (Syngman Rhee reverted) |
| 1961-08-10 onward | UTC+9 | KST (Park Chung-hee changed back) |

### DST Periods
When base was UTC+9 (1948-1951): DST = UTC+10 (KDT)
When base was UTC+8:30 (1955-1960): DST = UTC+9:30 (KDT)
When base was UTC+9 (1987-1988): DST = UTC+10 (KDT)

| Year | DST Start | DST End | Base | DST Offset |
|------|-----------|---------|------|------------|
| 1948 | Jun 1, 00:00 | Sep 12, 24:00 | +9 | +10 |
| 1949 | Apr 3, 00:00 | Sep Sat>=7, 24:00 (Sep 10) | +9 | +10 |
| 1950 | Apr 1, 00:00 | Sep Sat>=7, 24:00 (Sep 9) | +9 | +10 |
| 1951 | May 6, 00:00 | Sep Sat>=7, 24:00 (Sep 8) | +9 | +10 |
| 1952-1954 | -- | -- | NO DST | |
| 1954 Mar 21 | TZ change to UTC+8:30 | | | |
| 1955 | May 5, 00:00 | Sep 8, 24:00 | +8:30 | +9:30 |
| 1956 | May 20, 00:00 | Sep 29, 24:00 | +8:30 | +9:30 |
| 1957 | May Sun>=1, 00:00 (May 5) | Sep Sat>=17, 24:00 (Sep 21) | +8:30 | +9:30 |
| 1958 | May Sun>=1, 00:00 (May 4) | Sep Sat>=17, 24:00 (Sep 20) | +8:30 | +9:30 |
| 1959 | May Sun>=1, 00:00 (May 3) | Sep Sat>=17, 24:00 (Sep 19) | +8:30 | +9:30 |
| 1960 | May Sun>=1, 00:00 (May 1) | Sep Sat>=17, 24:00 (Sep 17) | +8:30 | +9:30 |
| 1961 Aug 10 | TZ change to UTC+9 | | | |
| 1962-1986 | -- | -- | NO DST | |
| 1987 | May Sun>=8, 02:00 (May 10) | Oct Sun>=8, 03:00 (Oct 11) | +9 | +10 |
| 1988 | May Sun>=8, 02:00 (May 8) | Oct Sun>=8, 03:00 (Oct 9) | +9 | +10 |

Note: The 1987-1988 DST was introduced to accommodate American TV viewers for the 1988 Seoul Olympics.

### IANA Zone Definition
```
Zone Asia/Seoul  8:27:52 -   LMT   1908 Apr  1
                 8:30    -   KST   1912 Jan  1
                 9:00    -   JST   1945 Sep  8
                 9:00    ROK K%sT  1954 Mar 21
                 8:30    ROK K%sT  1961 Aug 10
                 9:00    ROK K%sT
```

### IANA Rule Definition
```
Rule  ROK  1948  only  -  Jun   1       0:00   1:00  D
Rule  ROK  1948  only  -  Sep  12      24:00   0     S
Rule  ROK  1949  only  -  Apr   3       0:00   1:00  D
Rule  ROK  1949  1951  -  Sep  Sat>=7  24:00   0     S
Rule  ROK  1950  only  -  Apr   1       0:00   1:00  D
Rule  ROK  1951  only  -  May   6       0:00   1:00  D
Rule  ROK  1955  only  -  May   5       0:00   1:00  D
Rule  ROK  1955  only  -  Sep   8      24:00   0     S
Rule  ROK  1956  only  -  May  20       0:00   1:00  D
Rule  ROK  1956  only  -  Sep  29      24:00   0     S
Rule  ROK  1957  1960  -  May  Sun>=1   0:00   1:00  D
Rule  ROK  1957  1960  -  Sep  Sat>=17 24:00   0     S
Rule  ROK  1987  1988  -  May  Sun>=8   2:00   1:00  D
Rule  ROK  1987  1988  -  Oct  Sun>=8   3:00   0     S
```

---

## 6. North Korea - Asia/Pyongyang

### Timezone History
| Period | Offset | Name |
|--------|--------|------|
| Before 1908-04-01 | UTC+8:23:00 | LMT |
| 1908-04-01 to 1912-01-01 | UTC+8:30 | KST |
| 1912-01-01 to 1945-08-24 | UTC+9 | JST (Japanese occupation) |
| 1945-08-24 to 2015-08-15 | UTC+9 | KST |
| 2015-08-15 to 2018-05-04 | UTC+8:30 | KST/"Pyongyang Time" |
| 2018-05-05 onward | UTC+9 | KST |

Key events:
- 2015-08-15 00:00: North Korea set clocks back 30 min to UTC+8:30, creating "Pyongyang Time" as a symbolic rejection of Japanese-imposed time. Took effect on the 70th anniversary of liberation from Japan.
- 2018-05-04 23:30 -> 2018-05-05 00:00: Reverted to UTC+9 to align with South Korea, following the 2018 inter-Korean summit between Kim Jong-un and Moon Jae-in.

North Korea has NEVER observed DST.

### IANA Zone Definition
```
Zone Asia/Pyongyang  8:23:00 -  LMT  1908 Apr  1
                     8:30    -  KST  1912 Jan  1
                     9:00    -  JST  1945 Aug 24
                     9:00    -  KST  2015 Aug 15 00:00
                     8:30    -  KST  2018 May  4 23:30
                     9:00    -  KST
```

---

## 7. Mongolia - Asia/Ulaanbaatar, Asia/Hovd

### Timezone History (Ulaanbaatar)
| Period | Offset | Name |
|--------|--------|------|
| Before 1905-08 | UTC+7:07:32 | LMT |
| 1905-08 to 1978 | UTC+7 | +07 |
| 1978 onward | UTC+8 | +08 / ULAT (with DST in certain periods) |

### Timezone History (Hovd / western provinces)
| Period | Offset | Name |
|--------|--------|------|
| Before 1905-08 | UTC+6:06:36 | LMT |
| 1905-08 to 1978 | UTC+6 | +06 |
| 1978 onward | UTC+7 | +07 / HOVT (with DST in certain periods) |

Western provinces using UTC+7: Bayan-Olgii, Khovd (Hovd), Uvs

### DST Periods
DST adds 1 hour: Ulaanbaatar UTC+8->+9, Hovd UTC+7->+8.

**Period 1: 1983-1998**

| Year | DST Start | DST End |
|------|-----------|---------|
| 1983 | Apr 1, 00:00 | Oct 1, 00:00 |
| 1984 | Apr 1, 00:00 | Sep lastSun, 00:00 (Sep 30) |
| 1985 | Mar lastSun, 00:00 (Mar 31) | Sep lastSun, 00:00 (Sep 29) |
| 1986 | Mar lastSun, 00:00 (Mar 30) | Sep lastSun, 00:00 (Sep 28) |
| 1987 | Mar lastSun, 00:00 (Mar 29) | Sep lastSun, 00:00 (Sep 27) |
| 1988 | Mar lastSun, 00:00 (Mar 27) | Sep lastSun, 00:00 (Sep 25) |
| 1989 | Mar lastSun, 00:00 (Mar 26) | Sep lastSun, 00:00 (Sep 24) |
| 1990 | Mar lastSun, 00:00 (Mar 25) | Sep lastSun, 00:00 (Sep 30) |
| 1991 | Mar lastSun, 00:00 (Mar 31) | Sep lastSun, 00:00 (Sep 29) |
| 1992 | Mar lastSun, 00:00 (Mar 29) | Sep lastSun, 00:00 (Sep 27) |
| 1993 | Mar lastSun, 00:00 (Mar 28) | Sep lastSun, 00:00 (Sep 26) |
| 1994 | Mar lastSun, 00:00 (Mar 27) | Sep lastSun, 00:00 (Sep 25) |
| 1995 | Mar lastSun, 00:00 (Mar 26) | Sep lastSun, 00:00 (Sep 24) |
| 1996 | Mar lastSun, 00:00 (Mar 31) | Sep lastSun, 00:00 (Sep 29) |
| 1997 | Mar lastSun, 00:00 (Mar 30) | Sep lastSun, 00:00 (Sep 28) |
| 1998 | Mar lastSun, 00:00 (Mar 29) | Sep lastSun, 00:00 (Sep 27) |

**1999-2000: NO DST**

**Period 2: 2001-2006**

| Year | DST Start | DST End |
|------|-----------|---------|
| 2001 | Apr lastSat, 02:00 (Apr 28) | Sep lastSat, 02:00 (Sep 29) |
| 2002 | Mar lastSat, 02:00 (Mar 30) | Sep lastSat, 02:00 (Sep 28) |
| 2003 | Mar lastSat, 02:00 (Mar 29) | Sep lastSat, 02:00 (Sep 27) |
| 2004 | Mar lastSat, 02:00 (Mar 27) | Sep lastSat, 02:00 (Sep 25) |
| 2005 | Mar lastSat, 02:00 (Mar 26) | Sep lastSat, 02:00 (Sep 24) |
| 2006 | Mar lastSat, 02:00 (Mar 25) | Sep lastSat, 02:00 (Sep 30) |

**2007-2014: NO DST** (Parliament abolished DST in Feb 2007)

**Period 3: 2015-2016**

| Year | DST Start | DST End |
|------|-----------|---------|
| 2015 | Mar lastSat, 02:00 (Mar 28) | Sep lastSat, 00:00 (Sep 26) |
| 2016 | Mar lastSat, 02:00 (Mar 26) | Sep lastSat, 00:00 (Sep 24) |

**2017 onward: NO DST** (Abolished again in early 2017)

### IANA Zone Definitions
```
Zone Asia/Ulaanbaatar  7:07:32 -  LMT    1905 Aug
                       7:00    -  %z     1978
                       8:00    Mongol %z

Zone Asia/Hovd  6:06:36 -  LMT    1905 Aug
                6:00    -  %z     1978
                7:00    Mongol %z
```

### IANA Rule Definition (all Mongol rules combined)
```
Rule  Mongol  1983  1984  -  Apr  1        0:00  1:00  -
Rule  Mongol  1983  only  -  Oct  1        0:00  0     -
Rule  Mongol  1984  1998  -  Sep  lastSun  0:00  0     -
Rule  Mongol  1985  1998  -  Mar  lastSun  0:00  1:00  -
Rule  Mongol  2001  only  -  Apr  lastSat  2:00  1:00  -
Rule  Mongol  2001  2006  -  Sep  lastSat  2:00  0     -
Rule  Mongol  2002  2006  -  Mar  lastSat  2:00  1:00  -
Rule  Mongol  2015  2016  -  Mar  lastSat  2:00  1:00  -
Rule  Mongol  2015  2016  -  Sep  lastSat  0:00  0     -
```

---

## Summary: Key Differences Between Regions

### Who Had DST and When
| Region | DST Periods | Total Years |
|--------|-------------|-------------|
| Taiwan | 1946-1961, 1974-1975, 1979 | 19 years |
| Hong Kong | 1941, 1946-1976, 1979 | 33 years |
| Macau | 1942-1943, 1946-1976, 1979 | 34 years |
| Japan | 1948-1951 | 4 years |
| South Korea | 1948-1951, 1955-1960, 1987-1988 | 12 years |
| North Korea | Never | 0 years |
| Mongolia | 1983-1998, 2001-2006, 2015-2016 | 27 years |

### Japanese Occupation Timezone Changes
| Region | JST Period | Reversion Date |
|--------|-----------|----------------|
| Taiwan | 1937-10-01 to 1945-09-21 | Sep 21, 1945 (back to UTC+8) |
| Hong Kong | 1941-12-25 to 1945-11-18 | Nov 18, 1945 (back to UTC+8) |
| Macau | 1941-12-21 to 1945-09-30 | Sep 30, 1945 (back to UTC+8) |
| Korea | 1912-01-01 to 1945 | Aug 24 (N) / Sep 8 (S), 1945 |

### Energy Crisis Special DST (1973-1974)
Both Hong Kong and Macau extended DST through the winter of 1973-1974 due to the oil crisis:
- HK: Dec 30, 1973 -> Oct 20, 1974 (continuous summer time through winter)
- Macau: Dec 30, 1973 -> Oct 20, 1974 (same pattern)
- Taiwan: Reinstated DST in 1974-1975 after 12-year gap

### North Korea's Unique Timezone Changes
- 2015-08-15: UTC+9 -> UTC+8:30 (symbolic break from Japanese-imposed time)
- 2018-05-05: UTC+8:30 -> UTC+9 (reunification gesture after inter-Korean summit)
