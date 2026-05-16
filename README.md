# Vesak Verse 26 — IEEE

**Where Tradition Meets the Glow of Innovation**

An interactive digital art piece celebrating Vesak through code — blending Sri Lankan tradition with creative technology.

## What's Inside

- 🌙 **Animated Night Canvas** — Stars, aurora, moon with craters & god rays, shooting stars
- ⛰️ **Mountain Village** — 8 houses with smoking chimneys & flickering windows, a Bo tree, glowing mushrooms
- 🛕 **Dagoba / Stupa** — Traditional Buddhist monument with oil lamps
- 🏮 **Multi-Style Vesak Lanterns (Kuduwa)** — Atapattam, Tharuka (star), Nelum (lotus), and Cyber (holographic)
- 🪷 **SVG Lotus Flower** — 5 layers of petals with dew drops, pollen, dragonfly, ladybug, honeybee, frog, snail, butterfly
- 💧 **Reflective Water** — Moon reflection, ripples, fish splashes, floating petals, fireflies, mist

## Tech Stack

- Next.js 16 + React 19 + TypeScript
- HTML5 Canvas (2D rendering)
- SVG (detailed vector illustration)
- Tailwind CSS v4

## Theme

> *Tradition meets the glow of innovation*

This piece honors Vesak — the most sacred Buddhist festival in Sri Lanka — by reimagining its iconic elements (kuduwa lanterns, lotus flowers, dagobas) through digital art and creative coding.

## Technical Approach

### Architecture
This artwork is built as a **two-layer composite**:
1. **Canvas Layer** — Procedurally generated animated scene (sky, mountains, village, water, lanterns, dagoba)
2. **SVG Layer** — Hand-coded vector illustration (lotus flower with creatures) overlaid on the canvas

### Canvas Rendering Pipeline
- **60fps animation loop** via `requestAnimationFrame`
- All elements drawn procedurally using HTML5 Canvas 2D API (no images, no assets)
- Dynamic resize: canvas internal resolution matches its CSS display size for crisp rendering on all screens
- Responsive 1:1 square stage via `min(100vw, 100vh)`

### Procedural Elements
| Element | Technique |
|---------|-----------|
| Stars | 120 particles with individual phase, speed, and color |
| Moon | Multi-layer radial gradients + craters + god rays |
| Mountains | Sine-wave terrain generation with multiple octaves |
| Village houses | Parametric drawing function with randomized windows, chimneys, smoke |
| Water | Reflected treeline, star reflections, moon shimmer segments, animated wave lines |
| Fireflies | 25 agents with velocity, phase-based pulsing, and water reflection |
| Vesak lanterns | 4 styles: Atapattam (bipyramid), Tharuka (star), Nelum (lotus petals), Cyber (wireframe) |
| Dagoba | Bezier-curve dome + stacked spire rings + pulsing crystal glow |

### SVG Illustration
- **5 layers of lotus petals** (9 + 8 + 7 + 6 + 5) with radial gradients, vein lines, and iridescent overlays
- **24 stamens** with pollen dust particles
- **Seed pod** with 18 seeds in concentric rings
- **6 creatures**: dragonfly, ladybug, honeybee, frog, snail, butterfly
- **Dew drops** with rainbow caustics and specular highlights
- All gradients, filters, and effects defined inline in `<defs>`

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in any modern browser.

---

*Submitted for IEEE Vesak Verse 26 — AI Digital Art Competition*
