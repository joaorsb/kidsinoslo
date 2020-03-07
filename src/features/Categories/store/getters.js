const paidCategories = (state) => {
    const paidCategories = new Set()
    const categoriesList = state.categoriesList.filter(category => category.type === "Paid")
    categoriesList.sort((a, b) => a.name.localeCompare(b.name))
    categoriesList.map(free => paidCategories.add(free))
    return [...paidCategories]
}

const freeCategories = (state) => {
    const freeCategories = new Set()
    const freeList = state.categoriesList.filter(category => category.type === "Free")
    freeList.sort((a, b) => a.name.localeCompare(b.name))
    freeList.map(free => freeCategories.add(free))
    return [...freeCategories]
}

export default {
    paidCategories,
    freeCategories,
}