import { codeToHtml } from "shiki";
import { createResource, onCleanup, createEffect } from "solid-js";

const CodeBlock = (props: {
  code: string;
  lang: string; 
  class?: string;
}) => {
  let containerRef!: HTMLDivElement;

  // Fetch the highlighted HTML
  const [html] = createResource(async () => {
    return (await codeToHtml(props.code, {
      lang: props.lang,
      theme: "catppuccin-mocha",
    })) as string;
  });

  // Clear previous HTML before setting new content
  onCleanup(() => {
    if (containerRef) containerRef.innerHTML = "";
  });

  // Render the highlighted HTML
  createEffect(() => {
    if (html() && containerRef) {
      containerRef.innerHTML = html() as string;
    }
  });

  return (
    <div
      class={props.class}
      ref={containerRef}
    ></div>
  );
};

export default CodeBlock;