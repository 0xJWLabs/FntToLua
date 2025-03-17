import { JSX } from "solid-js";
import { Icon } from "@iconify-icon/solid";
import { addCustomIcon } from "../utils";

type FntFileProps = {
    height: string;
    width: string;
    class: string;
};

const FntFile = (props: FntFileProps): JSX.Element => {
  addCustomIcon("custom-file-icons", "fnt", {
    height: 512,
    width: 512,
    data: "<path fill=\"#fff\" d=\"M453.2,182.7h-12.2v-59.2c0-.3-.1-.7-.1-1.1-.1-2.3-.8-4.6-2.4-6.5L340.1,3.4q0,0-.1,0c-.5-.7-1.2-1.2-1.9-1.7q-.4-.2-.7-.4-.9-.5-2-.8c-.2-.1-.3-.2-.5-.2q-1.1-.3-2.3-.3L90.9,0C79.8,0,70.8,9,70.8,20v162.7h-12.2c-15.8,0-28.6,12.8-28.6,28.6v148.9c0,15.8,12.8,28.6,28.6,28.6h12.2v102c0,11,9,20,20.1,20h330.1c11,0,20-9,20-20v-102h12.2c15.8,0,28.6-12.8,28.6-28.6v-148.9c0-15.8-12.8-28.6-28.6-28.6ZM90.9,20h231.7v102.5c0,5.6,4.5,10,10,10h88.4v50.2h-330.1v-162.7ZM231.1,313.7v42.4h-29.2v-140.8h37.1l29.2,51.6c8.4,14.8,16.7,32.4,23,48.3h.6c-2.1-18.6-2.7-37.6-2.7-58.7v-41.2h29.2v140.8h-33.4l-30-54.3c-8.4-15-17.5-33.2-24.4-49.7l-.7.2c.9,18.6,1.3,38.4,1.3,61.4Zm-56.8-40.1v25.9h-50.4v56.6h-31.9v-140.8h85.9v26.1h-54v32.2c0,0,50.4,0,50.4,0ZM421,485.3h-330.1v-96.5h330.1v96.5Zm22.2-243.2h-38.3v114h-32v-114h-37.7v-26.8h108v26.8Z\"/>",
  });
  return <Icon class={props.class} icon="custom-file-icons:fnt" height={props.height} width={props.width} />
}

export default FntFile;
