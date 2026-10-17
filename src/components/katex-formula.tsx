import katex from "katex";

export function KatexFormula({
  formula,
  display = false,
}: {
  formula: string;
  display?: boolean;
}) {
  const html = katex.renderToString(formula, {
    throwOnError: false,
    strict: false,
    displayMode: display,
  });
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
