export default {
    story: {
        uid: null,
        title: '',
        subtitle: '',
        body: '',
        imageName: null,
        createdAt: new Date(),
        author: undefined,
        slug: undefined,
        imageUrl: null
    },
    storiesList: [],
    selectedStory: null,
    errorMessage: null,
    paginationPage: 1,
    paginationSize: 20,
    loadingStories: false
}