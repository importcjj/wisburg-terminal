import { isPermissionGranted, requestPermission, sendNotification as send } from '@tauri-apps/api/notification';

export const sendNotification = async (title, body, icon) => {
    if (!window.__TAURI__) {
        return
    }

    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
    }

    if (permissionGranted) {
        send({ title, body, icon });
      }
}