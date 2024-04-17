import React from "react";
import ReactDOM from "react-dom/client";
import { hydrate, render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./Resources/Hahmlet/Hahmlet-VariableFont_wght.ttf";
import Xdoms from "./Xdom/MainApp";

import reportWebVitals from "./reportWebVitals";

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(<Xdoms />, rootElement);
} else {
  render(<Xdoms />, rootElement);
}

// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
