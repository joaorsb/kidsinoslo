const SETUSER = (state, payload) => {
    state.user = payload
}

const LOGINUSER = (state, payload) => {
    state.user = payload
}

const SETLOADING = (state, payload) => {
    state.isLoading = payload
}

const SETAUTHERROR = (state, payload) => {
    state.authError = payload
}

const SETTOKEN = (state, payload) => {
    state.token = payload
}

const CLEARAUTHERROR = (state) => {
    state.authError = null
}

const CLEARTOKEN = (state) => {
    state.token = null
}

const CLEARUSER = (state) => {
    state.user = {
        id: undefined,
        name: undefined,
        email: undefined,
        password: ''
    }
}

export default {
    SETUSER,
    LOGINUSER,
    SETLOADING,
    SETAUTHERROR,
    CLEARAUTHERROR,
    CLEARUSER,
    SETTOKEN,
    CLEARTOKEN,

}