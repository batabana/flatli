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
                <div className="left-half">
                    <img src="/acat.jpg" id="acat" />
                </div>
                <div className="right-half">
                    <div>
                        <Weather />
                        <DvbMonitor />
                        <div>
                            <Clock />
                            <img src="wifi-code.png" alt="QR-Code for WiFi" className="qr-code" />
                        </div>
                    </div>
                    <div>{arrOfUsers}</div>
                </div>
            </div>
        );
    }
}
