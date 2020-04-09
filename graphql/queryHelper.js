const Event = require('../models/Event');
const User = require('../models/User');
const Booking = require('../models/Booking');

const findCreator = async (userId) => {
  try {
    const creator = await User.findById(userId);
    return {
      ...creator._doc,
      createdEvents: eventCreated.bind(this, creator.createdEvents),
    };
  } catch (error) {
    throw error;
  }
};

//find events created by the user

const eventCreated = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: findCreator.bind(this, event.creator),
      };
    });
  } catch (error) {
    throw error;
  }
};
//find the single event created by the user
const findSingleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      _id: event.id,
      creator: findCreator.bind(this, event.creator),
    };
  } catch (err) {
    throw err;
  }
};

exports.findCreator = findCreator;
exports.eventCreated = eventCreated;
exports.findSingleEvent = findSingleEvent;
