import React from "react";
import Dates from "./dates";
import Bar from "./bar";

export default function Main(props) {
    return (
        <div className="main-container">
            <Dates />
            <Bar credit={props.credit} />
        </div>
    );
}
