# Divination Systems Design

Five new modules for stembranch: 建除十二神, 紫白九星, 神煞, 大六壬, 奇門遁甲.

## 1. 建除十二神 (Twelve Day Officers) — `jianchu.ts`

The 12-day officer cycle used in Chinese almanacs (通書/黃曆) for daily auspiciousness.

**Cycle:** 建, 除, 滿, 平, 定, 執, 破, 危, 成, 收, 開, 閉

**Rule:** The day whose branch matches the month branch is 建日. Officers cycle forward from there.

- In 寅月: 寅日=建, 卯日=除, 辰日=滿, ...
- In 卯月: 卯日=建, 辰日=除, 巳日=滿, ...

**Month determination:** Uses solar month (節氣 boundaries), same as month pillar.

**API:**
```typescript
type JianChuOfficer = '建' | '除' | '滿' | '平' | '定' | '執' | '破' | '危' | '成' | '收' | '開' | '閉';

const JIANCHU_OFFICERS: readonly JianChuOfficer[];
const JIANCHU_AUSPICIOUS: Record<JianChuOfficer, boolean>; // 建除滿 etc.

function getJianChuOfficer(dayBranch: Branch, monthBranch: Branch): JianChuOfficer;
function getJianChuForDate(date: Date): { officer: JianChuOfficer; auspicious: boolean };
```

**Dependencies:** `branches.ts`, `solar-terms.ts` (getSolarMonthExact)

---

## 2. 紫白九星 (Purple-White Nine Stars) — `zi-bai.ts`

Flying star system based on Lo Shu magic square. Computes the ruling star for year, month, day, and hour.

**Nine Stars:** 一白水, 二黑土, 三碧木, 四綠木, 五黃土, 六白金, 七赤金, 八白土, 九紫火

**Year star:**
- Based on 三元九運 (180-year grand cycle = 3 × 60-year 元):
  - 上元 (1864-1923): starts at 一白, descends
  - 中元 (1924-1983): starts at 四綠, descends
  - 下元 (1984-2043): starts at 七赤, descends
- Formula: `star = ((year - 1864) % 9)` → mapped descending from cycle start
- Simpler: `star = (11 - (year - 1864) % 9) % 9 || 9`
- Year changes at 立春, not Jan 1

**Month star:**
- Depends on year star group:
  - Years with star 1/4/7: month 寅 = 八白, descends
  - Years with star 2/5/8: month 寅 = 五黃, descends
  - Years with star 3/6/9: month 寅 = 二黑, descends
- Month changes at 節 (same as month pillar boundaries)

**Day star:**
- Based on 甲子日 anchor. Three cycles of 180 days:
  - 上元 甲子日 = 一白 (ascending through Lo Shu)
  - 中元 甲子日 = 七赤
  - 下元 甲子日 = 四綠
- Need to determine which 元 a given day falls in (based on 冬至/夏至 or fixed anchors)
- Standard approach: use known anchor dates and count forward

**Hour star:**
- Based on day star group (same 3-group pattern as month):
  - Days with star 1/4/7: 子時 = 一白
  - Days with star 2/5/8: 子時 = 四綠
  - Days with star 3/6/9: 子時 = 七赤

**API:**
```typescript
type ZiBaiStar = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface ZiBaiStarInfo {
  number: ZiBaiStar;
  name: string;      // '一白' through '九紫'
  element: Element;
  color: string;     // '白' | '黑' | '碧' | '綠' | '黃' | '赤' | '紫'
}

const ZI_BAI_STARS: readonly ZiBaiStarInfo[];

function getYearStar(date: Date): ZiBaiStar;
function getMonthStar(date: Date): ZiBaiStar;
function getDayStar(date: Date): ZiBaiStar;
function getHourStar(date: Date): ZiBaiStar;
function getZiBai(date: Date): { year: ZiBaiStar; month: ZiBaiStar; day: ZiBaiStar; hour: ZiBaiStar };
```

**Dependencies:** `solar-terms.ts`, `branches.ts`

---

## 3. 神煞 (Shen Sha / Spirit Stars) — `shen-sha.ts`

Full almanac scope: 100+ auspicious and inauspicious stars.

**Architecture:** Each 神煞 has:
- A unique name (Chinese)
- An English translation
- Category (noble/academic/romance/travel/wealth/protection/inauspicious)
- Derivation rule (from which pillar component → which branch/condition)

**Derivation sources:**

