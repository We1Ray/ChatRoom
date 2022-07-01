import { CHANGE_THEME } from '../actions/actions';

const initialState = {
    name: ''
}

const themesReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_THEME:
            return {
                ...state,
                name: action.name
            }
        default:
            return state;
    }
}

export default themesReducer;