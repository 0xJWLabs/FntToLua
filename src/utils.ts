import { addIcon, iconExists } from "@iconify-icon/solid";

export function addCustomIcon(iconClass: string, iconName: string, iconData: { height: number, width: number, data: string }) {
    if (!iconExists(`${iconClass}:${iconName}`)) {
      addIcon(`${iconClass}:${iconName}`, {
        height: iconData.height,
        width: iconData.width,
        body: iconData.data,
      });
    }
  }