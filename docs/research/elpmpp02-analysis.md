# ELP/MPP02 Implementation Analysis

Source: https://github.com/ytliu0/ElpMpp02 (C++ with JS code generator)

## Architecture

The repo contains C++ code (`ElpMpp02.cpp`) that reads 14 data files and computes
lunar position. A separate C++ file (`ElpMpp_JavaScript.cpp`) generates truncated
JavaScript functions where all series terms are inlined (no data files needed at
runtime). The minified JS files in the repo are generated artifacts.

## Data Files (14 total)

### Main Problem (3 files)
Format: first line = N (term count), then N rows of:
`D F L Lp A B1 B2 B3 B4 B5 B6` (4 ints + 7 doubles)

| File | Terms | Trig |
|------|-------|------|
| `elp_main.long` | 1023 | sine |
| `elp_main.lat` | 918 | sine |
| `elp_main.dist` | 704 | cosine |

Effective amplitude: `A_eff = fA*A + fB1*B1 + fB2*B2 + fB3*B3 + fB4*B4 + fB5*B5`
(B6 is unused; for lon/lat fA=1.0; for dist fA = 1 - 2/3*delnu_nu)

### Perturbation (11 files)
Format: first line = N, then N rows of:
`D F L Lp Me Ve EM Ma Ju Sa Ur Ne zeta amplitude phase` (13 ints + 2 doubles)
All use **sine**: `sum += A * sin(phase_offset + i0*D + i1*F + ... + i12*zeta)`

| File | Terms |
|------|-------|
| `elp_pert.longT0` | 11314 |
| `elp_pert.longT1` | 1199 |
| `elp_pert.longT2` | 219 |
| `elp_pert.longT3` | 2 |
| `elp_pert.latT0` | 6462 |
| `elp_pert.latT1` | 516 |
| `elp_pert.latT2` | 52 |
| `elp_pert.distT0` | 12115 |
| `elp_pert.distT1` | 1165 |
| `elp_pert.distT2` | 210 |
| `elp_pert.distT3` | 2 |

## Two Parameter Sets

### corr=0: Fitted to LLR observations
```
Dw1_0=-0.10525  Dw2_0=0.16826   Dw3_0=-0.10760
Deart_0=-0.04012  Dperi=-0.04854
Dw1_1=-0.32311  Dgam=0.00069   De=0.00005
Deart_1=0.01442  Dep=0.00226
Dw2_1=0.08017   Dw3_1=-0.04317
Dw1_2=-0.03794
Dw1_3=0  Dw1_4=0  Dw2_2=0  Dw2_3=0  Dw3_2=0  Dw3_3=0
```

### corr=1: Fitted to DE405/DE406
```
Dw1_0=-0.07008  Dw2_0=0.20794   Dw3_0=-0.07215
Deart_0=-0.00033  Dperi=-0.00749
Dw1_1=-0.35106  Dgam=0.00085   De=-0.00006
Deart_1=0.00732  Dep=0.00224
Dw2_1=0.08017   Dw3_1=-0.04317
Dw1_2=-0.03743  Dw1_3=-0.00018865  Dw1_4=-0.00001024
Dw2_2=0.00470602  Dw2_3=-0.00025213
Dw3_2=-0.00261070  Dw3_3=-0.00010712
```

## Derived Parameters

```
am = 0.074801329
alpha = 0.002571881
dtsm = 2*alpha/(3*am)
xa = 2*alpha/3
sec = PI/648000
w11 = 1732559343.73604 * sec  (mean motion, arcsec/cy -> rad/cy)

bp[5][2] = [
  [ 0.311079095, -0.103837907],
  [-0.004482398,  0.006682870],
  [ 0.001102940, -0.001298824],
  [ 0.001056062, -0.001230209],
  [ 0.000050928, -0.000024910]
]

x2 = w11*bp[0][0]       x3 = w11*bp[0][1]
y2 = am*bp[4][0]        y3 = am*bp[4][1]
d21 = x2-y2             d31 = x3-y3
d22 = w11*bp[1][0]      d32 = w11*bp[1][1]
d23 = w11*bp[2][0]      d33 = w11*bp[2][1]
d24 = w11*bp[3][0]      d34 = w11*bp[3][1]
d25 = y2/am             d35 = y3/am

Cw2_1 = d21*Dw1_1 + d25*Deart_1 + d22*Dgam + d23*De + d24*Dep
Cw3_1 = d31*Dw1_1 + d35*Deart_1 + d32*Dgam + d33*De + d34*Dep

delnu_nu = (0.55604 + Dw1_1)*sec/w11
dele     = (0.01789 + De)*sec
delg     = (-0.08066 + Dgam)*sec
delnp_nu = (-0.06424 + Deart_1)*sec/w11
delep    = (-0.12879 + Dep)*sec

fB1 = -am*delnu_nu + delnp_nu
fB2 = delg
fB3 = dele
fB4 = delep
fB5 = -xa*delnu_nu + dtsm*delnp_nu
fA  = 1.0 - 2.0/3.0*delnu_nu
```

