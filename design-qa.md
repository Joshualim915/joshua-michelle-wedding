# Envelope intro design QA

## Sources

- Motion reference: `/Users/joshua/Downloads/ScreenRecording_07-12-2026 17-50-13_1.MP4`
- State references: `/Users/joshua/Downloads/IMG_0236.PNG`, `IMG_0237.PNG`, `IMG_0238.PNG`, `IMG_0239.PNG`
- Implementation: `http://localhost:3000`
- Selected wax seal: `/Users/joshua/Downloads/J&M Seal Wax.png`
- Updated implementation screenshot: `/tmp/jm-envelope-analysis/final-wax-seal-mobile.png`
- Focused source/render comparison: `/tmp/jm-envelope-analysis/wax-seal-comparison.png`

## Validation matrix

| Viewport | State | Result |
| --- | --- | --- |
| 390 × 844 | idle, opening, opened, complete | Pass |
| 844 × 390 | idle, skip | Pass |
| 1440 × 900 | idle | Pass |

The 390 × 844 implementation was compared against closed, partial-open, and full-open frames extracted from the supplied video. The envelope geometry, X-shaped flap reveal, retained lifted seal, warm internal light, card rise, and forward transition follow the same major motion phases.

The replacement seal was checked in the closed-envelope state at 390 × 844. Full-view evidence confirms its position, tap clearance, contrast, and scale remain consistent with the composition. The focused side-by-side comparison confirms the supplied transparent PNG is used directly, with its organic outline and native 640:594 proportion intact. No further focused region was required because this change affects only the seal asset.

## Interaction and accessibility

- Tap/click: pass
- Enter key: pass
- Skip intro: pass
- Focus transfer to `#invitation-hero`: pass
- Scroll locking and restoration: pass
- Reduced-motion fade path: implemented
- Runtime console errors: none

## Findings

- No P0–P2 issues remain.
- P3 approximation: the reference uses highly detailed embossed floral paper and photoreal lighting. The implementation uses lightweight static SVG grain, edge shading, and editable vector botanicals to preserve mobile performance and the requested editable asset system.
- P3 source limitation: the reference is a social-media recording of a phone, so exact site viewport proportions and original easing curves cannot be recovered. Timing was matched to the visible sequence rather than the social-player chrome.

## Build verification

- `npm run build`: pass
- `npm test`: 5/5 pass
- `npm run lint`: pass with existing/intentional `<img>` optimization warnings; SVG layers intentionally remain plain images because they are preloaded, decorative, and animated as independent compositing layers.

## Comparison history

- Initial seal replacement rendered inside a square button box. The wax artwork itself was not visibly distorted because it used `object-fit: contain`, but the interaction box did not match the supplied asset ratio.
- Fixed `.wax-trigger` to use `aspect-ratio: 640 / 594`, then reloaded and recaptured the 390 × 844 closed state.
- Post-fix evidence reports a 95.7 × 88.9 px rendered box, matching the source ratio, with no console errors.

final result: passed
