import React from "react";
import axios from "./axios";
import DvbMonitor from "./dvb";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    async componentDidMount() {
        const { data } = await axios.get("/api/currentuser");
        await this.setState({ user: data });
    }

    render() {
        if (!this.state.user) {
            return null;
        }
        const currUser = this.state.user[0];

        return (
            <div>
                <header>
                    <div className="user-icon">{currUser.id}</div>
                </header>
                <div className="app-container">
                    <DvbMonitor />
                </div>
            </div>
        );
    }
}

//