## compute_Elp_arguments(T)

T = Julian centuries from J2000.0 = (JD_TDB - 2451545.0) / 36525.0

### W1 (Mean longitude of Moon)
```
w10 = (-142 + 18/60 + (59.95571 + Dw1_0)/3600) * deg
w11 = mod2pi((1732559343.73604 + Dw1_1) * T * sec)
w12 = mod2pi((-6.8084 + Dw1_2) * T^2 * sec)
w13 = mod2pi((0.006604 + Dw1_3) * T^3 * sec)
w14 = mod2pi((-3.169e-5 + Dw1_4) * T^4 * sec)
```

### W2 (Mean longitude of lunar perigee)
```
w20 = (83 + 21/60 + (11.67475 + Dw2_0)/3600) * deg
w21 = mod2pi((14643420.3171 + Dw2_1 + Cw2_1) * T * sec)
w22 = mod2pi((-38.2631 + Dw2_2) * T^2 * sec)
w23 = mod2pi((-0.045047 + Dw2_3) * T^3 * sec)
w24 = mod2pi(0.00021301 * T^4 * sec)
```

### W3 (Mean longitude of lunar ascending node)
```
w30 = (125 + 2/60 + (40.39816 + Dw3_0)/3600) * deg
w31 = mod2pi((-6967919.5383 + Dw3_1 + Cw3_1) * T * sec)
w32 = mod2pi((6.359 + Dw3_2) * T^2 * sec)
w33 = mod2pi((0.007625 + Dw3_3) * T^3 * sec)
w34 = mod2pi(-3.586e-5 * T^4 * sec)
```

### Ea (Mean longitude of Earth-Moon barycenter)
```
Ea0 = (100 + 27/60 + (59.13885 + Deart_0)/3600) * deg
Ea1 = mod2pi((129597742.293 + Deart_1) * T * sec)
Ea2 = mod2pi(-0.0202 * T^2 * sec)
Ea3 = mod2pi(9e-6 * T^3 * sec)
Ea4 = mod2pi(1.5e-7 * T^4 * sec)
```

### pomp (Mean longitude of perihelion of EMB)
```
p0 = (102 + 56/60 + (14.45766 + Dperi)/3600) * deg
p1 = mod2pi(1161.24342 * T * sec)
p2 = mod2pi(0.529265 * T^2 * sec)
p3 = mod2pi(-1.1814e-4 * T^3 * sec)
p4 = mod2pi(1.1379e-5 * T^4 * sec)
```

### Planetary Mean Longitudes
```
Me = (-108 + 15/60 + 3.216919/3600)*deg + mod2pi(538101628.66888*T*sec)
Ve = (-179 + 58/60 + 44.758419/3600)*deg + mod2pi(210664136.45777*T*sec)
EM = (100 + 27/60 + 59.13885/3600)*deg + mod2pi(129597742.293*T*sec)
Ma = (-5 + 26/60 + 3.642778/3600)*deg + mod2pi(68905077.65936*T*sec)
Ju = (34 + 21/60 + 5.379392/3600)*deg + mod2pi(10925660.57335*T*sec)
Sa = (50 + 4/60 + 38.902495/3600)*deg + mod2pi(4399609.33632*T*sec)
Ur = (-46 + 3/60 + 4.354234/3600)*deg + mod2pi(1542482.57845*T*sec)
Ne = (-56 + 20/60 + 56.808371/3600)*deg + mod2pi(786547.897*T*sec)
```

