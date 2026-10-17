import type { FigureParams, FigureTemplate } from "@/lib/content-types";
import { ANIMATION_REGISTRY } from "./registry";

export function StaticFigure({
  template,
  params,
}: {
  template: FigureTemplate;
  params: FigureParams;
}) {
  const Scene = ANIMATION_REGISTRY[template].Scene;
  return (
    <div
      className="figure-box"
      style={{
        borderRadius: 16,
        border: "1px solid var(--line)",
        background: "var(--surface)",
        padding: 12,
      }}
    >
      <Scene params={params} step={0} />
    </div>
  );
}
