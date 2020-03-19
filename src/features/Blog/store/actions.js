import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'

const getStories = async ({ dispatch, commit, state }) => {
    commit('SET_LOADING_STORIES', true)
    const storiesRef = firebase.firestore().collection('stories')
    if(state.paginationPage < 2){
        dispatch('Posts/setSnackText', 'Loading...', { root: true })
        await storiesRef.orderBy('createdAt').limit(state.paginationSize).get().then(snapshot => {
            if(snapshot.empty){
                commit('SET_STORIES_LIST', [])
                return
            } 
            snapshot.forEach(doc => {
                const story = doc.data()
                story.uid = doc.id
                story.imageUrl = ""
                story.imageUrlThumb = ""
                if(story.imageName) {
                    const baseImageUri = `https://firebasestorage.googleapis.com/v0/b/kids-in-oslo.appspot.com/o/stories%2F${doc.id}%2F`
                    story.imageUrl = `${baseImageUri}${story.imageName}?alt=media`
                    let thumbImage = story.imageName.replace('.jpg', '@s_400.jpg')
                    if(thumbImage == story.imageName) {
                        thumbImage = story.imageName.replace('.JPG', '@s_400.JPG')
                    }
                    story.imageUrlThumb = `${baseImageUri}${thumbImage}?alt=media`
                }
                commit('ADD_STORY_TO_LIST', story)
                const nextPage = state.paginationPage + 1
                commit('SET_PAGINATION_PAGE', nextPage)
            })
        }).catch(err => {
            commit('SET_ERROR_MESSAGE', err)
        })
    } else {
        dispatch('Posts/setSnackText', 'Loading...', { root: true })
        let lastVisible = state.storiesList[state.storiesList.length - 1]
        await storiesRef.orderBy('createdAt').limit(state.paginationSize)
        .startAfter(lastVisible.createdAt)
        .get().then(snapshot => {
            if(snapshot.empty){
                dispatch('Posts/setSnackText', 'No more posts to load', { root: true })
                return
            } 
           
            snapshot.forEach(doc => {
                let story = doc.data()
                story.uid = doc.id
                story.imageUrl = ""
                story.imageUrlThumb = ""
                if(story.imageName) {
                    const baseImageUri = `https://firebasestorage.googleapis.com/v0/b/kids-in-oslo.appspot.com/o/stories%2F${doc.id}%2F`
                    story.imageUrl = `${baseImageUri}${story.imageName}?alt=media`
                    let thumbImage = story.imageName.replace('.jpg', '@s_400.jpg')
                    if(thumbImage == story.imageName) {
                        thumbImage = story.imageName.replace('.JPG', '@s_400.JPG')
                    }
                    story.imageUrlThumb = `${baseImageUri}${thumbImage}?alt=media`
                }
                commit('ADD_STORY_TO_LIST', story)

            })
            const nextPage = state.paginationPage + 1
                commit('SET_PAGINATION_PAGE', nextPage)
        }).catch(err => {
            commit('SET_ERROR_MESSAGE', err)
        })
    }
    commit('SET_LOADING_STORIES', false)
}

const createStory = async ({ commit }, payload) => {
    let image = null
    if(payload.image) {
        image = payload.image
        delete payload.image
    }
    commit('SET_LOADING_STORIES', true)

    await firebase.firestore().collection('stories').add(payload).then(postRef => {
        payload.uid = postRef.id
        commit('ADD_STORY_TO_LIST', payload)
        if(image) {
            const storageRef = firebase.storage().ref().child(`stories/${payload.uid}/${image.info.name}`)
            storageRef.putString(image.dataUrl, 'data_url')
            // storageRef.put(image) 
        }
    }).catch(error => {
        commit('SET_ERROR_MESSAGE', error)
    })
    commit('SET_LOADING_STORIES', false)
}

