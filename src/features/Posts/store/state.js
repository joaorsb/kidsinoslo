export default {
    post: {
        uid: null,
        title: undefined,
        description: '',
        address: null,
        neighborhood: null,
        flex: 12,
        lat: null,
        lng: null,
        owner: undefined,
        author: undefined,
        category: undefined,
        language: 'no',
        slug: undefined,
        createdAt: new Date(),
        imageName: null,
        siteUrl: null,
        availableforCarousel: false,
        outdoor: true,
    },
    postsList: [],
    snackText: '',
    errorMessage: '',
    selectedPost: null,
    languages: [
        { name: 'Norsk', value: 'no' },
        { name: 'English', value: 'en' }
    ],
    columnsFlex: [
        12, 6
    ],
    currentUid: null,
    neighborhoodList: [],
    selectedNeighborhood: null,
    paginatedPosts: [],
    page: 1,
    paginationSize: 26,
    selectedLanguage: 'no',
    loadingPosts: false,
    navBarMenu: false,
    newNeighborhood: {
        name: null,
        lat: null,
        lng: null
    },
    selectedPlace: null
}