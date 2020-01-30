import store  from '../store/index'

export default (to, from, next) => {
    let loggedUser = store.getters['Accounts/loggedUser']
    if(loggedUser.id && 
        (loggedUser.role.length > 0 && loggedUser.role[0].includes('admin'))
    ){
        next()
    } else {
        store.dispatch('Accounts/setAuthError', {message: "Oooopsie... you may have to login first!"})
        next('/')
    }
}