### From 日干 (Day Stem):
| 神煞 | Rule |
|------|------|
| 天乙貴人 | 甲戊庚→丑未, 乙己→子申, 丙丁→亥酉, 壬癸→巳卯, 辛→午寅 |
| 太極貴人 | 甲乙→子午, 丙丁→卯酉, 戊己→辰戌丑未, 庚辛→寅亥, 壬癸→巳申 |
| 天德貴人 | Based on month (正月丁, 二月申, ...) |
| 月德貴人 | Based on month (正月丙, 二月甲, ...) |
| 文昌貴人 | 甲→巳, 乙→午, 丙→申, 丁→酉, 戊→申, 己→酉, 庚→亥, 辛→子, 壬→寅, 癸→卯 |
| 祿神 | 甲→寅, 乙→卯, 丙戊→巳, 丁己→午, 庚→申, 辛→酉, 壬→亥, 癸→子 |
| 羊刃 | 祿神+1 position: 甲→卯, 丙戊→午, 庚→酉, 壬→子; 陰干→祿-1 |
| 金輿 | 甲→辰, 乙→巳, etc. |
| 天廚 | 甲→巳, 乙→午, 丙→未, etc. |
| 學堂 | Based on day stem's 長生 position |
| 詞館 | Based on day stem element |

### From 年支/日支 (Year/Day Branch):
| 神煞 | Rule |
|------|------|
| 驛馬 | 三合局沖: 寅午戌→申, 申子辰→寅, 巳酉丑→亥, 亥卯未→巳 |
| 桃花/咸池 | 三合局沐浴: 寅午戌→卯, 申子辰→酉, 巳酉丑→午, 亥卯未→子 |
| 華蓋 | 三合局墓: 寅午戌→戌, 申子辰→辰, 巳酉丑→丑, 亥卯未→未 |
| 將星 | 三合局帝旺: 寅午戌→午, 申子辰→子, 巳酉丑→酉, 亥卯未→卯 |
| 劫煞 | 三合局絕: 寅午戌→亥, 申子辰→巳, 巳酉丑→寅, 亥卯未→申 |
| 亡神 | 寅午戌→巳, 申子辰→亥, 巳酉丑→申, 亥卯未→寅 |
| 紅鸞 | 年支逆數3: 子→卯, 丑→寅, 寅→丑, ... |
| 天喜 | 紅鸞+6 (沖位) |
| 孤辰 | 寅卯辰→巳, 巳午未→申, 申酉戌→亥, 亥子丑→寅 |
| 寡宿 | 寅卯辰→丑, 巳午未→辰, 申酉戌→未, 亥子丑→戌 |
| 天羅 | 戌亥 (for 火命) |
| 地網 | 辰巳 (for 水命) |

### From 日柱 (Day Pillar — stem+branch):
| 神煞 | Rule |
|------|------|
| 十惡大敗 | 10 specific stem-branch pairs (甲辰, 乙巳, 壬申, etc.) |
| 陰差陽錯 | 12 specific stem-branch pairs |
| 魁罡 | 壬辰, 庚戌, 庚辰, 戊戌 |
| 四廢 | Based on season + day stem-branch |

### Almanac 神煞 (from month/day):
| 神煞 | Rule |
|------|------|
| 天赦日 | 春 戊寅, 夏 甲午, 秋 戊申, 冬 甲子 |
| 天恩日 | 甲子, 乙丑, 丙寅, 丁卯, 戊辰 in specific months |
| 月恩日 | Based on month stem |
| 母倉日 | Based on season |
| 四相日 | Based on season |
| 時德日 | Based on season |
| 月破日 | Day branch clashes with month branch |
| 歲破日 | Day branch clashes with year branch |
| 受死日 | Monthly cycle |
| 往亡日 | Monthly cycle |
| 天火日 | Monthly cycle |
| 地火日 | Monthly cycle |
| 血忌日 | Monthly cycle |
| 月厭日 | Monthly cycle |

**API:**
```typescript
interface ShenShaResult {
  name: string;        // '天乙貴人'
  english: string;     // 'Heavenly Noble'
  auspicious: boolean;
  source: 'day-stem' | 'year-branch' | 'day-branch' | 'day-pillar' | 'month' | 'season';
  present: Branch[];   // which branches in the chart have this star
}

// Individual lookup functions
function tianYiGuiRen(dayStem: Stem): [Branch, Branch];
function yiMa(reference: Branch): Branch;
function taoHua(reference: Branch): Branch;
// ... etc. for all 100+

// Aggregate
function getAllShenSha(pillars: FourPillars): ShenShaResult[];
function getShenShaForDate(date: Date): ShenShaResult[]; // almanac stars
```

