import { firestore, storage } from 'firebase'

const getPosts = async ({commit}) => {
    const postsRef = firestore().collection('posts')
    await postsRef.orderBy('createdAt').get().then(snapshot => {
        if(snapshot.empty){
            commit('SETPOSTSLIST', [])
            return
        } 
        snapshot.forEach(doc => {
            let post = doc.data()
            post.uid = doc.id
            commit('ADDPOSTTOLIST', post)
            if(doc.data().neighborhood){
                commit('ADDTONEIGHBORHOODLIST', doc.data().neighborhood)
            }
        })
    }).catch(err => {
        commit('SETERRORMESSAGE', err)
    })
}

const clearPostsList = ({commit}) => {
    commit('SETPOSTSLIST', [])
} 

const searchPosts = async ({commit}, payload) => {
    const postsRef = firestore().collection('posts')
    await postsRef.where('title', '>=', payload).get().then(snapshot => {
        if(snapshot.empty){
            commit('SETPOSTSLIST', [])
            return
        } 
        commit('SETPOSTSLIST', [])

        snapshot.forEach(doc => {
            let post = doc.data()
            post.uid = doc.id
            commit('ADDPOSTTOLIST', post)
            if(doc.data().neighborhood){
                commit('ADDTONEIGHBORHOODLIST', doc.data().neighborhood)
            }
        })
    }).catch(err => {
        commit('SETERRORMESSAGE', err)
    })
}

const getPaginatedPosts = async ({commit, state, rootState}) => {
    let postsRef = null
    if(state.selectedNeighborhood){
        postsRef = firestore().collection('posts').where('neighborhood', '==', state.selectedNeighborhood)
    } else if(rootState.Categories.selectedCategory){
        postsRef = firestore().collection('posts').where('category', '==', rootState.Categories.selectedCategory.uid)
    } else {
        postsRef = firestore().collection('posts')
    }

    if(state.page < 2){
        await postsRef.orderBy('createdAt', "desc").limit(state.paginationSize).get().then(snapshot => {
            if(snapshot.empty){
                return
            } 
            snapshot.forEach(doc => {
                let post = doc.data()
                post.uid = doc.id
                commit('ADDPOSTTOPAGINATEDPOSTS', post)
                if(doc.data().neighborhood){
                    commit('ADDTONEIGHBORHOODLIST', doc.data().neighborhood)
                }
                
            })
            let nextPage = state.page + 1
            commit('SETPAGINATIONPAGE', nextPage)

        }).catch(err => {
            commit('SETERRORMESSAGE', err)
        })
    } else {
        let lastVisible = state.paginatedPosts[state.paginatedPosts.length - 1]
        await postsRef.orderBy('createdAt', "desc").limit(state.paginationSize)
        .startAfter(lastVisible.createdAt)
        .get().then(snapshot => {
            if(snapshot.empty){
                return
            } 
            snapshot.forEach(doc => {
                let post = doc.data()
                post.uid = doc.id
                commit('ADDMOREPOSTTOPAGINATEDPOSTS', post)
                if(doc.data().neighborhood){
                    commit('ADDTONEIGHBORHOODLIST', doc.data().neighborhood)
                }

            })
            let nextPage = state.page + 1
            commit('SETPAGINATIONPAGE', nextPage)
        }).catch(err => {
            commit('SETERRORMESSAGE', err)
        })
    }

}

const createPost = async ({commit}, payload) => {
    let image = null
    if(payload.image) {
        image = payload.image
        delete payload.image
    }
    await firestore().collection('posts').add(payload).then(postRef => {
        payload.uid = postRef.id
        commit('ADDPOSTTOLIST', payload)
        commit('SETCURRENTUID', postRef.id)
        if(image) {
            var storageRef = storage().ref().child('posts/' + payload.uid + "/" + image.name)
            storageRef.put(image) 
        }
    }).catch(error => {
        alert(error)
    })
    
}

const editPost = async ({commit}, payload) => {
    const postRef = firestore().collection('posts').doc(payload.uid)
    await postRef.update({
        uid: payload.uid,
        title: payload.title,
        description: payload.description,
        address: payload.address,
        neighborhood: payload.neighborhood,
        flex: payload.flex,
        lat: payload.lat,
        lng: payload.lng,
        owner: payload.owner,
        author: payload.author,
        category: payload.category,
        language: payload.language,
        slug: payload.slug,
    })
    .then(() => {
        commit('REPLACEPOSTFROMLIST', payload)
    })
    .catch(function(err) {
        alert(err)
    })
}

const deletePost = async ({commit, state}) => {
    const postRef = firestore().collection('posts')
                            .doc( state.selectedPost.uid)
    commit('REMOVEPOSTFROMLIST', state.selectedPost.slug)
    await postRef.delete()
    .then(() => {
        commit('SETSELECTEDPOST', null)
    })    
    .catch(function(err) {
        commit('ADDPOSTTOLIST', state.selectedPost )
        alert(err)
    })
}

const setSelectedPost = ({commit}, payload) => {
    commit('SETSELECTEDPOST', payload)
}

const setSelectedNeighborhood = ({commit}, payload) => {
    commit('SETSELECTEDNEIGHBORHOOD', payload)
}

const clearPaginatedPosts = ({commit}) => {
    commit('CLEARPAGINATEDPOSTS')
}

const setPaginationPage = ({commit}, payload) => {
    commit('SETPAGINATIONPAGE', payload)
}

export default {
    getPosts,
    createPost,
    setSelectedPost,
    setSelectedNeighborhood,
    editPost,
    deletePost,
    getPaginatedPosts,
    clearPaginatedPosts,
    setPaginationPage,
    searchPosts,
    clearPostsList
}