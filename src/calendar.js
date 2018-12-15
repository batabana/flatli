import React from "react";
import moment from "./moment-range";
import Dayz from "dayz";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.changeDisplay = this.changeDisplay.bind(this);
        const date = moment(Date.now());
        this.state = {
            date,
            display: "month"
        };
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
                <Dayz {...this.state} highlightDays={[this.state.date]} />
                <Link to="/">Go back</Link>
            </div>
        );
    }
}
