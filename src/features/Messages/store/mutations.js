const SET_MESSAGES_LIST = (state, payload) => {
    state.messagesList = payload
}

const ADD_TO_MESSAGES_LIST = (state, payload) => {
    state.messagesList.unshift(payload)
}

const REMOVE_FROM_MESSAGES_LIST = (state, payload) => {
    const newList = state.messagesList.filter(message => message.uid !== payload.uid)
    state.messagesList = newList
}

const SET_ERROR = (state, payload) => {
    state.hasErrorMessage = true
    state.errorMessage = payload
}

const SET_SELECTED_MESSAGE = (state, payload) => {
    state.selectedMessage = payload
}
 
export default {
    ADD_TO_MESSAGES_LIST,
    REMOVE_FROM_MESSAGES_LIST,
    SET_ERROR,
    SET_MESSAGES_LIST,
    SET_SELECTED_MESSAGE
}