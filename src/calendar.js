import React from "react";
import moment from "./moment-range";
import Dayz from "dayz";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment(Date.now()),
            display: "month"
        };
        this.changeDisplay = this.changeDisplay.bind(this);
    }

    async componentDidMount() {
        const { data } = await axios.get("/api/all-dates");
        const events = new Dayz.EventsCollection(
            data.dates.map(item => {
                return {
                    content: item.title,
                    range: moment.range(moment(item.start), moment(item.end))
                };
            })
        );
        data.success && this.setState({ events });
    }

    changeDisplay(ev) {
        this.setState({ display: ev.target.value });
    }

    render() {
        return (
            <div className="dayz-wrapper">
                <h3>{moment(this.state.date).format("MMMM YYYY")}</h3>
                <div>
                    <img
                        src="left.png"
                        className="icon"
                        onClick={() => {
                            this.setState({ date: moment(this.state.date).add(-1, "M") });
                        }}
                    />
                    <Dayz {...this.state} highlightDays={[this.state.date]} />
                    <img
                        src="right.png"
                        className="icon"
                        onClick={() => {
                            this.setState({ date: moment(this.state.date).add(1, "M") });
                        }}
                    />
                </div>
                <div>
                    <Link to="/" className="fake-button">
                        Go back
                    </Link>
                </div>
            </div>
        );
    }
}
