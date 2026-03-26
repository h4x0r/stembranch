# The Historical Confusion Between 羅睺 (Rahu) and 計都 (Ketu) in Chinese Astronomy

## How a Lunar Apogee Became a Lunar Node, and Why Your Software Might Be Wrong

---

## Abstract

In the mature Chinese 七政四餘 (Seven Governors, Four Surplus) astrological system as codified in texts like 《果老星宗》, the four surplus bodies (四餘) are: 羅睺 (Rahu, the Moon's mean ascending node), 計都 (Ketu, the osculating lunar apogee), 月孛 (Yuebei, the lunar perigee), and 紫氣 (Ziqi, an intercalary-tracking fictitious point). However, many modern software implementations---including MOIRA---treat 計都 as the descending lunar node (the point 180 degrees opposite 羅睺), following a convention introduced during the Qing dynasty calendar reform. This paper traces the historical evolution of 計都's identity from its Indian origins through its Chinese transformation, explains why the Qing-era reversion to node-based 計都 created a parallel tradition, and documents how this confusion propagated into modern software.

---

## 1. The Indian Original: Rahu and Ketu as Eclipse Demons

In classical Indian (Jyotish) astronomy, Rahu and Ketu are the two lunar nodes---the points where the Moon's orbital plane intersects the ecliptic. Their mythological origin is the story of the demon Svarbhanu, who was beheaded by Vishnu after drinking the nectar of immortality; his head became Rahu (the ascending/north node) and his tail became Ketu (the descending/south node). Because eclipses occur when the Sun or Moon approaches these nodal points, Rahu and Ketu are conceptualized as eclipse-causing shadow planets.[^1]

In Indian astronomy, the identification is unambiguous and has been stable for millennia:

| Body | Indian Identity | Astronomical Meaning |
|------|----------------|---------------------|
| Rahu (राहु) | Ascending node (North Node) | Where the Moon crosses the ecliptic moving northward |
| Ketu (केतु) | Descending node (South Node) | Where the Moon crosses the ecliptic moving southward |

Rahu and Ketu are always exactly 180 degrees apart, and both are nodes.[^2]

However, it is important to note that the Sanskrit word *ketu* originally meant "banner" or "bright appearance" and referred to comets in earlier literature, not to a lunar node. The identification of Ketu with the descending node is a later development within Indian astronomy.[^3]

### References for Section 1

[^1]: Ketu (mythology), Wikipedia. <https://en.wikipedia.org/wiki/Ketu_(mythology)>
[^2]: Rahu, Wikipedia. <https://en.wikipedia.org/wiki/Rahu>
[^3]: Kotyk, Jeffrey (2018). "The Sinicization of Indo-Iranian Astrology in Medieval China." *Sino-Platonic Papers* 282. University of Pennsylvania, p. 47. Free PDF: <https://sino-platonic.org/complete/spp282_Indo-Iranian_Astrology_China.pdf>. Also on Academia.edu: <https://www.academia.edu/37502869/The_Sinicization_of_Indo-Iranian_Astrology_in_Medieval_China>

---

## 2. Transmission to China via the 九執曆 (718 CE)

The first systematic introduction of Indian astronomical methods into China was the *Jiuzhi li* 九執曆 (*Navagraha-karana*, "Calendar of the Nine Seizers"), translated in 718 CE by the court astronomer Gautama Siddhartha 瞿曇悉達, an astronomer of Indian descent whose family had settled in Chang'an.[^4] The *Jiuzhi li* introduced the Indian planetary computation system including the nine *graha* (the seven visible planets plus Rahu and Ketu) and assumed a spherical Earth model.[^5]

At this stage, Rahu (羅睺) and Ketu (計都) entered Chinese astronomical vocabulary as transliterations of their Sanskrit names. The *Jiuzhi li* preserved the Indian identification of Rahu as the ascending node.[^6]

### The 七曜攘災訣 (806 CE)

The earliest Chinese text containing actual ephemerides (positional tables) for Rahu and Ketu is the *Qiyao rangzai jue* 七曜攘災訣 ("Formulae for Averting Disasters [Caused by] the Seven Luminaries"), a Buddhist astrological work compiled by a Brahmana priest from western India sometime after 806 CE. This text was brought to Japan by the monk Shuei 宗叡 in 865 and preserved in the Japanese *Sukuyodo* 宿曜道 tradition.[^7]

The *Qiyao rangzai jue* contains ephemerides for Rahu spanning 93 years and for Ketu spanning 62 years, with epoch year 1 of Yuanhe 元和 (806 CE).[^8]

**This text is the key to understanding the identity shift.** Niu Weixing's landmark analysis (see Section 3) showed that the *Qiyao rangzai jue*'s ephemeris for Ketu does *not* match the motion of the descending node, but instead matches the lunar apogee.

### References for Section 2

[^4]: Yabuuchi Kiyoshi 藪內清 (1989). *Zotei Zuito rekiho shi no kenkyu* 增訂隋唐曆法史の硏究 [Revised Research on the History of Calendrical Science in the Sui and Tang Dynasties]. Kyoto: Rinsen Shoten. This work includes an English translation and commentary on the *Navagraha-karana*.
[^5]: Kotyk (2018), pp. 41--43.
[^6]: Mak, Bill M. (2014). "The History of Pseudo-planets in China (I): from 2nd to 11th century CE." Available on Academia.edu: <https://www.academia.edu/2763447/The_History_of_Psuedo_planets_in_China_I_from_2nd_to_11th_century_CE>
[^7]: Mak (2014), citing internal evidence of the text.
[^8]: Mak (2014), and also Mak, Bill M. (2024). "Persian Astronomy in China." *Journal of Indian Philosophy* 52(4). DOI: [10.1177/09719458241247636](https://journals.sagepub.com/doi/10.1177/09719458241247636).

---

## 3. Niu Weixing's Discovery: 計都 = Lunar Apogee, Not Descending Node

The conventional assumption---held by most practitioners and echoed in many reference works---was that in the Chinese system, just as in the Indian system, 羅睺 = ascending node and 計都 = descending node (or vice versa, with some texts reversing them). **Niu Weixing 钮卫星 overturned this assumption in 1994.**

In his paper "An Inquiry into the Astronomical Meaning of Rahu and Ketu" (罗睺、计都天文学含义考源), Niu carefully recomputed the ephemerides given in the *Qiyao rangzai jue* and demonstrated that:

- **羅睺 (Rahu) = the Moon's ascending node** (confirmed; matches Indian tradition)
- **計都 (Ketu) = the Moon's apogee** (not the descending node!)

The key evidence is the *period* of the Ketu ephemeris: 62 years, which corresponds to the lunar apsidal precession cycle (~8.85 years for a full revolution, with the 62-year ephemeris representing ~7 complete cycles). The descending node, by contrast, has the same ~18.6-year period as the ascending node (they are always 180 degrees apart), and a 62-year ephemeris spanning ~3.3 nodal cycles would look completely different from what the text provides.[^9]

### Citation

[^9]: Niu Weixing 钮卫星 (1994). 罗睺、计都天文学含义考源 [An inquiry into the astronomical meaning of Rahu and Ketu]. *Tianwen Xuebao* (Acta Astronomica Sinica) 35(3): 326--332. English translation: Niu Wei-xing (1995). "An inquiry into the astronomical meaning of Rahu and Ketu." *Chinese Astronomy and Astrophysics* 19(2): 259--266. DOI: [10.1016/0275-1062(95)00033-O](https://doi.org/10.1016/0275-1062(95)00033-O). ADS: <https://ui.adsabs.harvard.edu/abs/1995ChA&A..19..259N/abstract>.

---

## 4. The Gradual Divergence: How 計都 Shifted from Node to Apogee

The identity shift of 計都 was not instantaneous but occurred over several centuries during the Tang and Song dynasties. Niu Weixing traced this evolution in a subsequent paper:[^10]

### 4.1 Stage 1: Original Indian Transmission (7th--8th century)

When the nine-planet (*navagraha*) system first entered China, both Rahu and Ketu were understood as lunar nodes, consistent with the Indian source. The *Jiuzhi li* (718 CE) and early Buddhist texts preserved this identification.

### 4.2 Stage 2: Divergence in the *Qiyao rangzai jue* (806 CE)

By the time the *Qiyao rangzai jue* was compiled, Ketu's ephemeris already tracked the lunar apogee rather than the descending node. This suggests the shift occurred between approximately 718 and 806 CE. The mechanism of this shift remains debated, but Mak (2014) suggests it may have involved contamination from Persian astronomical concepts, which used different definitions of planetary orbital elements.[^11]

The monk Yixing 一行 (683--727) glossed Ketu as meaning "banner" (*fan* 旛) and associated it with comets (*huixing* 彗星), indicating awareness that Ketu's identity was not simply "descending node."[^12]

### 4.3 Stage 3: Consolidation in the Song and Ming Systems (10th--16th century)

By the late Tang and early Song dynasties, the "Four Surplus" (四餘) system crystallized into its mature form:

| Surplus Body | Identity | Period |
|-------------|----------|--------|
| 羅睺 (Rahu) | Moon's ascending node | ~18.6 years |
| 計都 (Ketu) | Moon's apogee (osculating lunar aphelion) | ~8.85 years |
| 月孛 (Yuebei) | Moon's perigee | ~8.85 years (opposite of 計都) |
| 紫氣 (Ziqi) | Fictitious point tracking intercalary cycles | ~28 years (computed) |

In this system, 計都 and 月孛 are paired as opposite apsidal points (apogee and perigee), while 羅睺 stands alone as a nodal point. **計都 is not 180 degrees from 羅睺; they have entirely different orbital periods and are astronomically independent.**

This is the system described in 《果老星宗》 and 《星學大成》 (by Wan Minying 萬民英, 1521--1603), which became the canonical references for 七政四餘 practice during the Ming dynasty.[^13]

### 4.4 The Bazi-ification of Pseudo-planets

As Mak (2014) notes, by the Ming dynasty, the computation of pseudo-planet positions had become increasingly divorced from astronomical ephemerides and was instead derived from the *bazi* (八字, the four pillars of birth date/time). This represents "an extreme case of sinicization" in which the original Indian astronomical content was replaced by Chinese numerological frameworks.[^14]

### References for Section 4

[^10]: Niu Weixing 钮卫星 (2010). 从"罗、计"到"四余"：外来天文概念汉化之一例 [From Rahu and Ketu to Four Invisible Bodies: An Example of the Sinicization of Foreign Astronomical Terminology]. *Journal of Shanghai Jiao Tong University (Philosophy and Social Sciences Edition)* 18(6): 48--57. Also available from Niu's Academia.edu profile: <https://sjtu.academia.edu/weixingniu>
[^11]: Mak (2014), pp. 8--12.
[^12]: Cited in Mak (2014), referencing the *Qiyao rangzai jue*.
[^13]: Kotyk (2018), pp. 47--50; also the astrology.tw charting application: <https://www.astrology.tw/astrology/chinese-astrology-chart>, which states it was made according to 《三辰通載》《星學大成》《果老星宗》.
[^14]: Mak (2014), discussing post-11th-century developments.

---

## 5. The Qing Dynasty Reversion: Schall von Bell's "Correction"

In 1644, the Qing government appointed the German Jesuit missionary Johann Adam Schall von Bell 湯若望 as head of the Bureau of Astronomy (*Qintianjian* 欽天監), placing him in charge of reforming the Chinese calendar. The result was the *Shixian li* 時憲曆 ("Calendar of the Epoch's Constitution"), promulgated in 1645.[^15]

### 5.1 What Schall Changed

Schall reformed the calendar using European (Tychonic) astronomical methods. In the process, he encountered the Four Surplus bodies (四餘), which were embedded in the traditional calendar's astrological annotations (*xuanze* 選擇, day-selection for auspicious activities).[^16]

Schall, trained in European astronomy where Rahu = north node and Ketu = south node (following Indian conventions transmitted via Arabic/Persian intermediaries), **reversed the Chinese convention**, reassigning:

| Pre-Qing Chinese Convention | Qing (Schall) Convention |
|----------------------------|------------------------|
| 計都 = ascending (north) node | 羅睺 = ascending (north) node |
| 羅睺 = descending (south) node | 計都 = descending (south) node |

### 5.2 The Motivation

According to the astrologer "杰赫" (Jack) at astro-jack.com, Schall was personally hostile to astrology, considering it superstitious and contrary to Catholic doctrine. The claim is that Schall deliberately swapped the node identifications.[^17] However, a more charitable interpretation is that Schall, knowing the Indian convention (Rahu = north, Ketu = south), assumed the Chinese had made an error and corrected it to match the Indian/European standard.

An alternative explanation involving transliteration error (confusing the sounds "Rahu" and "Ketu") has been proposed but is unconvincing: as a European linguist, Schall was unlikely to confuse two phonetically distinct Sanskrit terms.[^18]

### 5.3 What Schall Missed

The critical error in Schall's "correction" was twofold:

1. **計都 was no longer a node in the mature Chinese system.** By the Ming dynasty, 計都 = lunar apogee, not descending node. Schall reverted to an archaic (Tang-era or Indian) identification that had been superseded centuries earlier.

2. **The five-element attributions became inconsistent.** In the Chinese 七政四餘 system, 羅睺 is classified as 火餘 (fire surplus) and 計都 as 土餘 (earth surplus). In Indian Jyotish, Rahu's nature is Saturn/earth and Ketu's nature is Mars/fire. Schall's reassignment aligned the *names* with India but **reversed the elemental correspondences**, creating an internally inconsistent system.[^19]

### 5.4 The Calendar Case (1664--1669)

Schall's reforms provoked fierce opposition. In 1664, Yang Guangxian 楊光先 accused Schall of treason and heresy, partly over disagreements about the treatment of the Four Surplus bodies. Schall was sentenced to death (later commuted due to an earthquake), and the issue of how to handle the 四餘 was one element in the broader *Kangxi Calendar Case* 康熙曆獄.[^20]

After Schall's death (1666) and the resolution of the Calendar Case (1669), Ferdinand Verbiest 南懷仁 was appointed as his successor, and the Schall/Jesuit convention for 羅睺/計都 was retained in the official *Shixian li* system. This convention subsequently became the standard for Qing dynasty almanacs and ephemerides.[^21]

### References for Section 5

[^15]: Liu, Liyuan (2020). "When Missionary Astronomy Encountered Chinese Astrology: Johann Adam Schall von Bell and Chinese Calendar Reform in the Seventeenth Century." *Physics in Perspective* 22: 110--130. DOI: [10.1007/s00016-020-00255-z](https://doi.org/10.1007/s00016-020-00255-z). ADS: <https://ui.adsabs.harvard.edu/abs/2020PhP....22..110L/abstract>.
[^16]: Liu (2020), pp. 115--120.
[^17]: 杰赫星命 (2021). 七政四餘. <https://www.astro-jack.com/2021/04/七政四餘/>
[^18]: Same source as [^17].
[^19]: 陳樂融 [occupation: commentator] (n.d.). 印度占星學裡的羅睺和計都. <https://fc.iwant-in.net/?p=70283>. This source details the five-element mismatch.
[^20]: Jami, Catherine (2015). "Revisiting the Calendar Case (1664--1669)." HAL Archives Ouvertes. <https://shs.hal.science/halshs-01222267v1/document>
[^21]: Liu (2020), pp. 125--128.

---

## 6. The 計北羅南 vs. 計南羅北 Debate

The terminology "計北羅南" (計都 = North Node, 羅睺 = South Node) vs. "計南羅北" (計都 = South Node, 羅睺 = North Node) only makes sense if both 計都 and 羅睺 are understood as lunar nodes. **In the mature 《果老星宗》 system, this debate is nonsensical** because 計都 is the lunar apogee, not a node at all.

The existence of this debate itself reveals that a significant portion of practitioners have adopted the Qing-era convention (treating both as nodes) rather than the Ming-era convention (treating 計都 as the apogee).

### 6.1 The Pre-Qing Convention (計北羅南)

Before Schall's reform, the convention was:
- 計都 = North Node (ascending node, 月北交)
- 羅睺 = South Node (descending node, 月南交)

This is the convention documented by Shen Kuo 沈括 in the *Mengxi bitan* 夢溪筆談 (1088) and followed by Song-dynasty astronomers.[^22]

**Important caveat:** This pre-Qing convention already represents a *partial* reversion from the mature 四餘 system. In the 《果老星宗》 framework, 計都 is the apogee and is not a node at all. The fact that Shen Kuo treated both as nodes suggests that the node-based interpretation coexisted alongside the apogee-based interpretation even during the Song dynasty.

### 6.2 The Qing Convention (計南羅北)

After Schall's reform:
- 羅睺 = North Node (ascending node, 月北交)
- 計都 = South Node (descending node, 月南交)

This matches the Indian Jyotish convention and is the standard in modern almanacs.

### 6.3 The Cai Boli Tradition

The influential Hong Kong feng shui master Cai Boli 蔡伯勵 (1922--2018) compiled the annual 《七政經緯曆書》 (Seven Luminaries Longitude-Latitude Almanac), first published in 1891 by the Zhenbutang 真步堂 tradition. Because this almanac inherits from the Qing system (*Qingzhi* 清制), it uses the **計南羅北** convention (Ketu = South, Rahu = North). Since Cai Boli's almanac is the most widely used reference for 七政四餘 practitioners in Hong Kong and Southeast Asia, this convention has become dominant in modern practice.[^23]

### 6.4 The Software Toggle

As a result of this unresolved historical debate, most modern 七政四餘 charting software includes a toggle between 計北羅南 and 計南羅北. This toggle is visible in the MOIRA software and in the astrology.tw online charting application.[^24]

### References for Section 6

[^22]: Wikipedia (Chinese). 計都. <https://zh.wikipedia.org/zh-hant/計都>. States: "計都的定義就變作月球軌道與黃道的升交點（據沈括）或降交點（據湯若望）."
[^23]: 七政經緯曆書, Douban entry. <https://book.douban.com/subject/27117948/>. Also 杰赫星命 [^17].
[^24]: astrology.tw. 七政四餘排盤. <https://www.astrology.tw/astrology/chinese-astrology-chart>

---

## 7. The MOIRA Software Implementation: A Case Study

The MOIRA Chinese astrology software (七政四餘排盤軟件), originally developed by At Home Projects (2004--2015) and hosted on GitHub, provides a concrete example of how the Qing-era convention was encoded into modern software.[^25]

### 7.1 Source Code Analysis

In `ChartData.java`, the planet constants are defined as follows:

```java
static public final int TRUE_NODE = 10;
static public final int INV_TRUE_NODE = 11; // opposite of TRUE_NODE
static public final int PURPLE = 12;
static public final int MEAN_APOG = 13;
```

The Swiss Ephemeris planet mapping reveals the implementation:

```java
private int[] planets = {
    SweConst.SE_SUN, SweConst.SE_MOON,
    SweConst.SE_VENUS, SweConst.SE_JUPITER, SweConst.SE_MERCURY,
    SweConst.SE_MARS, SweConst.SE_SATURN, SweConst.SE_URANUS,
    SweConst.SE_NEPTUNE, SweConst.SE_PLUTO,
    SweConst.SE_TRUE_NODE,  // index 10: TRUE_NODE
    -1,                      // index 11: INV_TRUE_NODE (computed as TRUE_NODE + 180)
    -1,                      // index 12: PURPLE (紫氣, computed separately)
    SweConst.SE_MEAN_APOG,   // index 13: MEAN_APOG (月孛)
    ...
};
```

### 7.2 What This Implementation Does

| MOIRA Constant | Swiss Ephemeris Body | Chinese Name | Astronomical Identity |
|---------------|---------------------|-------------|----------------------|
| `TRUE_NODE` (10) | `SE_TRUE_NODE` | One of 計都/羅睺 | True ascending lunar node |
| `INV_TRUE_NODE` (11) | Computed: TRUE_NODE + 180 | The other of 計都/羅睺 | Point opposite the ascending node |
| `PURPLE` (12) | Computed separately | 紫氣 | Fictitious point |
| `MEAN_APOG` (13) | `SE_MEAN_APOG` | 月孛 | Mean lunar apogee |

The `sign_computation_type` and `sign_opposite` arrays, along with a user preference toggle, determine which label (計都 or 羅睺) is assigned to `TRUE_NODE` vs. `INV_TRUE_NODE`.

### 7.3 The Problem

MOIRA treats both 計都 and 羅睺 as lunar nodes (always 180 degrees apart), with a toggle to swap which one is the ascending node. **This is the Qing-era convention, not the 《果老星宗》 convention.**

In the 《果老星宗》 system:
- 羅睺 should be computed from `SE_TRUE_NODE` or `SE_MEAN_NODE` (the lunar ascending node)
- 計都 should be computed from `SE_OSCU_APOG` or `SE_MEAN_APOG` (the osculating or mean lunar apogee)
- 月孛 should be the opposite of 計都 (the lunar perigee), or `SE_INTP_APOG` for the interpolated apogee

But MOIRA maps 月孛 to `SE_MEAN_APOG` (the lunar apogee) and 計都 to the opposite of `SE_TRUE_NODE` (the descending node). This means:
- **MOIRA's 月孛 is actually computing the position that should be 計都** (the lunar apogee)
- **MOIRA's 計都 is computing the descending node, which should not exist in the 四餘 system at all**

### 7.4 Why This Happened

The developer of MOIRA likely:
1. Followed the Cai Boli / Qing-era convention, which treats both 羅睺 and 計都 as nodes
2. Was unaware of (or chose to disregard) Niu Weixing's 1994 finding that 計都 = apogee
3. Used the Swiss Ephemeris `SE_MEAN_APOG` for 月孛, which is astronomically correct for the apogee---but in the 《果老星宗》 system, this position should be labeled 計都, not 月孛

### References for Section 7

[^25]: GitHub: BahnAstro/MOIRA_chinese_astrology. <https://github.com/BahnAstro/MOIRA_chinese_astrology>. Source file: `base/ChartData.java`.

---

## 8. Bill Mak (2014): The Broader Evolution

Bill M. Mak of Kyoto University traced the full history of pseudo-planets in China from the 2nd to 11th century CE. His key findings relevant to this question:[^26]

1. **Foreign origin confirmed:** The pseudo-planets Luohou 羅睺 and Jidu 計都 mirror their Indian antecedents Rahu and Ketu. Ziqi 紫氣 and Yuebei 月孛 were Chinese inventions modeled on the computational methods of the former.

2. **The *Qiyao rangzai jue* as watershed:** The earliest extant Chinese calculation of Luohou and Jidu positions appears in this 806 CE text. By this point, the identity of Ketu had already shifted from "descending node" to "apogee."

3. **Sinicization overrode scientific content:** After the 11th century, the astronomical content of the pseudo-planets was progressively replaced by numerological derivations from the *bazi* (八字). The positions were no longer computed from astronomical ephemerides but from calendar-derived numerical algorithms.

4. **Hybrid system:** The result was "a curious hybrid which gained a life of its own"---neither purely Indian nor purely Chinese, but a syncretic system that preserved Indian names while assigning Chinese astronomical/astrological meanings.

### References for Section 8

[^26]: Mak, Bill M. (2014). "The History of Pseudo-planets in China (I): from 2nd to 11th century CE." Academia.edu: <https://www.academia.edu/2763447/The_History_of_Psuedo_planets_in_China_I_from_2nd_to_11th_century_CE>

---

## 9. Kotyk (2018): The Iranian Intermediary

Jeffrey Kotyk's study on the sinicization of Indo-Iranian astrology added an important dimension: Chinese horoscopy received its pseudo-planet concepts not directly from India but through Iranian (Sasanian Persian) intermediaries.[^27]

Key points:
- The Chinese horoscopic system uses eleven planets: five visible planets, Sun, Moon, Rahu, Ketu, Ziqi, and Yuebei.
- "The original names attested in the Hellenistic tradition differ somewhat from what are provided, since the Chinese names here are translations of Iranian terms."
- On the basis of mathematical parameters and associated iconography, "it is indisputable that these two pseudo-planets [Ziqi and Yuebei] originated from foreign sources."

This Iranian intermediary step may partly explain why Ketu's identity shifted: Persian astronomical traditions used different orbital element definitions than Indian ones, and the Chinese system may have received a Persian-inflected version of Ketu that already had apogee-related connotations.

### References for Section 9

[^27]: Kotyk, Jeffrey (2018). "The Sinicization of Indo-Iranian Astrology in Medieval China." *Sino-Platonic Papers* 282. Free PDF: <https://sino-platonic.org/complete/spp282_Indo-Iranian_Astrology_China.pdf>. Also on Academia.edu: <https://www.academia.edu/37502869/The_Sinicization_of_Indo-Iranian_Astrology_in_Medieval_China>

---

## 10. Summary: The Scholarly Consensus

### 10.1 What Is "Correct" for 七政四餘 Practice?

The scholarly consensus, based on the work of Niu Weixing (1994/1995, 2010), Mak (2014), and Kotyk (2018), is:

**In the mature 七政四餘 system as described in 《果老星宗》 and 《星學大成》:**
- 羅睺 = Moon's ascending node (mean or true)
- 計都 = Moon's osculating apogee (NOT a node; NOT 180 degrees from 羅睺)
- 月孛 = Moon's perigee (opposite of 計都)
- 紫氣 = Fictitious intercalary-tracking point

**The Qing-era convention (計都 = descending node, always 180 degrees from 羅睺) is a historical regression** introduced by Schall von Bell in 1645, reverting to a pre-Tang or Indian identification that had been superseded in the Chinese system by at least the 9th century.

### 10.2 Why Software Gets It Wrong

Modern software implementations like MOIRA follow the Qing convention because:

1. **The Cai Boli almanac is the most accessible reference.** Practitioners in Hong Kong and Southeast Asia rely on the 《七政經緯曆書》, which follows Qing conventions.

2. **Node-based computation is simpler.** Computing two points 180 degrees apart (nodes) requires only one Swiss Ephemeris call plus a 180-degree offset. Computing separate node and apogee positions requires two independent ephemeris calls with different bodies.

3. **The scholarly literature is inaccessible to developers.** Niu Weixing's 1994 paper was published in Chinese in *Acta Astronomica Sinica* and translated into *Chinese Astronomy and Astrophysics*---neither of which is in the typical reading list of software developers.

4. **The 計北羅南/計南羅北 toggle creates a false impression of comprehensiveness.** By offering a toggle between two node-based conventions, software appears to address the historical controversy while actually missing the deeper issue (that 計都 should not be a node at all).

### 10.3 Chronological Summary

| Period | 計都 Identity | Source/Authority |
|--------|--------------|-----------------|
| Pre-718 CE (Indian original) | Descending lunar node | Indian *Siddhanta* tradition |
| 718 CE (*Jiuzhi li*) | Initially descending node | Gautama Siddhartha |
| 806 CE (*Qiyao rangzai jue*) | **Lunar apogee** (shift documented) | Niu Weixing (1994) |
| Song dynasty (Shen Kuo, 1088) | Ascending node (reversal from Indian) | *Mengxi bitan* |
| Ming dynasty (《果老星宗》) | **Lunar apogee** (canonical) | Astrological tradition |
| 1645 (Schall von Bell reform) | **Descending node** (reversion) | *Shixian li* / Qing convention |
| Modern software (MOIRA etc.) | Descending node (following Qing) | Cai Boli tradition |

---

## 11. Implications for Correct Software Implementation

A software implementation faithful to the 《果老星宗》 system should:

1. Compute 羅睺 from the Moon's ascending node (`SE_MEAN_NODE` or `SE_TRUE_NODE`)
2. Compute 計都 from the Moon's osculating apogee (`SE_OSCU_APOG`) or mean apogee (`SE_MEAN_APOG`)
3. Compute 月孛 as the point opposite 計都 (i.e., the lunar perigee), OR from `SE_INTP_APOG` / `SE_INTP_PERG`
4. **Not** treat 計都 as 180 degrees from 羅睺
5. **Not** offer a 計北羅南/計南羅北 toggle (which is only meaningful if 計都 is treated as a node)

A software implementation faithful to the Qing/Cai Boli tradition should:

1. Compute 羅睺 as the ascending node
2. Compute 計都 as the descending node (180 degrees from 羅睺)
3. Compute 月孛 from `SE_MEAN_APOG` (lunar apogee)
4. Offer a toggle for 計北羅南/計南羅北 to accommodate pre-Qing conventions

**Both approaches are internally consistent; they represent different historical strata of the same tradition.** But developers should be explicit about which convention they follow, rather than implicitly defaulting to the Qing convention without acknowledging the alternative.

---

## Bibliography

### Primary Scholarly Sources (Verified)

1. **Niu Weixing 钮卫星** (1994). 罗睺、计都天文学含义考源. *Acta Astronomica Sinica* 35(3): 326--332.
   - English: Niu Wei-xing (1995). "An inquiry into the astronomical meaning of Rahu and Ketu." *Chinese Astronomy and Astrophysics* 19(2): 259--266.
   - DOI: [10.1016/0275-1062(95)00033-O](https://doi.org/10.1016/0275-1062(95)00033-O)
   - ADS: <https://ui.adsabs.harvard.edu/abs/1995ChA&A..19..259N/abstract>

2. **Niu Weixing 钮卫星** (2010). 从"罗、计"到"四余"：外来天文概念汉化之一例. *Journal of Shanghai Jiao Tong University (Philosophy and Social Sciences Edition)* 18(6): 48--57.
   - Author profile: <https://sjtu.academia.edu/weixingniu>

3. **Niu Weixing 钮卫星** (2020). The Lunar Apogee in Ancient Chinese Astronomy and Its Foreign Origin. *The Chinese Journal for the History of Science and Technology* 41(2).
   - Seminar announcement: <https://astronomylab.nju.edu.cn/English/News/Seminars/20210207/i187864.html>

4. **Mak, Bill M.** (2014). "The History of Pseudo-planets in China (I): from 2nd to 11th century CE."
   - Academia.edu: <https://www.academia.edu/2763447/The_History_of_Psuedo_planets_in_China_I_from_2nd_to_11th_century_CE>

5. **Mak, Bill M.** (2024). "Persian Astronomy in China." *Journal of Indian Philosophy* 52(4).
   - DOI: [10.1177/09719458241247636](https://doi.org/10.1177/09719458241247636)

6. **Kotyk, Jeffrey** (2018). "The Sinicization of Indo-Iranian Astrology in Medieval China." *Sino-Platonic Papers* 282.
   - Free PDF: <https://sino-platonic.org/complete/spp282_Indo-Iranian_Astrology_China.pdf>
   - Academia.edu: <https://www.academia.edu/37502869/The_Sinicization_of_Indo-Iranian_Astrology_in_Medieval_China>

7. **Kotyk, Jeffrey** (2017). "Buddhist Astrology and Astral Magic in the Tang Dynasty." PhD Dissertation, Leiden University.
   - <https://www.academia.edu/35484261/Buddhist_Astrology_and_Astral_Magic_in_the_Tang_Dynasty_PhD_Dissertation_>

8. **Liu, Liyuan** (2020). "When Missionary Astronomy Encountered Chinese Astrology: Johann Adam Schall von Bell and Chinese Calendar Reform in the Seventeenth Century." *Physics in Perspective* 22: 110--130.
   - DOI: [10.1007/s00016-020-00255-z](https://doi.org/10.1007/s00016-020-00255-z)
   - ADS: <https://ui.adsabs.harvard.edu/abs/2020PhP....22..110L/abstract>

9. **Yabuuchi Kiyoshi 藪內清** (1989). *Zotei Zuito rekiho shi no kenkyu* 增訂隋唐曆法史の硏究. Kyoto: Rinsen Shoten.

10. **Jami, Catherine** (2015). "Revisiting the Calendar Case (1664--1669)."
    - <https://shs.hal.science/halshs-01222267v1/document>

### Chinese-Language Practitioner Sources

11. **杰赫星命** (2021). 七政四餘. <https://www.astro-jack.com/2021/04/七政四餘/>

12. **陳樂融** (n.d.). 印度占星學裡的羅睺和計都. <https://fc.iwant-in.net/?p=70283>

13. **知命網 astrology.tw** (n.d.). 七政四餘排盤. <https://www.astrology.tw/astrology/chinese-astrology-chart>

### Software Sources

14. **MOIRA Chinese Astrology** (2004--2015). At Home Projects. GitHub: <https://github.com/BahnAstro/MOIRA_chinese_astrology>
    - Key files: `base/ChartData.java`, `base/Calculate.java`

### Reference Works

15. **Wikipedia (Chinese)**. 計都. <https://zh.wikipedia.org/zh-hant/計都>
