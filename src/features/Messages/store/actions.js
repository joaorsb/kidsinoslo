import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'

const getMessages = async ({ commit }) => {
    const messagesRef = firebase.firestore().collection('messages')
    await messagesRef.orderBy('createdAt').get().then(snapshot => {
        if(snapshot.empty){
            commit('SET_MESSAGES_LIST', [])
            return
        } 
        snapshot.forEach(doc => {
            let message = doc.data()
            message.uid = doc.id
			message.imageUrl = ""
			if(message.hasImage) {
				const baseImageUri = `https://firebasestorage.googleapis.com/v0/b/kids-in-oslo.appspot.com/o/messages%2F${message.uid}%2F`
				message.imageUrl = `${baseImageUri}${message.imageName}?alt=media`
			}
            commit('ADD_TO_MESSAGES_LIST', message)
        })
    }).catch(err => {
        commit('SET_ERROR', err)
    })
}

const createMessage = async ({commit}, payload) => {
	let image = null
	if(payload.image) {
		image = payload.image
		delete payload.image
	}
    payload.createdAt = new Date()
    await firebase.firestore().collection('messages').add(payload).then(messageRef => {
        payload.uid = messageRef.id
        commit('ADD_TO_MESSAGES_LIST', payload)
		if(image) {
			const storageRef = firebase.storage().ref().child(`messages/${payload.uid}/${image.info.name}`)
			storageRef.putString(image.dataUrl, 'data_url')
		}

    }).catch(error => {
        commit('SET_ERROR', error)
    })
}

const deleteMessage = async ({ commit }, payload) => {
    const messageRef = firebase.firestore().collection('messages')
    .doc(payload.uid)
    await messageRef.delete()
    .then(() => {
        commit('REMOVE_FROM_MESSAGES_LIST', payload)
        commit('SET_SELECTED_MESSAGE', null)
		if(payload.hasImage) {
			const storageRef = firebase.storage().ref().child(`messages/${payload.uid}/${payload.imageName}`)
			storageRef.delete()
		}
    })    
    .catch(function(err) {
        commit('SET_ERROR', err.message)
    })
}

const updateMessage = async ({ commit }, payload) => {
    const messageRef = firebase.firestore().collection('messages')
    .doc(payload.uid)
    await messageRef.update({
        uid: payload.uid,
        read: true
    }).then(() => {
        payload.read = true
    })
    .catch(function(err) {
        commit('SET_ERROR', err)
    })
}

const setSelectedMessage = ({ commit }, payload) => {
    commit('SET_SELECTED_MESSAGE', payload)
}

export default {
    getMessages,
    createMessage,
    deleteMessage,
    updateMessage,
    setSelectedMessage
}
