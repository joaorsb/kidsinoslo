const unreadMessages = (state) => {
    const unread = new Set()
    state.messagesList.filter(message => { 
        if(message.read === false) {
            unread.add(message)
        }
    })
    return [...unread]
}

const readMessages = (state) => {
    const read = new Set()
    state.messagesList.filter(message => { 
        if(message.read === true) {
            read.add(message)
        }
    })
    return [...read]
}

export default {
    unreadMessages,
    readMessages
}