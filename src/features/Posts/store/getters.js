const filteredPosts = (state, getters,rootState) => {
    let filtered = []
    if(state.selectedNeighborhood){
        filtered = state.postsList.filter(post => post.neighborhood === state.selectedNeighborhood)
    }
    else if(rootState.Categories.selectedCategory){
        filtered = state.postsList.filter(post => post.category === rootState.Categories.selectedCategory.uid)
    } else {
        filtered = state.postsList
    }

    return filtered
}


export default {
    filteredPosts,
}