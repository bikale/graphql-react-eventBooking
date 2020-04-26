import React, { Component } from "react";
import Modal from "./Main/Modal/Modal";
import { connect } from "react-redux";
import EventList from "./Main/Events/EventList";

class Events extends Component {
  state = { events: [], isLoading: false };
  componentDidMount() {
    this.setState({ isLoading: true });
    let queryEvent = {
      query: `
            query {
              events{ 
                  _id
                  title
                  date
                  price
                  creator{
                      _id
                      email
                  }


              }
            }
          `,
    };

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(queryEvent),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const events = resData.data.events;
        this.setState({ events: events, isLoading: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  }
  render() {
    return (
      <div className="container">
        <h1>Events Page</h1>
        <Modal />
        {this.state.isLoading ? (
          <div className="container d-flex justify-content-center">
            <div className="lds-spinner">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : (
          <EventList
            events={this.state.events}
            authUserId={this.props.userId}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(Events);
