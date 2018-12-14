import React from "react";
import ReactDOM from "react-dom";
import Login from "./login";
import App from "./app";

let component;
if (location.pathname === "/login") {
    component = <Login />;
} else {
    component = <App />;
}

ReactDOM.render(component, document.querySelector("main"));
