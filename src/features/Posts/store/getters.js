const filteredPosts = (state, getters,rootState) => {
    let filtered = state.postsList
    if(rootState.Categories.selectedCategory){
        filtered = state.postsList.filter(post => post.category === rootState.Categories.selectedCategory.uid)
    } 

    return filtered
}


export default {
    filteredPosts,
}