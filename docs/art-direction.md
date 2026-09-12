# Art direction

Every illustration is a transparent PNG exported at exactly 2x its CSS size: rendered on a solid
`#0f2418` ground and keyed to transparency by the finishing script, so the subject and its soft
shadow sit directly on the page. `docs/design-direction.md` still governs the interface; this file
governs the images.

## Theme

Trees and plants. Clean 3D computer graphics: sharp, simple, a product-render look under soft studio
light. VirtusLab greens, warm wood, pale `#f4efe6` as a light material, rendered on a solid `#0f2418`
ground that is keyed out, leaving only the subject and its contact shadow. No text, logos, people,
animals or mascots.

## Assets

| file | PNG | shown at | depicts |
| --- | --- | --- | --- |
| `public/art/hero.png` | 640×640 | 320×320 | the Scala logo as three stacked wooden bars, one long winding branch growing from the top |
| `public/art/benefit-direct-style.png` | 640×480 | 320×240 | "One straight stem" |
| `public/art/benefit-type-safety.png` | 640×480 | 320×240 | "Fitted seed pods" |
| `public/art/benefit-mature-platform.png` | 640×480 | 320×240 | "Rings and sapling" |
| `public/art/benefit-structured-concurrency.png` | 640×480 | 320×240 | "Scoped branches" |
| `public/art/benefit-no-lock-in.png` | 640×480 | 320×240 | "Swappable branches" |
| `public/art/icon-template.png` | 128×128 | 64×64 (`--icon`) | seed tray with three seedlings |
| `public/art/icon-language.png` | 128×128 | 64×64 | a single veined leaf |
| `public/art/icon-tooling.png` | 128×128 | 64×64 | pruning shears and a clipped twig |
| `public/art/icon-backend.png` | 128×128 | 64×64 | trunk with spreading roots |
| `public/art/icon-ai.png` | 128×128 | 64×64 | fern fiddlehead spiral |
| `public/art/icon-devops.png` | 128×128 | 64×64 | trellis with a climbing vine |
| `public/art/divider.png` | 640×96 | 320×48 | a horizontal branch with leaves |
| `public/art/codebar.png` | 132×44 | 66×22 (`--mark`) | a three-leaf sprig |
| `public/og.png` | 1200×630 | share card | the hero render plus the title set in Montserrat, on the page colour `#07160f` |
| `public/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` (180) | — | favicons | the slab mark of the hero, branch left out, on a `#07160f` tile |

## Process

Everything lives in `scripts/art/`: `theme.md` is the block every prompt starts with, `prompts/<asset>.md`
the subject of each image, `gen.sh <asset> <WxH>` one render through the Codex CLI's image tool into
the git-ignored `gen/`, and `finish.py <asset>...` the step from a raw render to `public/`: centre-crop
to the target aspect, Lanczos-resize to 2x; the divider and code bar are first cropped around the
subject's bounding box after keying. `og` composes the hero render with the title in Montserrat
and `favicons` cuts the slab mark of the hero onto a `#07160f` tile (both need the two variable fonts
in `fonts/`, see the script). Renders come out at 1024 or 1536 on the long side.

- `finish.py` keys the ground out: alpha comes from each pixel's colour distance to the ground, the
  ground's contribution is un-mixed from the colour, and only regions connected to the border are
  keyed, so interior pixels near the ground colour stay opaque.

Each benefit concept came from a fresh ideation agent given only the theme, the subject and a
random-string inspiration procedure; a critique agent then revised it. The prompt files are the
result.

## Acceptance

- Reads at its final CSS size.
- One subject, nothing else in the frame.
- Rendered on the solid ground, nothing touching the frame edge except the divider's branch.
- No text.
- On theme: trees and plants, the render look, the palette.
