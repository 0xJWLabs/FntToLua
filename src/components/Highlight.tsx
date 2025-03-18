import { codeToHtml } from "shiki";
import { createResource, onCleanup, createEffect, createSignal } from "solid-js";

const CodeBlock = (props: { code: string; lang: string; class?: string }) => {
  let containerRef!: HTMLDivElement;
  const [copied, setCopied] = createSignal(false);

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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(props.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div class="ml-2 mr-2 mt-2 contain-inline-size relative border border-(--ctp-mocha-surface0) rounded-lg bg-[#1e1e2e] overflow-hidden">
      {/* Header with Language on the Left and Buttons on the Right */}
      <div class="flex items-center px-4 py-1 bg-(--ctp-mocha-surface0) border-b border-(--ctp-mocha-surface0) text-sm">
        <span class="text-[#a6adc8]">{props.lang}</span>
        <div class="flex gap-2 ml-auto">
          {/* Copy Button */}
          <div class="relative group">
            <button
              onClick={copyToClipboard}
              class="flex gap-1 items-center select-none px-4 py-1 text-[#a6adc8]"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-xs">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7 5C7 3.34315 8.34315 2 10 2H19C20.6569 2 22 3.34315 22 5V14C22 15.6569 20.6569 17 19 17H17V19C17 20.6569 15.6569 22 14 22H5C3.34315 22 2 20.6569 2 19V10C2 8.34315 3.34315 7 5 7H7V5ZM9 7H14C15.6569 7 17 8.34315 17 10V15H19C19.5523 15 20 14.5523 20 14V5C20 4.44772 19.5523 4 19 4H10C9.44772 4 9 4.44772 9 5V7ZM5 9C4.44772 9 4 9.44772 4 10V19C4 19.5523 4.44772 20 5 20H14C14.5523 20 15 19.5523 15 19V10C15 9.44772 14.5523 9 14 9H5Z" fill="currentColor"></path>
              </svg>
              {copied() ? "Copied" : "Copy"}
            </button>

            {/* Tooltip */}
            <div class="absolute left-1/2 -translate-x-1/2 top-full mt-3 px-4 py-2 text-sm font-medium rounded-lg bg-[#11111B] border border-(--ctp-mocha-surface0) text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-4 h-4 bg-[#11111B] rotate-45"></div>
              Copy
            </div>
          </div>

          {/* Save Button */}
          <div class="relative group">
            <button
              onClick={copyToClipboard}
              class="flex gap-1 items-center select-none px-4 py-1 text-[#a6adc8]"
            >
              <svg class="icon-xs" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h11.175q.4 0 .763.15t.637.425l2.85 2.85q.275.275.425.638t.15.762V19q0 .825-.587 1.413T19 21zM19 7.85L16.15 5H5v14h14zM12 18q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-5-8h7q.425 0 .713-.288T15 9V7q0-.425-.288-.712T14 6H7q-.425 0-.712.288T6 7v2q0 .425.288.713T7 10M5 7.85V19V5z" />
              </svg>
              Save
            </button>

            {/* Tooltip */}
            <div class="absolute left-1/2 -translate-x-1/2 top-full mt-3 px-4 py-2 text-sm font-medium rounded-lg bg-[#11111B] border border-(--ctp-mocha-surface0) text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-4 h-4 bg-[#11111B] rotate-45"></div>
              Save
            </div>
          </div>
        </div>
      </div>

      {/* Code Container */}
      <div ref={containerRef} class={`p-4 text-sm overflow-x-auto ${props.class} bg-(--ctp-mocha-mantle)`}></div>
    </div>
  );
};

export default CodeBlock;