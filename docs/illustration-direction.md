# Illustration direction

Direction for a full redraw of every illustration on the page, derived from a random seed. Illustrators draw from this;
nothing here is optional. Every fill stays a token defined in `src/layouts/Base.astro`.

## What is wrong with the current set

- **The frog is stock.** Round body, two symmetric domed circles, a smile arc. Any mascot from any icon
  pack. No age, no weight, no attitude, no detail you could name.
- **Everything is centred and mirrored** — hero, icons and all five scenes sit on the vertical axis, so nothing has a
  direction of travel and nothing has energy.
- **They are diagrams, not pictures.** Dashed outlines, a cross in a circle, three clones in a ring: the reader decodes
  a chart instead of watching something happen.
- **No light, no depth.** Shading is `opacity: 0.5` of a lighter green smeared over a shape; nothing casts a shadow or
  sits on anything; one plane per scene, nothing cropped by the frame.
- **Props are tiny and timid** — a fifth of the tile, in a corner, the same frog six times with a different sticker; at
  48px five of the six are indistinguishable.
- **Line weight is arbitrary**: 1.6 / 2 / 2.2 / 2.4 / 3 / 3.2 / 3.4 / 3.5 / 4 / 5 / 6 / 7 across the set, unrelated to
  each asset's scale. And dark mode is a colour swap: mid-greens sink into the forest ground, the grey props die.

## Style statement

**Cut-paper flat: solid shapes, one shade and one highlight per form, a single light from the upper left,
no outlines — drawing is done by silhouette and shadow, never by contour.**

## Character sheet

- **Proportions.** Head 1.15× the body's width, 0.8× its height; total height ≈ 2.6 head heights. Chunky and grounded,
  not chibi. The spine is always a C-curve, the weight always on one side.
- **Eyes.** Two turrets rising *out of* the skull — its top edge passes behind them — not discs pasted on a face. Eye
  width 0.42 of head width. In three-quarter view the near eye is 8% larger and overlaps the head's edge; they are
  never a matched pair. **Pupil:** a horizontal bar, never round or vertical — the biggest read change from the current
  frog, required in every asset showing an eye above 24px.
- **Mouth.** One asymmetric line, higher on the near side. Range: attentive (default), focused squint, delight (open,
  tongue tip), mid-leap (open wide), flat (working).
- **Hands and feet.** Mitten masses with three sticky pads. **Signature:** one pad is always in contact with the scene
  — a leaf edge, a block, a rope. The frog never floats. **Second signature:** a darker dorsal stripe from between the
  eyes down the spine, splitting at the hips, which also tells the reader which way the body is turned.
- **Poses.** Always three-quarter, never front-on. Hero and the six icons must not repeat a pose.

## Style rules

- Every form: one base shape, one **shade** shape lower-right, one **highlight** sliver upper-left — the highlight only
  on a scene's two largest forms. No gradients but the hero's wash. `opacity` is never a shading device.
- **Light** is one source, upper left, ~35° above the horizon, identical in every asset. Anything touching a surface
  drops a contact shadow: an `--art-shade` ellipse at 0.35, offset down-right. Two objects in a scene may not shadow in
  different directions.
- **Line weights** are three steps per asset scale — detail / feature / signature: hero `3 / 5 / 8`; scenes
  `2 / 3.2 / 5`; icons `1.6 / 2.4 / 3.6`; code-bar mark `1 / 1.6 / 2.4`. No other value anywhere; round caps and joins.
- **Composition.** Subject mass on a third-intersection, counterweight on the opposite third, ≥50%
  negative space, everything on one diagonal. Three planes: a background wash, the midground subject, and
  a foreground element at ~1.35× the subject's scale **cropped by the frame** — the crop is mandatory, it
  is what turns a diagram into a picture. **Banned:** dashed outlines, X marks, arrows, ghost
  placeholders, mirrored pairs, anything centred. If a scene needs a legend, it is the wrong scene.

## Token map

Skin `--art-frog`; shade side `--art-shade` (new); lit side `--art-frog-light`; under-forms
`--art-frog-dark`; belly and throat `--art-belly`; pupil bar and nostrils `--art-ink`; eye `--art-eye`
shaded with `--art-eye-dark`; catchlight `--art-shine`. Environment: foliage `--art-leaf` /
`--art-leaf-light`, water and everything below the surface `--art-water` (new), background wash
`--art-disc` / `--art-disc-core` with `--art-disc-edge`, discarded things `--art-grey`, plug-in tiles
`--art-tile`. One warm accent per scene, `--art-warm` (new): never on skin, never over 8% of a scene.

