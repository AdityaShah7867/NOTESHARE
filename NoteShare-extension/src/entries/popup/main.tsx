import React from "react";
import ReactDOM from "react-dom/client";
import "../enableDevHmr";
import App from "../popup/App";
import "./globals.css";
import { createHashRouter, RouterProvider } from "react-router-dom";

import { NextUIProvider } from "@nextui-org/system";

const hashRouting = createHashRouter([
	{
	  path: '/',
	  element: (
		<>
		
		  <App />
		</>
	  ),
	},
	
  ]);

  ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
	  <React.StrictMode>
	
			<RouterProvider router={hashRouting}/>
		

	  </React.StrictMode>,
  );