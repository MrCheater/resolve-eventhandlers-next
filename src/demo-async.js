import Immutable from 'seamless-immutable'
import projection from './projection'
import events from './events'

function initialStateGenerator() {
  let _state = Immutable({})
  const state = {
    getIn: function(...args) {
      return Promise.resolve(_state.getIn(...args));
    },
    setIn: function(...args) {
      _state = _state.setIn(...args);
      return Promise.resolve(state)
    }
  }
  return state;
}

async function* execute(initialState, eventHandlers, events) {
  let state = initialState;
  yield state;
  for(let event of events) {
    const transaction = eventHandlers[event.type] (state, event)
    let step = {};
    do {
      step = transaction.next(await step.value)
    } while(!step.done)
    yield state
  }
}

(async() => {
  console.log('=== ASYNC ===')
  const initialState = initialStateGenerator();
  for await (let state of execute(initialState, projection.eventHandlers, events)) {
    console.log(await state.getIn(['id', 'value']))
  }
})()

