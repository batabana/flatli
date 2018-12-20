import React from "react";

export default function Header(props) {
    return (
        <header>
            <img src="acat.png" onClick={props.showGif} />
            <img src="flatli.png" />
            <a href="/logout">
                <img src={props.userimage} alt={props.username} title={props.username} className="user-icon" />
            </a>
        </header>
    );
}