| new token | light | dark | role |
| --- | --- | --- | --- |
| `--art-shade` | `#04512c` | `#0a8f4a` | the shadow side of every green form, and contact shadows |
| `--art-water` | `#4f9683` | `#2a6f62` | water, and anything seen through or below the surface |
| `--art-warm` | `#a35a12` | `#ffd08a` | the one warm accent: lamplight, a lit gap, a spark |

All three are fills, never text. Each carries shape a reader must make out, so each clears 3:1 on `--bg`
and `--surface` (light 8.7 / 3.2 / 4.8, dark 4.5 / 3.2 / 13.0). Dark is not an inversion: `--art-warm` is
an ochre shadow tone in light mode and lamplight in dark.

## Asset briefs — scene, then **must-have**

- **HeroArt** (320×280; the wrapper owns the width). The frog crouched on the near rim of a lily pad low and right in a
  lit disc, twisted back over its shoulder at the headline, one hand gripping the pad. **Must-have:** the twist —
  shoulders away, head back, dorsal stripe showing the rotation — plus one big leaf cropped by the left edge in front
  of the pad, and a water plane with the pad's mass visible below it.
- **SectionIcon** (48×48, six tiles; one silhouette each, prop ≥40% of the tile and cropped by an edge). `template`:
  stepping out through a leaf-shaped frame standing behind it. `language`: perched on the crossbar of a lambda running
  corner to corner. `tooling`: hauling a gear over its shoulder, gear cropped bottom right. `backend`: atop three slabs
  whose base is cropped by the bottom edge, one `--art-warm` status light. `ai`: reaching up to a four-point spark
  cropped top right, lit by it. `devops`: mid-leap along the diagonal, chevrons trailing off bottom left.
  **Must-have:** each reads from silhouette alone at 48px with the prop removed; no two poses repeat.
- **BenefitArt** (240×180). `direct-style`: airborne on one clean arc over open water to the next pad, legs extended,
  the same route knotted into a grey tangle behind — **must-have:** it is off the ground, and the tangle is a
  background plane, not a doodle. `type-safety`: a wrong-shaped piece slamming into a leaf-gate and rebounding with an
  impact ring, the right piece already through and lit warm below — **must-have:** a collision, not a symbol.
  `mature-platform`: the frog on a broad stone pier whose bulk continues far down through the water plane —
  **must-have:** the underwater mass is drawn; that depth *is* the argument. `structured-concurrency`: a parent on the
  rim holding three taut lines down to three small frogs on one pad, one already reeling in — **must-have:** physical
  tethers from one hand, not clones in a ring. `no-lock-in`: lifting one block clear out of a standing row, the gap it
  left glowing warm, a broken chain link large in the cropped foreground — **must-have:** the row stays up and the
  lifted block is whole.
- **Divider.** One off-centre leaf sprig with two water rings spreading from where it meets the surface, the rule
  passing *behind* it and fading to both edges. **Must-have:** asymmetry, and one ring crossing the rule so the sprig
  sits in the page rather than on it.
- **CodeBar mark** (66×24). A three-quarter head cropped by the bar's lower edge, looking over it into the panel.
  **Must-have:** a crop of the character, not a face on a circle; both eye turrets read at 22px.
- **favicon.svg** (64×64) and its PNG exports. Head only, three-quarter, one shade shape, no mouth. **Must-have:** the
  two-turret-plus-skull silhouette survives at 16px; amber is the only non-green in the mark.
- **og.svg** (1200×630) and `og.png`. The hero scene opened out wide, subject on the right third, water and empty sky
  on the left two thirds for the title. **Must-have:** every token written out as its light-mode literal, the new three
  included — a share image inherits no CSS.

## Quality bar — a reviewer rejects the asset if

1. It is bilaterally symmetric, or its subject sits on the centre line.
2. Nothing is cropped by the frame, or the scene has fewer than three depth planes.
3. A form lacks its shade shape, or two objects cast shadows in different directions.
4. A stroke weight is not one of the three values listed for that asset's scale.
5. The frog reads front-on, has two identical eyes, or has round pupils.
6. A prop is under a third of the frog, or an icon fails to read at 48px on a 1× screen.
7. The scene explains itself with arrows, dashed ghosts or an X instead of showing an action.
8. A hex appears outside `Base.astro`, or a fill is not one of the tokens above.
9. In dark mode the subject sinks into the ground, or the warm accent is the brightest thing twice.
10. Any two assets disagree about how the frog is built. One character, one light, one weight scale.
