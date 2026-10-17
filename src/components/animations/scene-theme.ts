/**
 * Single source of truth for every animation scene's visual language:
 * colors, stroke weights, fonts, sizes, motion timing. Scenes pull from
 * here instead of picking their own ad-hoc values, so incline/atwood/
 * free-fall/... all read as the same design system.
 *
 * Colors reference the app's existing CSS custom properties (globals.css)
 * rather than raw hex, so light/dark mode keeps working for free. Each
 * physical quantity has exactly one color, used the same way in every
 * scene: velocity is always teal, acceleration always green, force always
 * blue - never reassigned per scene.
 */
export const sceneTheme = {
  color: {
    background: "var(--surface)",
    ink: "var(--ink)",
    muted: "var(--quiet)",
    grid: "var(--line)",
    gridSoft: "var(--line-soft)",
    accent: "var(--accent)",
    velocity: "var(--quantity-velocity)",
    acceleration: "var(--good)",
    force: "var(--force-normal)",
  },
  stroke: {
    object: 2.5,
    vector: 2.5,
    grid: 1,
    ruler: 1.5,
    ground: 2,
  },
  font: {
    ui: "var(--font-ui)",
    math: "var(--font-math)",
    label: 12,
    value: 13,
    heading: 14,
  },
  motion: {
    // UI chrome only (panels, controls) - never the physical object itself,
    // which must move by integrating its equation of motion every frame.
    panelEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
    panelDurationMs: 200,
  },
} as const;
