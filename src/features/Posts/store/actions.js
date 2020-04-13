import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import axios from 'axios'

const getPosts = async ({commit, state}) => {
    commit('SETLOADINGPOSTS', true)
    const postsRef = firebase.firestore().collection('posts')
    await postsRef.where("language", "==", state.selectedLanguage)
    .orderBy('createdAt').get().then(snapshot => {
        if(snapshot.empty){
            commit('SETPOSTSLIST', [])
            return
        } 
        snapshot.forEach(doc => {
            let post = doc.data()
            post.uid = doc.id
            commit('ADDPOSTTOLIST', post)
        })
    }).catch(err => {
        commit('SETERRORMESSAGE', err)
    })
    commit('SETLOADINGPOSTS', false)
}

const clearPostsList = ({commit}) => {
    commit('SETPOSTSLIST', [])
} 

const searchPosts = async ({commit, state}, payload) => {
    commit('SETLOADINGPOSTS', true)
    const nameCapitalized = payload.charAt(0).toUpperCase() + payload.slice(1)
    const postsRef = firebase.firestore().collection('posts')
    await postsRef.where("language", "==", state.selectedLanguage)
    .where('title', '>', nameCapitalized).get().then(snapshot => {
        if(snapshot.empty){
            commit('SETPOSTSLIST', [])
            return
        } 
        commit('SETPOSTSLIST', [])

        snapshot.forEach(doc => {
            let post = doc.data()
            post.uid = doc.id
            commit('ADDPOSTTOLIST', post)
        })
    }).catch(err => {
        commit('SETERRORMESSAGE', err)
    })
    commit('SETLOADINGPOSTS', false)
}

const getPaginatedPosts = async ({commit, state, rootState}) => {
    let postsRef = null
    if(state.selectedNeighborhood){
        postsRef = firebase.firestore().collection('posts')
        .where('neighborhood', '==', state.selectedNeighborhood)
    } else if(rootState.Categories.selectedCategory){
        postsRef = firebase.firestore().collection('posts')
        .where('category', '==', rootState.Categories.selectedCategory.uid)
    } else if(state.selectedPlace === true){
        postsRef = firebase.firestore().collection('posts')
        .where('outdoor', '==', true)
    } else if(state.selectedPlace === false){
        postsRef = firebase.firestore().collection('posts')
        .where('outdoor', '==', false)
    } else {
        postsRef = firebase.firestore().collection('posts')
    }

    if(state.page < 2){
        commit('SETLOADINGPOSTS', true)
        await postsRef.orderBy('createdAt', "desc")
        .limit(state.paginationSize).get().then(snapshot => {
            if(snapshot.empty){
                return
            } 
            snapshot.forEach(doc => {
                const post = doc.data()
                post.uid = doc.id
                post.imageUrl = ""
                post.imageUrlThumb = ""
                if(post.imageName) {
                    const baseImageUri = `https://firebasestorage.googleapis.com/v0/b/kids-in-oslo.appspot.com/o/posts%2F${post.uid}%2F`
                    post.imageUrl = `${baseImageUri}${post.imageName}?alt=media`
                    let thumbImage = post.imageName.replace('.jpg', '@s_400.jpg')
                    if(thumbImage == post.imageName) {
                        thumbImage = post.imageName.replace('.JPG', '@s_400.JPG')
                    }
                    post.imageUrlThumb = `${baseImageUri}${thumbImage}?alt=media`
                }
                if(post.language == state.selectedLanguage) {
                    commit('ADDPOSTTOPAGINATEDPOSTS', post)
                }
                
            })
            let nextPage = state.page + 1
            commit('SETPAGINATIONPAGE', nextPage)

        }).catch(err => {
            commit('SETERRORMESSAGE', err)
        })
    } else {
        commit('SET_SNACK_TEXT', 'Loading...')
        let lastVisible = state.paginatedPosts[state.paginatedPosts.length - 1]
        await postsRef.orderBy('createdAt', "desc").limit(state.paginationSize)
        .startAfter(lastVisible.createdAt)
        .get().then(snapshot => {
            if(snapshot.empty){
                commit('SET_SNACK_TEXT', 'No more posts to load')
                return
            } 
           
            snapshot.forEach(doc => {
                let post = doc.data()
                post.uid = doc.id
                post.imageUrl = ""
                post.imageUrlThumb = ""
                if(post.imageName) {
                    const baseImageUri = `https://firebasestorage.googleapis.com/v0/b/kids-in-oslo.appspot.com/o/posts%2F${post.uid}%2F`
                    post.imageUrl = `${baseImageUri}${post.imageName}?alt=media`
                    let thumbImage = post.imageName.replace('.jpg', '@s_400.jpg')
                    if(thumbImage == post.imageName) {
                        thumbImage = post.imageName.replace('.JPG', '@s_400.JPG')
                    }
                    post.imageUrlThumb = `${baseImageUri}${thumbImage}?alt=media`
                }
                if(post.language === state.selectedLanguage) {
                    commit('ADDMOREPOSTTOPAGINATEDPOSTS', post)
                }

            })
            let nextPage = state.page + 1
            commit('SETPAGINATIONPAGE', nextPage)
        }).catch(err => {
            commit('SETERRORMESSAGE', err)
        })
    }
    commit('SETLOADINGPOSTS', false)

}

