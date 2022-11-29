import { saveAs } from "file-saver";
import { save } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";

export const downloadFile = async (url, defaultPath) => {
  if (!window.__TAURI__) {
    return saveAs(url, defaultPath);
  }

  try {
    const filePath = await save({
      defaultPath: defaultPath,
    });

    if (!filePath) {
      return;
    }

    await invoke("download_file", { url, path: filePath });
  } catch (err) {
    console.error(err);
  }
};
