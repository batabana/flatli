import React from "react";
import axios from "./axios";

export default class Gif extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    async componentDidMount() {
        const { data } = await axios.get("/api/gif/");
        data.success &&
            this.setState({
                gif: data.gif
            });
    }

    notHideGif(e) {
        e.stopPropagation();
    }

    render() {
        return (
            <div className="modal" onClick={this.props.hideGif}>
                <div className="gif modal-inside" onClick={this.notHideGif}>
                    <img src={this.state.gif} alt="funny cat gif" />
                </div>
            </div>
        );
    }
}
