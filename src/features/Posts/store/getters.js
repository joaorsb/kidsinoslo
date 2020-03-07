
const randomPosts = (state) => {
    const randomPosts = new Set()
    let numbers = []
    if(state.paginatedPosts.length > 18) {
        for(let i = 0; i < 5; i++){
            const number = Math.round((Math.random() * 10) + 1)
            if( ! numbers.includes(number) 
                && state.paginatedPosts.length > number
                && randomPosts.size < 5) {
                numbers.push(number)
                let randomPost = state.paginatedPosts[number]
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