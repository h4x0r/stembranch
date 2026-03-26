---
title: "Seven Governors (七政四餘) — stem-branch API Reference"
description: "Chinese sidereal astrology API: natal chart assembly, sidereal conversion, Four Remainders (四餘), mansion and palace lookup."
---

# Seven Governors (七政四餘)

Chinese sidereal astrology system placing 11 celestial bodies (7 planets + 4 lunar points) in 28 lunar mansions and 12 palaces. Supports three sidereal conversion modes (modern precession, classical epoch, fixed ayanamsa) and configurable Ketu interpretation (osculating apogee or descending node).

Computation methods, the Ketu/Rahu translation problem, and historical context: [docs/seven-governors.md](../seven-governors.md)

### Chart Assembly

| Export | Description |
|---|---|
| `getSevenGovernorsChart(date, location, options?)` | Complete 七政四餘 natal chart with all 11 bodies |

### Sidereal Conversion

| Export | Description |
|---|---|
| `toSiderealLongitude(tropicalLon, date, mode?)` | Convert tropical → sidereal longitude (3 modes: modern, classical, ayanamsa) |

### Four Remainders (四餘)

| Export | Description |
|---|---|
| `getRahuPosition(date)` | 羅睺: Moon's mean ascending node (~18.6-year retrograde cycle) |
| `getKetuPosition(date, mode?)` | 計都: osculating lunar apogee (default) or descending node |
| `getYuebeiPosition(date)` | 月孛: mean lunar apogee (Black Moon Lilith) |
| `getPurpleQiPosition(date)` | 紫氣: classical ~28-year prograde cycle |

### Mansion & Palace Lookup

| Export | Description |
|---|---|
| `getMansionForLongitude(siderealLon)` | Map sidereal longitude to one of 28 lunar mansions |
| `getPalaceForLongitude(siderealLon)` | Map sidereal longitude to one of 12 palaces |
| `getAscendant(date, location)` | Compute ascending degree from birth time and location |

## Types

```typescript
type Governor = 'sun' | 'moon' | 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn';
type Remainder = 'rahu' | 'ketu' | 'yuebei' | 'purpleQi';
type GovernorOrRemainder = Governor | Remainder;
type SiderealMode = { type: 'modern' } | { type: 'classical'; epoch: 'kaiyuan' | 'chongzhen' | number } | { type: 'ayanamsa'; value: number };
type KetuMode = 'apogee' | 'descending-node';
type MansionName = '角' | '亢' | ... | '軫';  // 28 lunar mansion names
type PalaceName = '子宮' | '丑宮' | ... | '亥宮';  // 12 palace names
type Dignity = '廟' | '旺' | '平' | '陷';
type AspectType = '合' | '沖' | '刑' | '三合';

interface BodyPosition { siderealLon: number; tropicalLon: number; mansion: MansionName; mansionDegree: number; palace: PalaceName; }
interface PalaceInfo { name: PalaceName; role: PalaceRole; mansions: MansionName[]; occupants: GovernorOrRemainder[]; }
interface SevenGovernorsOptions { siderealMode?: SiderealMode; ketuMode?: KetuMode; }
interface SevenGovernorsChart { date: Date; location: { lat: number; lon: number }; siderealMode: SiderealMode; ketuMode: KetuMode; bodies: Record<GovernorOrRemainder, BodyPosition>; palaces: PalaceInfo[]; ascendant: { mansion: MansionName; palace: PalaceName }; starSpirits: StarSpirit[]; aspects: Aspect[]; dignities: Record<GovernorOrRemainder, Dignity>; }
```
