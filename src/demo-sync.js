import Immutable from 'seamless-immutable'
import projection from './projection'
import events from './events'

function initialStateGenerator() {
  let _state = Immutable({})
  const state = {
    getIn: function(...args) {
      return _state.getIn(...args);
    },
    setIn: function(...args) {
      _state = _state.setIn(...args);
      return _state
    }
  }
  return state;
}

function* execute(initialState, eventHandlers, events) {
  let state = initialState;
  yield state;
  for(let event of events) {
    const transaction = eventHandlers[event.type] (state, event)
    let step = {};
    do {
      step = transaction.next(step.value)
    } while(!step.done)
    yield state
  }
}

console.log('=== SYNC ===')
const initialState = initialStateGenerator();
for(let state of execute(initialState, projection.eventHandlers, events)) {
  console.log(state && state.getIn(['id', 'value']))
}