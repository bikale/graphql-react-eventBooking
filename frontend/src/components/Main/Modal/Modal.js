import React, { Component } from 'react';
import { connect } from 'react-redux';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.titleEl = React.createRef();
    this.priceEl = React.createRef();
    this.dateEl = React.createRef();
    this.descriptionEl = React.createRef();
  }

  submitHandler = (e) => {
    e.preventDefault();
    const title = this.titleEl.current.value;
    const price = +this.priceEl.current.value;
    const date = this.dateEl.current.value;
    const description = this.descriptionEl.current.value;

    const event = { title, description, price, date };
    console.log(event);
    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }
    let createEvent = {
      query: `
              mutation {
                createEvent(title: "${title}", description: "${description}", price: ${price}, date: "${date}") { 
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

    const token = this.props.token;

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(createEvent),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="container-fluid-lg d-flex justify-content-center pt-5">
        <div className="jumbotron">
          <form onSubmit={this.submitHandler}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Title"
                required
                ref={this.titleEl}
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                className="form-control"
                placeholder="Price"
                required
                ref={this.priceEl}
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="datetime-local"
                className="form-control"
                required
                ref={this.dateEl}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                rows="4"
                ref={this.descriptionEl}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(Modal);
