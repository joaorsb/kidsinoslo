const SETSELECTEDPOST = (state, payload) => {
    state.selectedPost = payload
}

const SETPOSTSLIST = (state, payload) => {
    state.postsList = payload
}

const ADDPOSTTOLIST = (state, payload) => {
    state.postsList.unshift(payload)
}

const REPLACEPOSTFROMLIST = (state, payload) => {
    state.postsList.forEach(function(post, i) 
        { if (post.uid == payload.uid) {
            state.postsList[i] = payload 
        }
    })
}

const SETERRORMESSAGE = (state, payload) => {
    state.errorMessage = payload
}

const SETCURRENTUID = (state, payload) => {
    state.currentUid = payload
}

const ADDTONEIGHBORHOODLIST = (state, payload) => {
    if( ! state.neighborhoodList.includes(payload)){
        state.neighborhoodList.push(payload)
    }
}

const SETSELECTEDNEIGHBORHOOD = (state, payload) => {
    state.selectedNeighborhood = payload
}

const REMOVEPOSTFROMLIST = (state, payload) => {
    state.postsList = state.postsList.filter(post => post.slug !== payload)
}

export default {
    SETSELECTEDPOST,
    SETPOSTSLIST,
    ADDPOSTTOLIST,
    SETERRORMESSAGE,
    SETCURRENTUID,
    ADDTONEIGHBORHOODLIST,
    SETSELECTEDNEIGHBORHOOD,
    REMOVEPOSTFROMLIST,
    REPLACEPOSTFROMLIST
}