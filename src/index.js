import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  defer,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import reportWebVitals from "./reportWebVitals";

import { AuthLayout } from "./components/AuthLayout";
import Flow from "./pages/Flow";
import dayjs from "dayjs";

import "antd/dist/reset.css";
import "./index.css";
import { getProfile } from "./data/restful/auth";
import Settings from "./pages/Settings";

// With the Tauri API npm package:
import { invoke } from "@tauri-apps/api/tauri";
import WechatLoginCallback from "./pages/wechat/WechatLoginCallback";

document.addEventListener("DOMContentLoaded", () => {
  // This will wait for the window to load, but you could
  // run this function on whatever trigger you want
  setTimeout(() => invoke("close_splashscreen"), 1000);
});

dayjs.locale("zh-cn");

const getUserData = async () => {
  try {
    await getProfile();
    return null;
  } catch (e) {
    window.localStorage.setItem("x-token", null);
    window.localStorage.setItem("user", null);
    return null;
  }
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={<AuthLayout />}
      loader={() => defer({ userPromise: getUserData() })}
    >
      <Route path="/" element={<App />}>
        <Route index element={<Flow />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="/login" element={<Login />} ></Route>
      <Route path="/login/wechat" element={<WechatLoginCallback />} />

    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
