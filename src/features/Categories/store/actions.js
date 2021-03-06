import * as firebase from 'firebase/app'
import 'firebase/firestore'

const getCategories = async ({commit}) => {
    await firebase.firestore().collection('categories').get().then(snapshot => {
        if(snapshot.empty){
            commit('SETCATEGORIESLIST', [])
            return
        } 
        snapshot.forEach(doc => {
            const category = {
                uid: doc.id,
                name: doc.data().name,
                slug: doc.data().slug,
                type: doc.data().type
            }
            commit('ADDCATEGORYTOLIST', category)
        })
    }).catch(err => {
        alert(err)
    })
}

const createCategory = async ({commit}, payload) => {
    await firebase.firestore().collection('categories').add(payload)
    .then(categoryRef => {
        const category = {
            uid: categoryRef.id,
            name: payload.name,
            slug: payload.slug,
            type: payload.type
        }
        commit('ADDCATEGORYTOLIST', category)

    })
    .catch(err => {
        alert(err)
    })
}

const editCategory = async ({commit, state}, payload) => {
    const editedCategory = { 
        uid: state.selectedCategory.uid,
        name: payload.newName, 
        slug: payload.newSlug, 
        type: payload.newType 
    }

    const categoryRef = firebase.firestore().collection('categories').doc( state.selectedCategory.uid)
    commit('REMOVECATEGORYFROMLIST', state.selectedCategory)
    await categoryRef.update({ 
        name: payload.newName, 
        slug: payload.newSlug, 
        type: payload.newType 
    })
    .then(() => {
        commit('ADDCATEGORYTOLIST', editedCategory )
    })    
    .catch(function(err) {
        commit('ADDCATEGORYTOLIST', state.selectedCategory )
        alert(err)
    })
}

const deleteCategory = async ({commit, state}) => {
    const categoryRef = firebase.firestore().collection('categories')
                            .doc( state.selectedCategory.uid)
    commit('REMOVECATEGORYFROMLIST', state.selectedCategory)
    await categoryRef.delete()
    .then(() => {
        commit('SETSELECTEDCATEGORY', null)
    })    
    .catch(function(err) {
        commit('ADDCATEGORYTOLIST', state.selectedCategory )
        alert(err)
    })
}

const setSelectedCategory = ({commit}, payload) => {
    commit('SETSELECTEDCATEGORY', payload)
}

export default {
    getCategories,
    createCategory,
    setSelectedCategory,
    editCategory,
    deleteCategory,
    
}