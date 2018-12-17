import React from "react";

export default function Current(props) {
    return (
        <div className="current-container">
            <div className="user-icon">{props.user}</div>
            <a href="/logout">Logout</a>
        </div>
    );
}
