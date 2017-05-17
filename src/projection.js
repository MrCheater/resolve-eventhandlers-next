export default {
  eventHandlers: {
    CREATE: function* (state, event) {
      yield state.setIn([event.aggregateId, 'value'], 0);
      return state;
    },
    INCREMENT: function* (state, event) {
      const counter = yield state.getIn([event.aggregateId, 'value']);
      return yield state.setIn([event.aggregateId, 'value'], counter + 1);
    },
    DECREMENT: function* (state, event) {
      const counter = yield state.getIn([event.aggregateId, 'value']);
      return yield state.setIn([event.aggregateId, 'value'], counter - 1);
    }
  }
};
