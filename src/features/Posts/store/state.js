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
        imageName: null
    },
    postsList: [],
    errorMessage: '',
    selectedPost: undefined,
    languages: [
        { name: 'Norsk', value: 'no' },
        { name: 'English', value: 'en' }
    ],
    columnsFlex: [
        12, 6
    ],
    currentUid: null
}