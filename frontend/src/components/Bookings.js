import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Spinner from "./Main/Spinner/Spinner";
import BookingList from "./Main/Bookings/BookingList";
class Bookings extends Component {
  state = {
    isLoading: false,
    bookings: [],
  };
  componentDidMount() {
    this.setState({ isLoading: true });
    let queryEvent = {
      query: `
            query {
              bookings{ 
                  _id
                 createdAt
                 event{
                   _id
                   title
                   date
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
        Authorization: "Bearer " + this.props.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        const bookings = resData.data.bookings;
        this.setState({ bookings: bookings, isLoading: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  }

  deleteBookingHandler = (bookingId) => {
    this.setState({ isLoading: true });
    let deleteBooking = {
      query: `
            mutation {
              cancelBooking(bookingId:"${bookingId}"){ 
                  _id
                  title
              }
            }
          `,
    };

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(deleteBooking),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        this.setState((prevState) => {
          const updatedBooking = prevState.bookings.filter(
            (booking) => booking._id !== bookingId
          );

          return { bookings: updatedBooking, isLoading: false };
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  render() {
    return (
      <Fragment>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <BookingList
            bookings={this.state.bookings}
            onDelete={this.deleteBookingHandler}
          />
        )}
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(Bookings);
