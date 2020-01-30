import { firestore, storage } from 'firebase'

const getPosts = async ({commit}) => {
    const postsRef = firestore().collection('posts')
    await postsRef.orderBy('createdAt').get().then(snapshot => {
        if(snapshot.empty){
            commit('SETPOSTSLIST', [])
            return
        } 
        snapshot.forEach(doc => {
            commit('ADDPOSTTOLIST', doc.data())
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
        console.log(error)
    })
    
}

const setSelectedPost = ({commit}, payload) => {
    commit('SETSELECTEDPOST', payload)
}

export default {
    getPosts,
    createPost,
    setSelectedPost,
}