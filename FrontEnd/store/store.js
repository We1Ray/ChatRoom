import { createStore } from 'redux';
import reducers from './reducers/reducers';
import { saveState } from './persisted.store.cookies.js';

export default function configureStore(initialState) {
    const store = createStore(reducers, {
        ...initialState
    });

    // add a listener that will be invoked on any state change
    store.subscribe(() => {
        saveState(store.getState());
    });

    return store;
}
