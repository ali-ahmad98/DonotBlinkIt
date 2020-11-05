let initialState = {
    sentences: [],
    mode: 'focus',
    visible: false
}
export default function counter(state, action) {
    switch(action.type) {
        case 'SET_SENTENCES': {
            return {
                ...state,
                sentences: action.payload.sentences
            }
        }
        case 'SET_MODE': {
            return {
                ...state,
                mode: action.payload.mode
            }
        }
        case 'SET_VISIBILITY': {
            return {
                ...state,
                visible: action.payload.visible
            }
        }
        default:
            return initialState;
    }
}
