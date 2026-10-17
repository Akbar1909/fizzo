import type { FreeFallParams } from "@/lib/content-types";
import type { AnimationDefinition, SceneProps } from "./types";
import { FreeFallScene } from "./free-fall-scene";
import { fmt, GRAVITY } from "./format";

// FreeFallScene is a self-contained, continuously interactive simulation
// (play/pause/scrub/drag), not a discrete captioned walkthrough - it ignores
// `step` entirely. This adapter exists only so `free-fall` fits the shared
// `AnimationDefinition` registry shape; the actual practice flow renders
// FreeFallScene directly instead of going through AnimationPlayer's
// step-by-step chrome, since that chrome doesn't make sense for a scene
// with its own built-in controls.
function FreeFallSceneAdapter({ params }: SceneProps<FreeFallParams>) {
  return <FreeFallScene initialHeight={params.height} />;
}

function steps(params: FreeFallParams) {
  const fallTime = Math.sqrt((2 * params.height) / GRAVITY);
  return [
    {
      title: "Erkin tushish",
      caption:
        "Jism boshlang'ich tezliksiz tushadi, faqat tortishish tezlanishi (g) ta'sirida harakatlanadi. Istalgan lahzadagi holatni ko'rish uchun slayderni suring yoki \"Boshlash\"ni bosing.",
      formula: `h_0 = ${fmt(params.height)}\\ \\text{m},\\quad t_{tushish} = \\sqrt{\\dfrac{2h_0}{g}} \\approx ${fmt(fallTime)}\\ \\text{s}`,
    },
  ];
}

export const freeFallDefinition: AnimationDefinition<FreeFallParams> = {
  Scene: FreeFallSceneAdapter,
  steps,
};
