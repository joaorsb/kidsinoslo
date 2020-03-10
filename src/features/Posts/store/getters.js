
const randomPosts = (state) => {
    const randomPosts = new Set()
    let numbers = []
    if(state.paginatedPosts.length > 23) {
        const filteredPosts = state.paginatedPosts.filter(post => post.availableforCarousel)
        for(let i = 0; i < 5; i++){
            const number = Math.round((Math.random() * 10) + 1)
            if( ! numbers.includes(number) 
                && filteredPosts.length > number
                && randomPosts.size < 5) {
                numbers.push(number)
                let randomPost = filteredPosts[number]
                if (randomPost.imageName) {
                    randomPosts.add(randomPost)
                }
            }
        }
    }
    
    return randomPosts
}

const sortedNeighborhood = (state) => {
    const sortedNeighborhood = new Set()
    state.neighborhoodList.sort((a, b) => a.localeCompare(b))
    state.neighborhoodList.map(neighborhood => sortedNeighborhood.add(neighborhood))
    return [...sortedNeighborhood]
}


export default {
    randomPosts,
    sortedNeighborhood
}