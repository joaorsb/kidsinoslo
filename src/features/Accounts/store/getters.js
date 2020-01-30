const authError = (state) => {
    return state.authError
}

const isLoading = (state) => {
    return state.isLoading
}

const loggedUser = (state) => {
    return state.user
}

const loadingLabel = (state) => {
    return state.loadingLabel
}

const token = (state) => {
    return state.token
}

const isAdmin = (state) => {
    return state.user.role  !== [] && state.user.role.includes('admin')
}

export default {
    authError,
    isLoading,
    loggedUser,
    loadingLabel,
    token,
    isAdmin
}