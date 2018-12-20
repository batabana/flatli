import React from "react";

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <header>
                <img src="acat.png" onClick={this.props.showGif} />
                <img src="flatli.png" />
                <a href="/logout">
                    <img
                        src={this.props.userimage}
                        alt={this.props.username}
                        title={this.props.username}
                        className="user-icon"
                    />
                </a>
            </header>
        );
    }
}
