import React from "react";
import axios from "./axios";
import DvbMonitor from "./dvb";
import Weather from "./weather";
import Clock from "./clock";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.handleLogin = this.handleLogin.bind(this);
    }

    async handleLogin(e) {
        e.preventDefault();
        const { data } = await axios.post("/api/login/" + e.target.id);
        data.success && location.replace("/");
    }

    async componentDidMount() {
        const { data } = await axios.get("/api/users");
        this.setState({ users: data });
    }

    render() {
        if (!this.state.users) {
            return null;
        }
        let arrOfUsers = this.state.users.map(elem => {
            return (
                <div key={elem.id}>
                    <img
                        src={elem.image}
                        alt={elem.name}
                        titel={elem.name}
                        id={elem.id}
                        onClick={this.handleLogin}
                        className="user-icon"
                    />
                </div>
            );
        });
        return (
            <div className="login-container">
                <header>
                    <img src="acat.png" />
                    <img src="flatli.png" />
                    <div />
                </header>
                <div className="dashboard">
                    <div className="user-login-container">
                        <h3>choose your user</h3>
                        <hr />
                        <div className="user-login">{arrOfUsers}</div>
                    </div>
                    <div className="widgets">
                        <div>
                            <Clock />
                            <br />
                            <img src="wifi-code.png" alt="QR-Code for WiFi" className="qr-code" />
                        </div>
                        <div>
                            <Weather />
                        </div>
                        <div>
                            <DvbMonitor />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
