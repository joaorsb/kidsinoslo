const SETSELECTEDCATEGORY = (state, payload) => {
    state.selectedCategory = payload
}

const SETCATEGORIESLIST = (state, payload) => {
    state.categoriesList = payload
}

const ADDCATEGORYTOLIST = (state, payload) => {
    state.categoriesList.push(payload)
}

const REMOVECATEGORYFROMLIST = (state, payload) => {
    state.categoriesList = state.categoriesList.filter(category => category.slug !== payload.slug)
}

export default {
    SETSELECTEDCATEGORY,
    SETCATEGORIESLIST,
    ADDCATEGORYTOLIST,
    REMOVECATEGORYFROMLIST
}