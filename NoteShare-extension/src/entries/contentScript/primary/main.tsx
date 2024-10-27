import "../../enableDevHmr";
import React from "react";
import ReactDOM from "react-dom/client";
import renderContent from "../renderContent";
import App from "./App";
import { createHashRouter } from "react-router-dom";
import Index from "~/components/Index";
import TabComponent from "~/components/Tabs/Tabs";

const router = createHashRouter([
  {
    path: "/",
    element: <Index />,
    children: [
      {
        path: "tabs",
        element: <TabComponent />,
      },
    ],
  },
]);

renderContent(import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS, (appRoot) => {
  ReactDOM.createRoot(appRoot).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
