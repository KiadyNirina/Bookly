import api from '@/api';

export default {
    data() {
        return {
            book: null,
            books: [],
            userBooks: [],
            baseImageUrl: 'http://localhost:8000',
            currentPage: 1,
            lastPage: 1,
            currentPageUser: 1,
            lastPageUser: 1,
            perPage: 4,
            defaultImg: 'storage/images/default.jpg',
        };
    },
    mounted() {
        this.fetchBooks();
        this.fetchUserBooks();
    },
    computed: {
        hasMoreBooks() {
            return this.currentPage < this.lastPage;
        },
        hasMoreUserBooks() {
            return this.currentPageUser < this.lastPageUser;
        },
    },
    methods: {
        async fetchBooks() {
            try {
                const response = await api.getRecentBooks(this.currentPage, this.perPage);
                this.books = response.data.data.data;
                this.lastPage = response.data.data.last_page;
                console.log("Books fetched successfully:", this.books);
            } catch (error) {
                console.error("Erreur lors de la récupération des livres :", error.message);
            }
        },

        async fetchMoreBooks() {
            if (this.hasMoreBooks) {
                this.currentPage++;
                await this.fetchBooks();
            }
        },

        async fetchUserBooks() {
            try {
                const response = await api.getUserBook(this.currentPageUser, this.perPage);
                if (this.currentPageUser === 1) {
                    this.userBooks = response.data.data.data;
                } else {
                    this.userBooks = [...this.userBooks, ...response.data.data.data];
                }
                this.lastPageUser = response.data.data.last_page;
                console.log("User books fetched successfully:", this.userBooks);
            } catch (error) {
                console.error("Erreur lors de la récupération des livres utilisateur :", error.message);
            }
        },

        async fetchMoreUserBooks() {
            if (this.hasMoreUserBooks) {
                console.log("Fetching more user books...");
                this.currentPageUser++;
                return await this.fetchUserBooks();
            }
        },

        getImageUrl(picturePath) {
            return `${this.baseImageUrl}/${picturePath}`;
        },
    },
};
