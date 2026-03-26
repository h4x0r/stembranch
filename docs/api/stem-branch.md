---
title: "Stem-Branch System (干支) — stem-branch API Reference"
description: "Heavenly Stems, Earthly Branches, sexagenary cycle, Five Elements relations, and 納音 cycle elements."
---

# Stem-Branch System (干支)

The foundational combinatorial system of Chinese metaphysics. Ten Heavenly Stems and twelve Earthly Branches combine into a 60-pair sexagenary cycle used for counting years, months, days, and hours. Each stem and branch carries an elemental association; the Five Elements generative and conquering cycles govern their interactions. The 納音 (cycle elements) layer assigns a poetic element-name to each of the 60 pairs.

### Stems and Branches (天干地支)

| Export | Description |
|---|---|
| `STEMS` | `['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']` |
| `BRANCHES` | `['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']` |
| `STEM_ELEMENT` | `Record<Stem, Element>` (甲乙=木, 丙丁=火, ...) |
| `BRANCH_ELEMENT` | `Record<Branch, Element>` |
| `stemByIndex(n)` | Get stem by index (mod 10) |
| `branchByIndex(n)` | Get branch by index (mod 12) |
| `stemPolarity(stem)` | `'陽'` or `'陰'` |
| `branchPolarity(branch)` | `'陽'` or `'陰'` |

### Sexagenary Cycle (六十甲子)

| Export | Description |
|---|---|
| `makeStemBranch(stem, branch)` | Build a `StemBranch` string |
| `stemBranchByCycleIndex(n)` | Get pair at position n in the 60-cycle |
| `stemBranchCycleIndex(stem, branch)` | Reverse lookup (returns -1 for invalid parity) |
| `parseStemBranch(str)` | Parse two-character string into stem + branch |
| `allSixtyStemBranch()` | All 60 valid pairs in cycle order |

### Five Elements (五行)

| Export | Description |
|---|---|
| `GENERATIVE_CYCLE` | 金→水→木→火→土→金 |
| `CONQUERING_CYCLE` | 金→木→土→水→火→金 |
| `ELEMENT_ORDER` | `['金','木','水','火','土']` |
| `getElementRelation(from, to)` | Returns `'生'`, `'剋'`, `'被生'`, `'被剋'`, or `'比和'` |

### Cycle Elements (納音)

| Export | Description |
|---|---|
| `CYCLE_ELEMENTS` | Full 60-pair lookup table with element and poetic name |
| `getCycleElement(sb)` | 納音 element for a stem-branch pair |
| `getCycleElementName(sb)` | 納音 poetic name (e.g. 海中金, 爐中火) |

## Types

```typescript
type Stem = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
type Branch = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';
type StemBranch = `${Stem}${Branch}`;
type Element = '金' | '木' | '水' | '火' | '土';
type ElementRelation = '生' | '剋' | '被生' | '被剋' | '比和';
type Strength = '旺' | '相' | '休' | '囚' | '死';
interface HiddenStem { stem: Stem; proportion: number; }
```
