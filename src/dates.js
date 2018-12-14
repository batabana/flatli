import React from "react";
import axios from "./axios";

export default class Dates extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        const { data } = await axios.get("/api/dates/");
        this.setState({
            dates: data
        });
    }

    async handleChange(e) {
        await this.setState({
            [e.target.name]: e.target.value
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        const { data } = await axios.post("/api/add-date", this.state);
        !data.success && this.setState({ error: data.err });
    }

    render() {
        if (!this.state.dates) {
            return null;
        }
        return (
            <div>
                <h1>Dates</h1>
                {this.state.dates.map(item => {
                    return (
                        <div key={item.id} className="dates">
                            {item.title} {item.start}-{item.end}
                        </div>
                    );
                })}
                <span onClick={() => this.setState({ showDateAdder: true })}>Add new date</span>
                {this.state.showDateAdder && (
                    <form onSubmit={this.handleSubmit}>
                        <input onChange={this.handleChange} name="start" type="date" />
                        <input onChange={this.handleChange} name="end" type="date" />
                        <input onChange={this.handleChange} name="title" type="text" placeholder="title" />
                        <button>Save</button>
                    </form>
                )}
            </div>
        );
    }
}
