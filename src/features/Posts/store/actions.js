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
            var storageRef = storage().ref().child('posts/' + payload.slug + "/" + image.name)
            storageRef.put(image) 
        }
    }).catch(error => {
        alert(error)
    })
    
}

const editPost = async ({commit}, payload) => {
    const postRef = firestore().collection('posts').doc(payload.uid)
    // const oldSlug = payload.oldSlug
    // delete payload.oldSlug
    // commit('REMOVEPOSTFROMLIST', oldSlug)
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

export default {
    getPosts,
    createPost,
    setSelectedPost,
    setSelectedNeighborhood,
    editPost,
    deletePost,

}