**Dependencies:** `stems.ts`, `branches.ts`, `four-pillars.ts`, `solar-terms.ts`, `twelve-stages.ts`

---

## 4. 大六壬 (Grand Six Ren) — `liu-ren.ts`

Classical divination system using 天地盤 (heaven/earth plates), 四課 (four lessons), and 三傳 (three transmissions).

**Setup:**
1. Determine 日干支 (day stem-branch) — from four pillars
2. Determine 月將 (monthly general) — based on 中氣 (zhongqi):
   - 雨水後→亥(登明), 春分後→戌(河魁), 穀雨後→酉(從魁), ...
   - 12 月將 correspond to 12 branches
3. Determine current 時辰 (hour branch)
4. Set up 天地盤: 地盤 is fixed (子丑寅...亥), 天盤 rotates so 月將 aligns over 時辰

**四課 (Four Lessons):**
1. 第一課: 日干寄宮 (上) over 日干寄宮 (下) — day stem's lodging palace
2. 第二課: 日干上神 over 日干 — what's above day stem's branch
3. 第三課: 日支 (上) over 日支 — what's above day branch
4. 第四課: 日支上神 over 日支 — extended

Actually, standard 四課:
- 第一課: 干上神 / 日干 (天盤 branch over 日干寄宮 / 日干)
- 第二課: 干上神's 天盤上神 / 干上神
- 第三課: 支上神 / 日支
- 第四課: 支上神's 天盤上神 / 支上神

**三傳 (Three Transmissions) — derivation priority:**
1. **賊克** — if only one 上克下 or 下賊上 among 四課, that's 初傳
2. **比用** — if multiple 賊克, compare with day stem (同類 wins)
3. **涉害** — if still tied, 涉害深淺: trace 克 depth through branches
4. **遙克** — if no 賊克 in 四課, look for 遙克 (上下相克 but not adjacent)
5. **昴星** — if no 克 at all, use specific rules
6. **別責** — fallback rule
7. **八專** — special case when all 四課 are identical
8. **返吟** — when 天盤地盤 are 六沖 (opposite)
9. **伏吟** — when 天盤 = 地盤 (same position)

**涉害深淺 method (classical):** Count how many branches from the 初傳 candidate to the 日干寄宮 are being 克'd. The one with the deepest 涉害 wins.

**十二天將 (Twelve Heavenly Generals):**
貴人, 螣蛇, 朱雀, 六合, 勾陳, 青龍, 天空, 白虎, 太常, 玄武, 太陰, 天后

Placement: 貴人 sits on 天乙貴人 position (based on day stem), others follow in sequence.

**API:**
```typescript
type TianJiang = '貴人' | '螣蛇' | '朱雀' | '六合' | '勾陳' | '青龍' | '天空' | '白虎' | '太常' | '玄武' | '太陰' | '天后';

type SanChuanMethod = '賊克' | '比用' | '涉害' | '遙克' | '昴星' | '別責' | '八專' | '返吟' | '伏吟';

interface LiuRenKe {
  upper: Branch;  // 上 (天盤)
  lower: Branch;  // 下 (地盤/干支)
}

interface LiuRenChart {
  // Input
  dayStem: Stem;
  dayBranch: Branch;
  hourBranch: Branch;
  yueJiang: Branch;

  // 天地盤
  tianPan: Record<Branch, Branch>;  // 地盤branch → 天盤branch

  // 四課
  siKe: [LiuRenKe, LiuRenKe, LiuRenKe, LiuRenKe];

  // 三傳
  sanChuan: { chu: Branch; zhong: Branch; mo: Branch };
  method: SanChuanMethod;

  // 十二天將
  tianJiang: Record<Branch, TianJiang>;
}

function getYueJiang(date: Date): Branch;
function computeLiuRen(dayStem: Stem, dayBranch: Branch, hourBranch: Branch, yueJiang: Branch): LiuRenChart;
function computeLiuRenForDate(date: Date, hour?: number): LiuRenChart;
```

**Dependencies:** `stems.ts`, `branches.ts`, `solar-terms.ts`, `four-pillars.ts`, `branch-relations.ts`

---

## 5. 奇門遁甲 (Qi Men Dun Jia) — `qi-men.ts`

The most complex system. Arranges 三奇六儀 (3 wonders + 6 instruments), 八門 (8 gates), 九星 (9 stars), and 八神 (8 spirits) in a 九宮 (9 palaces) grid.

