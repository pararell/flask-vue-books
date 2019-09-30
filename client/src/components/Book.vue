<template>
  <div class="book_component">

    <template v-if="status.loading && !book">
      <loader></loader>
    </template>

    <template v-if="book">
      <v-container>
        <div class="book_component-book-wrapp">
          <div class="book_component-book-detail">
              <div>
                  <h1>{{ book.title }} ({{ book.year }})</h1>
                  <h3>{{ book.author }}</h3>
                  <a v-if="book.link" v-bind:href="book.link" target="_blank">Goodreads</a> <br/>
                  <br/>
                  <div class="book_component-book-description" v-html="book.description"></div>
              </div>
              <div class="book_component-book-image-wrap">
                  <v-img class="book_component-book-image" v-bind:src="book.image"></v-img>
              </div>
          </div>
          <template v-if="status.loading">
            <loader></loader>
          </template>
          <h2 v-if="book.similarBooks"> Similar books </h2>
          <books v-if="book.similarBooks"
            v-bind:books="book.similarBooks"
            v-bind:bookDetail="bookToShow"
            v-bind:user="user"
            v-bind:shelf="$route.params.shelfId"
            v-bind:shelfs="allShelfs"
            v-bind:loading="status.loadingBookToShow"
          ></books>
        </div>
      </v-container>
    </template>

  </div>
</template>

<script>
import Loader from './Loader.vue';
import Books from './Books.vue';
import { mapState, mapActions } from 'vuex';

export default {
    components: {
        loader: Loader,
        books: Books
    },
    computed: {
        ...mapState('account', ['user']),
        ...mapState('shelfs', ['allShelfs']),
        ...mapState('books', ['book', 'bookToShow', 'status'])
    },
    mounted() {
        this.tokenRefresh();

        if (!this.allShelfs && this.user) {
            this.getAllShelfs(this.user);
        }

        this.unsub = this.$store.subscribe((mutation, state) => {
            if (mutation.payload && mutation.type === 'account/userSave') {
                const book = { bookId: this.$route.params.bookId, shelf_id: this.$route.params.shelfId }
                this.getById(book);
            }

            if (mutation.type === 'books/addBookSuccess') {
                this.getAllShelfs(this.user);
            }
        });
    },
    beforeDestroy() {
        this.unsub();
    },
    methods: {
        ...mapActions('account', ['tokenRefresh']),
        ...mapActions('books', ['getById']),
        ...mapActions('shelfs', ['getAllShelfs']),
    }

};
</script>

<style lang="scss" scoped>
.book_component {
    &-book-wrapp {
        display: flex;
        flex-wrap: wrap;
    }
    &-book-detail {
        display: flex;
        box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
        padding: 20px;
        margin: 10px 0 30px 0;
    }
    &-book-description {
        font-size: 18px;
        line-height: 20px;
    }
    &-book-description p {
        font-size: 18px;
        line-height: 20px;
    }
    &-book-image-wrap {
        padding: 30px;
    }
    &-book-image {
        min-width: 130px;
    }
}
</style>