const createPost = async ({commit}, payload) => {
    let image = null
    if(payload.image) {
        image = payload.image
        delete payload.image
    }
    try{
        const { data } = await axios.post(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${payload.address}+Oslo&key=AIzaSyADaD5ZdjzHBTyNT4s5CkOe1B8KAk5pthw`
        )
        if(data.error_message) {
            commit('SETERRORMESSAGE',data.error_message)
        } else {
            payload.lat = data.results[0].geometry.location.lat
            payload.lng = data.results[0].geometry.location.lng
        }
    } catch (error) {
        commit('SETERRORMESSAGE', error.message);
    }

    await firebase.firestore().collection('posts').add(payload).then(postRef => {
        payload.uid = postRef.id
        commit('ADDNEWPOSTTOPAGINATEDPOSTS', payload)
        commit('SETCURRENTUID', postRef.id)
        if(image) {
            const storageRef = firebase.storage().ref().child(`posts/${payload.uid}/${image.info.name}`)
            storageRef.putString(image.dataUrl, 'data_url')
            // storageRef.put(image) 
        }
    }).catch(error => {
        commit('SETERRORMESSAGE', error)
    })
    
}

const updatePostImage = async ({commit, state}, payload) => {
    if(payload) {
        const storageRef = firebase.storage().ref().child(`posts/${state.selectedPost.uid}/${payload.info.name}`)
        storageRef.putString(payload.dataUrl, 'data_url').then(() => {
            const postRef = firebase.firestore().collection('posts').doc(state.selectedPost.uid)
            postRef.update({
                imageName: payload.info.name
            })
            .then(() => {
                commit('REPLACEPOSTFROMLIST', state.selectedPost)
            })
            .catch(function(error) {
                commit('SETERRORMESSAGE', error)
            })
        }).catch(error => {
            commit('SETERRORMESSAGE', error)
        })
    }
}

const deletePostImage = async ({ state }) => {
    const storageRef = firebase.storage().ref().child(`posts/${state.selectedPost.uid}/${state.selectedPost.name}`)
    storageRef.delete() 
}

const editPost = async ({commit}, payload) => {
    const postRef = firebase.firestore().collection('posts').doc(payload.uid)
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
        siteUrl: payload.siteUrl,
        availableforCarousel: payload.availableforCarousel,
        outdoor: payload.outdoor
    })
    .then(() => {
        commit('REPLACEPOSTFROMLIST', payload)
    })
    .catch(function(err) {
        commit('SETERRORMESSAGE', err)
    })
}

const deletePost = async ({commit, state}) => {
    const postRef = firebase.firestore().collection('posts')
                            .doc(state.selectedPost.uid)
    await postRef.delete()
    .then(() => {
        const storageRef = firebase.storage().ref().child(`posts/${state.selectedPost.uid}/${state.selectedPost.name}`)
        storageRef.delete() 
        commit('REMOVEPOSTFROMPAGINATEDPOSTS', state.selectedPost.slug)
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

const setLanguage = ({commit}, payload) => {
    commit('SETLANGUAGE', payload)
}

const addNewPostToPaginatedList = ({commit}, payload) => {
    commit('ADDNEWPOSTTOPAGINATEDPOSTS', payload)
}

const getPostBySlug = async ({ commit }, payload) => {
    commit('SETLOADINGPOSTS', true)
    const postsRef = firebase.firestore().collection('posts')
    await postsRef.where("slug", "==", payload).get().then(snapshot => {
        if(snapshot.empty){
            commit('SETSELECTEDPOST', null)
            return
        } 
        snapshot.forEach(doc => {
            let post = doc.data()
            post.uid = doc.id
            post.imageUrl = ''
            if(post.imageName) {
                const baseImageUri = `https://firebasestorage.googleapis.com/v0/b/kids-in-oslo.appspot.com/o/posts%2F${post.uid}%2F`
                post.imageUrl = `${baseImageUri}${post.imageName}?alt=media`
            }
            commit('SETSELECTEDPOST', post)
        })
    }).catch(err => {
        commit('SETERRORMESSAGE', err)
    })
    commit('SETLOADINGPOSTS', false)
}