**Key concepts:**

### 局數 (Pattern Number) Determination
- 24 solar terms → 72 候 (pentads, 5-day periods)
- Each solar term has 3 候 → 上元/中元/下元
- 陽遁 (ascending): 冬至 to 夏至 → 局 1-9
- 陰遁 (descending): 夏至 to 冬至 → 局 9-1
- Each 候 maps to a specific 局 number (1-9)

### 置閏法 (Intercalation Method)
- Each 節 (15-day solar term) should span 3 × 5 = 15 days
- A 甲子/甲午 cycle = 60 幹支 = 10 天 × 6 旬
- When the 甲 day exceeds the term boundary by >9 days, insert 閏奇門
- 閏局 repeats the previous 局 number

### 拆補法 (Split-Supplement Method)
- No intercalation. Split each solar term proportionally.
- Calculate exact fraction of term elapsed, use proportional 局

### 三奇六儀 (Three Wonders + Six Instruments)
- 三奇: 乙(日奇), 丙(月奇), 丁(星奇)
- 六儀: 戊, 己, 庚, 辛, 壬, 癸
- Arranged on 地盤 based on 局數: 陽遁順布, 陰遁逆布
- 天盤 rotates based on 值符 (current 旬首)

### 八門 (Eight Gates)
休門, 生門, 傷門, 杜門, 景門, 死門, 驚門, 開門
- 地盤 fixed positions (based on 後天八卦)
- 天盤 positions rotate based on 值使

### 九星 (Nine Stars)
天蓬, 天任, 天沖, 天輔, 天英, 天芮, 天柱, 天心, 天禽
- Fixed 地盤 assignment
- 天盤 rotates with 值符

### 八神 (Eight Spirits)
值符, 螣蛇, 太陰, 六合, 白虎(勾陳), 玄武(朱雀), 九地, 九天
- 陽遁 and 陰遁 have different sequences

### 九宮 (Nine Palaces) — Lo Shu arrangement
```
4(巽SE) | 9(離S)  | 2(坤SW)
---------+---------+---------
3(震E)  | 5(中)   | 7(兌W)
---------+---------+---------
8(艮NE) | 1(坎N)  | 6(乾NW)
```

**API:**
```typescript
type QiMenPalace = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type QiMenGate = '休' | '生' | '傷' | '杜' | '景' | '死' | '驚' | '開';
type QiMenStar = '天蓬' | '天任' | '天沖' | '天輔' | '天英' | '天芮' | '天柱' | '天心' | '天禽';
type QiMenSpirit = '值符' | '螣蛇' | '太陰' | '六合' | '白虎' | '玄武' | '九地' | '九天';
type QiMenMethod = 'zhirun' | 'chaibu';
type QiMenDun = 'yang' | 'yin'; // 陽遁 / 陰遁

interface QiMenPalaceContent {
  palace: QiMenPalace;
  gua: string;          // 八卦 name
  tianStem: Stem;        // 天盤干
  diStem: Stem;          // 地盤干
  gate: QiMenGate;       // 門 (天盤)
  diGate: QiMenGate;     // 門 (地盤)
  star: QiMenStar;       // 星 (天盤)
  spirit: QiMenSpirit;   // 神
}

interface QiMenChart {
  method: QiMenMethod;
  dun: QiMenDun;
  ju: number;            // 局數 (1-9)
  yuan: '上' | '中' | '下';
  zhiFu: { stem: Stem; palace: QiMenPalace };  // 值符
  zhiShi: { gate: QiMenGate; palace: QiMenPalace }; // 值使
  palaces: Record<QiMenPalace, QiMenPalaceContent>;
  isRunJu: boolean;      // 閏局 (only for 置閏法)
}

function computeQiMen(date: Date, hour?: number, method?: QiMenMethod): QiMenChart;
function getJuNumber(date: Date, method?: QiMenMethod): { ju: number; dun: QiMenDun; yuan: string; isRun: boolean };
```

**Dependencies:** `stems.ts`, `branches.ts`, `solar-terms.ts`, `four-pillars.ts`

---

## Implementation Order

1. **建除十二神** — standalone, simple arithmetic
2. **紫白九星** — standalone, Lo Shu formulas
3. **神煞** — large but each rule is simple, uses existing modules
4. **大六壬** — complex but self-contained algorithm
5. **奇門遁甲** — most complex, both methods

Each module: types → tests → implementation → export from index.ts
