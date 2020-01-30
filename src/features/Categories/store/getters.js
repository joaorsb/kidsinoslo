const paidCategories = (state) => {
    return state.categoriesList.filter(category => category.type === "Paid")
}

const freeCategories = (state) => {
    return state.categoriesList.filter(category => category.type === "Free")
}

export default {
    paidCategories,
    freeCategories,
}