const SETSELECTEDPOST = (state, payload) => {
    state.selectedPost = payload
}

const SETPOSTSLIST = (state, payload) => {
    state.postsList = payload
}

const ADDPOSTTOLIST = (state, payload) => {
    state.postsList.push(payload)
}

const ADDPOSTTOPAGINATEDPOSTS = (state, payload) => {
    state.paginatedPosts.push(payload)
}

const ADDNEWPOSTTOPAGINATEDPOSTS = (state, payload) => {
    state.paginatedPosts.unshift(payload)
}

const CLEARPAGINATEDPOSTS = (state) => {
    state.paginatedPosts = []
}

const ADDMOREPOSTTOPAGINATEDPOSTS = (state, payload) => {
    state.paginatedPosts.push(payload)
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

const REMOVEPOSTFROMPAGINATEDPOSTS = (state, payload) => {
    state.postsList = state.paginatedPosts.filter(post => post.slug !== payload)
}

const SETPAGINATIONPAGE = (state, payload) => {
    state.page = payload
}

const SETLANGUAGE = (state, payload) => {
    state.selectedLanguage = payload
}

const SETLOADINGPOSTS = (state, payload) => {
    state.loadingPosts = payload
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
    REPLACEPOSTFROMLIST,
    SETPAGINATIONPAGE,
    ADDPOSTTOPAGINATEDPOSTS,
    ADDMOREPOSTTOPAGINATEDPOSTS,
    CLEARPAGINATEDPOSTS,
    SETLANGUAGE,
    SETLOADINGPOSTS,
    REMOVEPOSTFROMPAGINATEDPOSTS,
    ADDNEWPOSTTOPAGINATEDPOSTS
}