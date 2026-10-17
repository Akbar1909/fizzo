import type { ComponentType } from "react";
import type { FigureParams } from "@/lib/content-types";

export interface AnimationStep {
  title: string;
  caption: string;
  formula?: string;
}

export interface SceneProps<P extends FigureParams> {
  params: P;
  step: number;
}

export interface AnimationDefinition<P extends FigureParams = FigureParams> {
  Scene: ComponentType<SceneProps<P>>;
  steps: (params: P) => AnimationStep[];
}