### Assembled Arguments
```
W1 = w10+w11+w12+w13+w14
W2 = w20+w21+w22+w23+w24
W3 = w30+w31+w32+w33+w34
Ea = Ea0+Ea1+Ea2+Ea3+Ea4
pomp = p0+p1+p2+p3+p4

return {
  W1: mod2pi(W1),               // Mean longitude of Moon
  D:  mod2pi(W1 - Ea + PI),     // Mean elongation
  F:  mod2pi(W1 - W3),          // Mean argument of latitude
  L:  mod2pi(W1 - W2),          // Mean anomaly of Moon
  Lp: mod2pi(Ea - pomp),        // Mean anomaly of Sun
  zeta: mod2pi(W1 + 0.02438029560881907*T),
  Me: mod2pi(Me), Ve: mod2pi(Ve), EM: mod2pi(EM), Ma: mod2pi(Ma),
  Ju: mod2pi(Ju), Sa: mod2pi(Sa), Ur: mod2pi(Ur), Ne: mod2pi(Ne)
}
```

## Series Summation Functions

### Elp_main_sum (4 Delaunay multipliers)
```
// For lon/lat (dist=0): sine series
sum = 0
for each term:
    phase = i[0]*D + i[1]*F + i[2]*L + i[3]*Lp
    sum += A * sin(phase)

// For distance (dist=1): cosine series
sum = 0
for each term:
    phase = i[0]*D + i[1]*F + i[2]*L + i[3]*Lp
    sum += A * cos(phase)
```

### Elp_perturbation_sum (13 multipliers + phase offset)
```
sum = 0
for each term:
    phase = ph + i[0]*D + i[1]*F + i[2]*L + i[3]*Lp
          + i[4]*Me + i[5]*Ve + i[6]*EM + i[7]*Ma
          + i[8]*Ju + i[9]*Sa + i[10]*Ur + i[11]*Ne + i[12]*zeta
    sum += A * sin(phase)
```

## getX2000(T) — Complete Pipeline

```
args = compute_Elp_arguments(T)

// Main problem
main_long = main_sum_sine(main_long_data, args)
main_lat  = main_sum_sine(main_lat_data, args)
main_dist = main_sum_cosine(main_dist_data, args)

// Perturbation sums
pert_longT0..T3 = perturbation_sum(pert_data, args)
pert_latT0..T2  = perturbation_sum(pert_data, args)
pert_distT0..T3 = perturbation_sum(pert_data, args)

// Combine
longM = args.W1 + main_long + pert_longT0
      + mod2pi(pert_longT1 * T)
      + mod2pi(pert_longT2 * T^2)
      + mod2pi(pert_longT3 * T^3)

latM = main_lat + pert_latT0
     + mod2pi(pert_latT1 * T)
     + mod2pi(pert_latT2 * T^2)

ra0 = 384747.961370173 / 384747.980674318
r = ra0 * (main_dist + pert_distT0
         + pert_distT1*T + pert_distT2*T^2 + pert_distT3*T^3)

// Rectangular ecliptic (of date)
x0 = r * cos(longM) * cos(latM)
y0 = r * sin(longM) * cos(latM)
z0 = r * sin(latM)

// Precession to J2000.0 ecliptic
P = 0.10180391e-4*T + 0.47020439e-6*T^2 - 0.5417367e-9*T^3
    - 0.2507948e-11*T^4 + 0.463486e-14*T^5
Q = -0.113469002e-3*T + 0.12372674e-6*T^2 + 0.12654170e-8*T^3
    - 0.1371808e-11*T^4 - 0.320334e-14*T^5
sq = sqrt(1 - P^2 - Q^2)

p11 = 1-2*P*P     p12 = 2*P*Q      p13 = 2*P*sq
p21 = 2*P*Q       p22 = 1-2*Q*Q    p23 = -2*Q*sq
p31 = -2*P*sq     p32 = 2*Q*sq     p33 = 1-2*P*P-2*Q*Q

X = p11*x0 + p12*y0 + p13*z0
Y = p21*x0 + p22*y0 + p23*z0
Z = p31*x0 + p32*y0 + p33*z0

return {X, Y, Z, rGeo: r}
```

## mod2pi(x)
Restricts x to [-PI, PI):
```
mod2pi(x) = x - 2*PI * floor((x + PI) / (2*PI))
```

## Key Notes for TypeScript Port

1. All angles in radians throughout
2. Main problem: 4 integer multipliers (D,F,L,Lp)
3. Perturbation: 13 integer multipliers + phase offset
4. Lon/lat main problem uses sine; distance uses cosine
5. ALL perturbation series use sine
6. Distance perturbations NOT wrapped in mod2pi when multiplied by T powers
7. Output is X,Y,Z in km (J2000.0 mean ecliptic)
8. For ecliptic lon/lat/dist: extract longM, latM, r before precession
9. ra0 = 384747.961370173/384747.980674318 (reference radii ratio)
10. The generated JS uses truncated series (fewer terms), controlled by AthU/AthV/AthR/tau
