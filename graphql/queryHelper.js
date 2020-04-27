const DataLoader = require("dataloader");

const Event = require("../models/Event");
const User = require("../models/User");
const Booking = require("../models/Booking");

const eventLoader = new DataLoader((eventIds) => {
  return eventCreated(eventIds);
});

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const findCreator = async (userId) => {
  try {
    const creator = await userLoader.load(userId.toString()); //User.findById(userId);
    return {
      ...creator._doc,
      createdEvents: () =>
        eventLoader.loadMany(creator.createdEvents.toString()), //eventCreated.bind(this, creator.createdEvents),
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
    const event = await eventLoader.load(eventId.toString()); //await Event.findById(eventId);
    return event;
    // return {
    //   ...event._doc,
    //   _id: event.id,
    //   creator: findCreator.bind(this, event.creator),
    // };
  } catch (err) {
    throw err;
  }
};

exports.findCreator = findCreator;
exports.eventCreated = eventCreated;
exports.findSingleEvent = findSingleEvent;
