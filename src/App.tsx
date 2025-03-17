import { createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { debug } from "@tauri-apps/plugin-log";
import "./App.css";
import { Icon } from "@iconify-icon/solid";
import FntFile from "./widgets/Fnt";
import Highlight from "./components/Highlight";

function App() {
  const [fntContent, setFntContent] = createSignal("");
  const [output, setOutput] = createSignal("");

  async function readFile(filePath: string) {
    const content = await readTextFile(filePath);
    setFntContent(content);
  }

  async function selectFile() {
    const filePath = await open({ filters: [{ name: "FNT", extensions: ["fnt"] }] });
    if (!filePath) return;
    debug(filePath);
    await readFile(filePath);
  }

  async function parseFnt() {
    const lua = await invoke<string>("parse_fnt", { content: fntContent() });
    setOutput(lua.trim());
  }

  return (
    <main class="container">
      <h1>Welcome to Fnt to Lua Converter</h1>

      <div class="row">
        <FntFile class="logo fnt" width={"128"} height={"128"} />
        <Icon class="logo arrow" inline icon="line-md:arrow-small-right" width="128" height="128" />
        <Icon class="logo lua" inline icon="file-icons:lua" width="128" height="128" />
      </div>

      <div class="column">
        <button onClick={selectFile} class="p-2 border">📂 Select .fnt File</button>
        {fntContent() && <button onClick={parseFnt} class="p-2 ml-2 border">⚡ Convert</button>}
      </div>

      {output() && <Highlight lang="lua" code={output()} class="output" />}

      <footer>
        <p>Copyright © 2025 robloxjw02. All rights reserved.</p>
      </footer>
    </main>

  );
}

export default App;