const updateStoryImage = async ({commit, state}, payload) => {
    if(payload) {
        const storageRef = firebase.storage().ref().child(`stories/${state.selectedStory.uid}/${payload.info.name}`)
        storageRef.putString(payload.dataUrl, 'data_url').then(() => {
            const postRef = firebase.firestore().collection('stories').doc(state.selectedStory.uid)
            postRef.update({
                imageName: payload.info.name
            })
            .then(() => {
                commit('REPLACE_STORY_FROM_LIST', state.selectedPost)
            })
            .catch(function(error) {
                commit('SET_ERROR_MESSAGE', error)
            })
        }).catch(error => {
            commit('SET_ERROR_MESSAGE', error)
        })
    }
}

const setSelectedStory = ({ commit }, payload) => {
    commit('SET_SELECTED_STORY', payload)
}

const clearStoriesList = ({ commit }) => {
    commit('SET_STORIES_LIST', [])
}

const getStoryBySlug = async ({ commit }, payload) => {
    const storiesRef = firebase.firestore().collection('stories')
    await storiesRef.where("slug", "==", payload).get().then(snapshot => {
        if(snapshot.empty){
            commit('SET_SELECTED_STORY', null)
            return
        } 
        snapshot.forEach(doc => {
            let story = doc.data()
            story.uid = doc.id
            story.imageUrl = ''
            story.imageUrlThumb = ""
            if(story.imageName) {
                const baseImageUri = `https://firebasestorage.googleapis.com/v0/b/kids-in-oslo.appspot.com/o/stories%2F${doc.id}%2F`
                story.imageUrl = `${baseImageUri}${story.imageName}?alt=media`
                let thumbImage = story.imageName.replace('.jpg', '@s_400.jpg')
                if(thumbImage == story.imageName) {
                    thumbImage = story.imageName.replace('.JPG', '@s_400.JPG')
                }
                story.imageUrlThumb = `${baseImageUri}${thumbImage}?alt=media`
            }
            commit('SET_SELECTED_STORY', story)
        })
    }).catch(err => {
        commit('SET_ERROR_MESSAGE', err)
    })
}

const deleteStory = async ({commit, state}) => {
    const storyRef = firebase.firestore().collection('stories')
                            .doc(state.selectedStory.uid)
    await storyRef.delete()
        .then(() => {
            const storageRef = firebase.storage().ref().child(`stories/${state.selectedStory.uid}/${state.selectedPost.name}`)
            storageRef.delete() 
            commit('REMOVE_STORY_FROM_LIST', state.selectedStory)
            commit('SET_SELECTED_STORY', null)
    })    
    .catch(function(err) {
        commit('ADD_STORY_TO_LIST', state.selectedStory)
        alert(err)
    })
}

const editStory = async ({ commit }, payload)  => {
    const storyRef = firebase.firestore().collection('posts').doc(payload.uid)
    await storyRef.update({
        uid: payload.uid,
        title: payload.title,
        body: payload.body,
        subtitle: payload.subtitle,
        author: payload.author,
        slug: payload.slug,
    })
    .then(() => {
        commit('REPLACE_STORY_FROM_LIST', payload)
    })
    .catch(function(err) {
        commit('SET_ERROR_MESSAGE', err)
    })
}

const searchStories = async ({ commit }, payload) => {
    const nameCapitalized = payload.charAt(0).toUpperCase() + payload.slice(1)
    const storiesRef = firebase.firestore().collection('stories')
    await storiesRef.where('title', '>', nameCapitalized)
    .get().then(snapshot => {
        if(snapshot.empty){
            commit('SET_STORIES_LIST', [])
            return
        } 
        commit('SET_STORIES_LIST', [])

        snapshot.forEach(doc => {
            let post = doc.data()
            post.uid = doc.id
            commit('ADD_STORY_TO_LIST', post)
        })
    }).catch(err => {
        commit('SET_ERROR_MESSAGE', err)
    })
}

const setLoadingStories = ({ commit }, payload ) => {
    commit('SET_LOADING_STORIES', payload)
}
 
export default {
    getStories,
    createStory,
    updateStoryImage,
    setSelectedStory,
    clearStoriesList,
    getStoryBySlug,
    deleteStory,
    editStory,
    searchStories,
    setLoadingStories
}