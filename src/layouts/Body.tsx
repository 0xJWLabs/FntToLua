import { createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { debug } from "@tauri-apps/plugin-log";
import "../App.css";
import Highlight from "../components/Highlight";
import FileIcon from "../components/FileIcon";

function Body() {
    const [fntContent, setFntContent] = createSignal("");
    const [output, setOutput] = createSignal("");

    async function readFile(filePath: string) {
        const content = await readTextFile(filePath);
        setFntContent(content);
    }

    async function selectFile() {
        setFntContent("");
        setOutput("");
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
        <main class="flex-grow pt-10 pl-2 pr-2 flex-col justify-center text-center w-full text-[#cdd6f4]">
            <div class="justify-center content-center flex space-x-5 mb-22 w-full">
                <FileIcon
                    name="fnt"
                    width="128"
                    height="128"
                    data={{
                        height: 16,
                        width: 16,
                        data: "<path fill=\"none\" stroke=\"#f5a97f\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M4.5 4.5L1 8l3.5 3.5m7-7L15 8l-3.5 3.5M9.5 2l-3 12\" stroke-width=\"1\"/>"
                    }}
                />
                <FileIcon icon="catppuccin:lua" width="128" height="128" />
            </div>

            <div class="justify-center flex flex-col ml-2 mr-2">
                <button class={`btn btn-soft btn-accent rounded-4 ${fntContent() ? "mb-2" : ""} w-full`} onClick={selectFile}>📂 Select File</button>
                {fntContent() && <button onClick={parseFnt} class="btn btn-soft btn-secondary rounded-4 w-full">⚡ Convert</button>}
            </div>

            {output() && <Highlight lang="lua" code={output()} class="text-left" />}
        </main>
    );
}

export default Body;
