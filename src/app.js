import React from "react";
import axios from "./axios";
import Dates from "./dates";
import { BrowserRouter, Route } from "react-router-dom";
import Calendar from "./calendar";

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
        // const currUser = this.state.user[0];

        return (
            <div>
                <div className="app-container">
                    <BrowserRouter>
                        <div>
                            <Route exact path="/" component={Dates} />
                            <Route path="/calendar" render={() => <Calendar date={Date.now()} />} />
                        </div>
                    </BrowserRouter>
                </div>
            </div>
        );
    }
}

// <header>
//     <div className="user-icon">{currUser.id}</div>
// </header>
