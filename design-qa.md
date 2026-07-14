# Envelope cover design QA

## Source visual truth

- Motion reference: `/Users/joshua/Downloads/ScreenRecording_07-12-2026 17-50-13_1.MP4`
- Reference states: `/Users/joshua/Downloads/IMG_0236.PNG`, `IMG_0237.PNG`, `IMG_0238.PNG`, `IMG_0239.PNG`
- User-supplied envelope panels: `/Users/joshua/Documents/JM Wedding RSVP/public/envelope left panel.png`, `envelope top panel.png`, `envelope right panel.png`, `envelope bottom panel.png`
- User-supplied wax seal: `/Users/joshua/Downloads/J&M Seal Wax.png`

## Rendered evidence

- Implementation: `http://localhost:3000`
- Viewport: 390 × 844, portrait
- Closed state: `/tmp/jm-envelope-analysis/final-v2-closed-mobile.png`
- Seam-overlap verification: `/tmp/jm-envelope-analysis/panels-overlapped-closed.png`
- Final seamless closed state: `/tmp/jm-envelope-analysis/magic-overlay-closed-final.png`
- Final direct-homepage opening state: `/tmp/jm-envelope-analysis/magic-overlay-opening-final.png`
- Partial-open state: `/tmp/jm-envelope-analysis/final-v3-mid-mobile.png`
- Revealed homepage: `/tmp/jm-envelope-analysis/final-v2-home-mobile.png`
- Closed comparison: `/tmp/jm-envelope-analysis/final-v2-closed-comparison.png`
- Partial-open comparison: `/tmp/jm-envelope-analysis/final-v3-mid-comparison.png`

## Findings

- No actionable P0, P1, or P2 issues remain.
- The envelope fully covers the 390 × 844 viewport while intentionally cropping its outer edges, matching the requested cover behavior.
- The supplied embossed panels are used as separate aligned raster layers on a shared 1045 × 1803 cropped canvas. Their paper texture, relief, and floral detail remain visible.
- The closed state uses deliberate side-panel overlap, with the top and bottom panels separated visually by directional shadows instead of exposed backing.
- Final refinement moves the side panels 5% inward, removes the opaque envelope backing, retains top/bottom separation through directional shadows, and overfills the stage to 104vw/102dvh so no side bars are visible.
- The opening gap now reveals the live homepage directly. A warm radial interior glow sits between the homepage and the four moving panels without replacing the content.
- The skip-intro control has been removed. The wax halo and interior light remain completely dormant until the guest activates the seal.
- The top panel and wax seal share one transform, so the seal lifts with the flap. The top panel stops at 44 degrees while the side and bottom panels move only 18 degrees before the cover transitions away.
- The stage keeps the same dimensions throughout interaction; no click-triggered scale reduction occurs.
- The invitation-card layer was removed. The live homepage remains underneath the fixed cover and is revealed directly when the cover fades.
- The hero and welcome decorations now use photographic white-flower and eucalyptus cutouts rather than CSS-drawn flowers.

## Required fidelity surfaces

- Fonts and typography: homepage typography is unchanged; envelope controls remain readable at mobile size.
- Spacing and layout: envelope centre and seal remain at the viewport centre; the stage overflows symmetrically to prevent background gaps.
- Colors and tokens: panel backing was matched to the supplied warm ivory-pink paper so seams read as light folds rather than exposed background.
- Image quality: the supplied 1545 × 2000 panels were non-destructively cropped into aligned production assets. Realistic floral cutouts retain alpha transparency and were optimized to 512 × 768.
- Copy and content: no invitation copy is baked into the cover; the homepage remains the single content source.

## Interaction validation

- Mouse/touch seal activation: passed
- Enter key activation: passed
- Skip intro: removed as requested
- Repeated-click guard: passed
- Focus transfer to `#invitation-hero`: passed
- Scroll lock and restoration: passed
- Reduced-motion fallback: implemented
- Runtime console errors: none
- Desktop 1440 × 900 full-cover calculation: passed

## Comparison history

