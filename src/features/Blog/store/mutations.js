const ADD_STORY_TO_LIST = (state, payload) => {
    state.storiesList.push(payload)
}

const SET_STORIES_LIST = (state, payload) => {
    state.storiesList = payload
}

const SET_SELECTED_STORY = (state, payload) => {
    state.selectedStory = payload
}

const REMOVE_STORY_FROM_LIST = (state, payload) => {
    state.storiesList = state.storiesList.filter(story => story.uid !== payload.uid)
}

const SET_ERROR_MESSAGE = (state, payload) => {
    state.errorMessage = payload
}

const REPLACE_STORY_FROM_LIST = (state, payload) => {
    state.storiesList.forEach(function(story, i) 
        { if (story.uid == payload.uid) {
            state.storiesList[i] = payload 
        }
    })
}

const SET_PAGINATION_PAGE = (state, payload) => {
    state.paginationPage = payload
}

const SET_LOADING_STORIES = (state, payload) => {
    state.loadingStories = payload
}
 
export default {
    ADD_STORY_TO_LIST,
    SET_STORIES_LIST,
    SET_SELECTED_STORY,
    REMOVE_STORY_FROM_LIST,
    SET_ERROR_MESSAGE,
    REPLACE_STORY_FROM_LIST,
    SET_PAGINATION_PAGE,
    SET_LOADING_STORIES
}