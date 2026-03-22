# Tropical vs Sidereal Astrology: Research Notes

## For LaTeX paper section on reference frames and celestial coordinate systems

---

## 1. Fundamental Difference

| Property | Tropical Zodiac | Sidereal Zodiac |
|----------|----------------|-----------------|
| Anchor point | Vernal equinox (Sun-Earth geometry) | Fixed stars (background constellations) |
| Aries 0 deg | Always = vernal equinox | Tied to a reference star (e.g., Spica) |
| Precesses? | Yes, relative to stars (~50.3"/yr) | No (fixed to stellar background) |
| Seasonal alignment | Always aligned to seasons | Drifts relative to seasons |
| Stellar alignment | Drifts relative to stars | Always aligned to stars |

The two frames coincided approximately in the early centuries CE. By 2026, they differ by ~24 deg (the ayanamsa).

## 2. Precession Quantities

- **Rate**: 50.2564"/year (IAU 2006), commonly ~50.3"/year
- **Equivalent**: 1 deg per 71.6 years; ~1.4 deg/century
- **Ayanamsa (2026)**: ~24 deg 10' (Lahiri system)
- **Since Han dynasty (~2000 yr)**: ~28 deg (nearly one full zodiacal division)
- **Since Song dynasty (~1000 yr)**: ~14 deg
- **Since Yang Weide codification (1034 CE, ~992 yr)**: ~14 deg

## 3. Key Traditions

### Tropical users:
1. **Western astrology** (post-Ptolemy, 2nd c. CE): Ptolemy's *Almagest* and *Tetrabiblos* established the tropical framework. Quote from *Tetrabiblos* I.10: "Although there is no natural beginning of the zodiac, since it is a circle, they assume that the sign which begins with the vernal equinox, that of Aries, is the starting-point of them all."
2. **Chinese zhongqi huanjiang fa** (中氣換將法) for Da Liu Ren (大六壬): Switches yuejiang (月將) at each zhongqi (中氣, major solar term). Since zhongqi are defined by tropical solar longitude (multiples of 30 deg), this method is immune to precession. Modern standard.

### Sidereal users:
1. **Indian Jyotish**: Dominant Hindu astrology system. Lahiri ayanamsa official since 1955 (Indian Calendar Reform Committee). Formula: sidereal longitude = tropical longitude - ayanamsa.
2. **Chinese qizheng siyu** (七政四餘): 28 xiu (宿, lunar mansions) are fundamentally sidereal, tied to determinative stars. Unequal widths (<1 deg to ~33 deg). Require precession correction from epoch tables.
3. **Chinese richan fa** (日躔法) for Da Liu Ren (大六壬): Sun's position in 12 xingci (星次, sidereal star lodges). Codified by Yang Weide (楊惟德) in the Jingyou Liu Ren Shen Ding Jing (景祐六壬神定經, 1034 CE). Now diverged ~14 deg from tropical.

## 4. The Ayanamsa Problem

Different sidereal traditions disagree on the exact tropical-sidereal offset:

| System | Zero-ayanamsa year | Proponent | Notes |
|--------|-------------------|-----------|-------|
| Lahiri (Citrapaksha) | 285 CE | N.C. Lahiri | Official Indian govt standard since 1955 |
| Fagan-Bradley | 221 CE | Cyril Fagan (1950) | Popular among Western siderealists |
| Raman | varies | B.V. Raman | ~2 deg from Lahiri |
| Krishnamurti | varies | K.S. Krishnamurti | Sub-sub-division system |
| Galactic Center | modern | various | Anchored to galactic center |

The controversy is fundamentally irresolvable: there is no physically privileged "zero point" for the sidereal zodiac. Different reference stars yield different origins. "New ayanamshas are invented almost every year" (astro.com). Practical consequence: Indian religious holidays depend on which ayanamsa the calendar-maker uses.

## 5. Chinese Independent Precession Discovery

**Yu Xi** (虞喜, c. 281-356 CE, Eastern Jin dynasty):
- In 336 CE, wrote *An Tian Lun* (安天論, "Disquisition on the Conformation of the Heavens")
- Observed winter solstice position drifted ~1 deg per 50 years relative to stars
- His estimate: 1 deg/50 yr (actual: 1 deg/~72 yr -- overestimated by ~44%)
- Independent of Hipparchus (c. 190-120 BCE), ~450 years later
- No known transmission of Greek astronomical knowledge to China at that time
- Precursor: Jia Kui (賈逵, 30-101 CE) noted hints earlier

**Zu Chongzhi** (祖沖之, 429-501 CE): First to incorporate precession into calendar calculations (Daming Calendar, 大明曆).

## 6. Shen Kuo's Critique (already in paper)

Paper text: "The polymath Shen Kuo (沈括, 1031-1095) identified this problem in his 夢溪筆談 (*Dream Pool Essays*, c. 1088): the 合神 and 日躔 methods had already diverged by ~15 deg due to precession."

Shen Kuo proposed reforming even the yuejiang (月建) system to match actual celestial observations -- never implemented. This is a direct observation of the sidereal drift problem within Chinese metaphysics practice.

## 7. Connection to Paper's Reference-Frame Theme

The paper's overarching theme is about **reference frames** and their computational consequences. The tropical/sidereal distinction is the **third axis**:

1. **Spatial**: Choice of meridian/longitude (Shanghai vs Chengdu = 70 min difference)
2. **Temporal**: Apparent solar time -> mean solar time -> zone time (each transition introduces errors)
3. **Celestial**: Tropical (equinox-anchored) vs sidereal (star-anchored) -- the precession problem

Each choice is a human convention, not a physical absolute, and each introduces systematic errors when applied across different contexts. The parallel is exact: just as the adoption of UTC+8 for all of China introduces a spatial reference-frame error, the choice of tropical vs sidereal zodiac introduces a celestial reference-frame error that grows at ~1.4 deg/century.

## 8. Citable Academic References

### Primary (for LaTeX \cite{}):

1. **Ptolemy.** *Almagest*, c. 150 CE. Trans. G.J. Toomer, Princeton UP, 1998. ISBN 978-0-691-00260-6.
   - Use for: Western tropical adoption, precession description, Equation of Time

2. **Ptolemy.** *Tetrabiblos*, c. 150 CE. Trans. F.E. Robbins, Loeb Classical Library, Harvard UP, 1940.
   - Use for: Explicit vernal equinox as zodiac origin quote

3. **Needham, Joseph, and Wang Ling.** *Science and Civilisation in China*, Vol. 3. Cambridge UP, 1959.
   - Use for: Yu Xi precession discovery, Chinese astronomical history, Section 20

4. **Pingree, David.** *Jyotihsastra: Astral and Mathematical Literature*. Harrassowitz, 1981.
   - Use for: Indian Jyotish sidereal system, scholarly foundation

5. **Neugebauer, Otto.** *A History of Ancient Mathematical Astronomy* (HAMA). Springer, 1975.
   - Use for: Babylonian sidereal origins, Greek tropical development, Hipparchus

6. **Sun Xiaochun and Kistemaker, Jacob.** *The Chinese Sky during the Han*. Brill, 1997.
   - Use for: 28 xiu sidereal system, Chinese star catalogues, precession effects

7. **Hockey, Thomas, et al. (eds.)** *Biographical Encyclopedia of Astronomers*, 2nd ed. Springer, 2014.
   - Use for: Yu Xi biographical entry. DOI: 10.1007/978-1-4419-9917-7

### Secondary:

8. **Indian Calendar Reform Committee.** Report. CSIR, Govt of India, 1955.
   - Use for: Lahiri ayanamsa adoption

9. **Fagan, Cyril.** *Zodiacs Old and New*. 1950 (repr. 2011).
   - Use for: Fagan-Bradley ayanamsa, Western sidereal tradition

10. **K. Chandra Hari.** "On the Origin of Siderial Zodiac." *Indian J. History of Science* 33(4), 1998.
    - Use for: Ayanamsa controversy, sidereal zodiac origins

---

## LaTeX BibTeX Entries (ready to paste)

```bibtex
@book{toomer_almagest,
  author    = {Ptolemy},
  title     = {Ptolemy's Almagest},
  note      = {Translated by G. J. Toomer},
  publisher = {Princeton University Press},
  year      = {1998},
  isbn      = {978-0-691-00260-6}
}

@book{ptolemy_tetrabiblos,
  author    = {Ptolemy},
  title     = {Tetrabiblos},
  note      = {Translated by F. E. Robbins},
  series    = {Loeb Classical Library},
  publisher = {Harvard University Press},
  year      = {1940}
}

@book{needham_scc3,
  author    = {Needham, Joseph and Wang, Ling},
  title     = {Science and Civilisation in China},
  volume    = {3: Mathematics and the Sciences of the Heavens and the Earth},
  publisher = {Cambridge University Press},
  year      = {1959}
}

@book{pingree_jyotihsastra,
  author    = {Pingree, David},
  title     = {Jyoti\d{h}\'{s}\={a}stra: Astral and Mathematical Literature},
  series    = {A History of Indian Literature},
  volume    = {6},
  number    = {4},
  editor    = {Gonda, J.},
  publisher = {Otto Harrassowitz},
  address   = {Wiesbaden},
  year      = {1981}
}

@book{neugebauer_hama,
  author    = {Neugebauer, Otto},
  title     = {A History of Ancient Mathematical Astronomy},
  series    = {Studies in the History of Mathematics and Physical Sciences},
  publisher = {Springer-Verlag},
  address   = {Berlin},
  year      = {1975}
}

@book{sun_kistemaker_1997,
  author    = {Sun, Xiaochun and Kistemaker, Jacob},
  title     = {The Chinese Sky during the {Han}: Constellating Stars and Society},
  series    = {Sinica Leidensia},
  volume    = {38},
  publisher = {Brill},
  address   = {Leiden},
  year      = {1997},
  isbn      = {978-90-04-10737-3}
}

@book{hockey_bea,
  editor    = {Hockey, Thomas and Trimble, Virginia and Williams, Thomas R.},
  title     = {The Biographical Encyclopedia of Astronomers},
  edition   = {2nd},
  publisher = {Springer},
  year      = {2014},
  doi       = {10.1007/978-1-4419-9917-7}
}

@report{india_calendar_reform,
  author    = {{Calendar Reform Committee}},
  title     = {Report of the Calendar Reform Committee},
  institution = {Council of Scientific and Industrial Research, Government of India},
  year      = {1955}
}

@book{fagan_zodiacs,
  author    = {Fagan, Cyril},
  title     = {Zodiacs Old and New: A Probe Into Antiquity and What Was Found},
  year      = {1950},
  note      = {Reprinted 2011}
}

@article{chandra_hari_1998,
  author    = {Chandra Hari, K.},
  title     = {On the Origin of Siderial Zodiac and Astronomy},
  journal   = {Indian Journal of History of Science},
  volume    = {33},
  number    = {4},
  year      = {1998}
}
```