1. Earlier implementation showed a centred full envelope, opened all panels completely, shrank during interaction, revealed a separate invitation card, and left the seal independent of the top flap.
2. Rebuilt the intro as a full-viewport overlay, removed the card, attached the seal to the top flap, shortened the timeline to 2.18 seconds, and transitioned directly to the homepage.
3. Replaced the vector envelope with the four supplied embossed panels, aligned them on one shared crop, and matched the backing color.
4. Reduced the top rotation from 72 to 44 degrees to keep the seal readable, then added restrained 18-degree side and bottom movement to match the reference's partial-open phase.
5. Post-fix browser evidence confirms stable stage dimensions, partial panel motion, direct homepage reveal, focus restoration, and no console errors.
6. Tightened the closed assembly with four-way overlap and verified the diagonal and centre joins at 390 × 844 with no visible gaps.
7. Removed the opaque internal backing, increased side overlap to 5%, added directional flap shadows, strengthened the seal/interior glow, removed Skip intro, and verified direct homepage visibility through the opening with no edge bars.
8. Replaced the former broad/diamond-shaped light treatment with two soft, blurred diagonal seam leaks. The light begins only after activation, uses a restrained 2.7-second wax pulse, and the opening timeline now takes 3 seconds. The cue was moved below the seal and its thin arrow now points upward.
9. Moved “Where we’ll gather” immediately after the welcome section, added Takun Retreat Club location copy and a Maps link, and removed the superseded venue, gifts, dinner-selection preview, and duplicate venue sections from the public flow.
10. Increased the visibility of the warm seam light while keeping its diagonal, blurred leak shape; replaced the chapter-divider dot with a cropped real white bloom; renamed the location section and simplified its copy and map action. The calendar action is no longer public.
11. The chapter bloom now uses a dedicated, transparent real-flower crop without a circular frame. The revised opening uses a full-screen warm bloom after activation, restrained side/bottom panel motion, and a top-flap-led reveal. Ten low-density white petals drift over the invitation with varied timing.
12. Replaced the divider image with the supplied transparent white-flower composition. The full-screen opening bloom now sits underneath every envelope panel, keeping the ivory paper, embossing, and folds unobscured while it continues to soften the page through the opening gaps.
13. The seam light has also been moved below the panel artwork. The bloom reaches full strength immediately on activation, while the 2.15-second top-flap motion reveals it progressively; the transition now completes at just over 3 seconds without a held open state.
14. Glow layers now live outside the transformed 3D envelope stack and behind its z-index, ensuring they cannot overlay the left, right, bottom, or top panels. The circular wax halo and ring have been removed.
15. Moved the left and right panel layers outward (including their restrained open state) to protect the outer mobile viewport from the live homepage peeking through.
16. Reduced the wax seal shadow to a small warm paper contact shadow in both idle and opening states, removing the dark frame effect beneath it.
17. Enlarged the responsive scene to at least 118vw and a 118dvh-derived aspect-safe width, deliberately cropping the envelope beyond mobile edges. The side panels were brought inward to preserve a sealed, full-cover composition.
18. Added a server-rendered intro gate that hides the RSVP story until `intro-complete` is set. This prevents slow device hydration or asset loading from flashing the landing page under the cover.
19. Preserved the original panel-based intro in `app/components/EnvelopeIntro.backup.tsx`. The supplied 496 × 864, 4-second GIF is retained as source and was converted into a 389 KB, 5.28-second H.264 playback asset for much faster loading and controllable tap-to-start behavior. A static first frame holds before activation; a full white transition begins during the final 460 ms, then releases into the live landing page.
20. Added a cached-image readiness check to the GIF cover. A hard refresh can no longer miss React’s image load event and remain on the loading screen indefinitely.

## Follow-up polish

- P3: the source is a social-media recording of a phone, so its device frame, reflections, and recording perspective are intentionally excluded from the webpage.
- P3: exact motion curves cannot be extracted from the recorded site; the implementation matches the visible sequence with a tuned cubic easing approximation.

final result: passed
