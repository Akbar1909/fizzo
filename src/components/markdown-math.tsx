import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const rehypeKatexOptions = { throwOnError: false, strict: false };

/** `inline` strips the wrapping <p>, so the output can sit inside a <button>, <span>, etc. */
export function MarkdownMath({ children, inline = false }: { children: string; inline?: boolean }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[[rehypeKatex, rehypeKatexOptions]]}
      components={inline ? { p: ({ children: c }) => <>{c}</> } : undefined}
    >
      {children}
    </ReactMarkdown>
  );
}
