import type { FigureTemplate } from "@/lib/content-types";
import type { AnimationDefinition } from "./types";
import { inclineDefinition } from "./incline";
import { atwoodDefinition } from "./atwood";
import { tablePulleyDefinition } from "./table-pulley";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ANIMATION_REGISTRY: Record<FigureTemplate, AnimationDefinition<any>> = {
  incline: inclineDefinition,
  atwood: atwoodDefinition,
  "table-pulley": tablePulleyDefinition,
};