const getPostGeolocation = async ({ commit, state }) => {
    try{
        const { data } = await axios.post(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${state.selectedPost.address}+Oslo&key=AIzaSyADaD5ZdjzHBTyNT4s5CkOe1B8KAk5pthw`
        );
        if(data.error_message) {
            commit('SETERRORMESSAGE', data.error_message)
        } else {
            state.selectedPost.lat = data.results[0].geometry.location.lat
            state.selectedPost.lng = data.results[0].geometry.location.lng
            const postRef = firebase.firestore().collection('posts').doc(state.selectedPost.uid)
            await postRef.update({
                lat: state.selectedPost.lat,
                lng: state.selectedPost.lng,
            })
            .then(() => {
                commit('REPLACEPOSTFROMLIST', state.selectedPost)
            })
            .catch(function(err) {
                commit('SETERRORMESSAGE', err)
            })
        }
    } catch (error) {
        commit('SETERRORMESSAGE', error.message);
    }
}

const closeSnack = ({ commit }) => {
    commit('CLOSE_SNACK_TEXT')
}

const setNavBarMenu = ({ commit }) => {
    commit('SET_NAV_BAR_MENU')
}

const setErrorMessage = ({commit}, payload) => {
    commit('SETERRORMESSAGE', payload)
}

const createNeighborhood = async ({ commit }, payload) => {
    commit('SETLOADINGPOSTS', true)

    await firebase.firestore().collection('neighborhoods')
    .add(payload).then(() => {
        commit('ADD_TO_NEIGHBORHOOD_LIST', payload.name)

    }).catch(error => {
        commit('SETERRORMESSAGE', error)
    })
    commit('SETLOADINGPOSTS', false)
    
}

const getNeighborhoods = async ({ commit }) => {
    const neighHood = firebase.firestore().collection('neighborhoods')
    await neighHood.orderBy('name').get().then(snapshot => {
        if(snapshot.empty) {
            commit('SET_NEIGHBORHOOD_LIST', [])
            return
        }
        snapshot.forEach(doc => {
            commit('ADD_TO_NEIGHBORHOOD_LIST', doc.data().name)
        })
    }).catch(error => {
        commit('SETERRORMESSAGE', error)
    })
}

const deleteNeighborhood = async ({ commit }, payload) => {
    let neighborhood = null
    await firebase.firestore()
    .collection('neighborhoods').where('name', '==', payload).get().then(snapshot => {
        if(! snapshot.empty) {
            snapshot.forEach(doc => {
                if(doc.data().name === payload) {
                    neighborhood = doc.id
                }
            })
        }
    }).catch(error => {
        commit('SETERRORMESSAGE', error)
    })

    if (neighborhood) {
        await firebase.firestore()
        .collection('neighborhoods').doc(neighborhood).delete().then(() => {
            commit('REMOVE_FROM_NEIGHBORHOOD_LIST', payload)
        })

    }
}

const setSnackText = ({ commit }, payload) => {
    commit('SET_SNACK_TEXT', payload)
}

const setSelectedPlace = ({ commit }, payload) => {
    commit('SET_SELECTED_PLACE', payload)
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
    clearPostsList,
    updatePostImage,
    deletePostImage,
    setLanguage,
    addNewPostToPaginatedList,
    getPostBySlug,
    getPostGeolocation,
    closeSnack,
    setNavBarMenu,
    setErrorMessage,
    createNeighborhood,
    getNeighborhoods,
    deleteNeighborhood,
    setSnackText,
    setSelectedPlace
}