import React from "react";
import axios from "./axios";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.handleLogin = this.handleLogin.bind(this);
    }

    async handleLogin(e) {
        e.preventDefault();
        const { data } = await axios.post("/api/login/" + e.target.innerHTML);
        data.success && location.replace("/");
    }

    async componentDidMount() {
        const { data } = await axios.get("/api/users");
        this.setState({ users: data });
    }
    // <img src={elem.image} alt={elem.name} titel={elem.name} id={elem.id} onClick={this.handleLogin} />

    render() {
        if (!this.state.users) {
            return null;
        }
        let arrOfUsers = this.state.users.map(elem => {
            return (
                <div key={elem.id} className="user-container">
                    <div className="user-icon" onClick={this.handleLogin}>
                        {elem.id}
                    </div>
                </div>
            );
        });
        return (
            <div className="login-container">
                <div id="leftHalf">
                    <img src="/acat.jpg" id="acat" />
                </div>
                <div id="rightHalf">{arrOfUsers}</div>
            </div>
        );
    }
}
