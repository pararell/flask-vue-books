<template>
    <div class="shelf_component">
        <template v-if="status.loading">
            <loader></loader>
       </template>

      <template v-if="!status.loading && shelf">
        <div class="shelf_component-header"
          v-bind:style="{ 'background-image': 'url(' + ( shelf.image || 'https://cdn5.teebooks.com/256-large_default/bookshelf-u-60-cm.jpg') + ')'}">
            <div class="shelf_component-background">
                <h1 class="shelf_component-header-title"> <span> {{shelf.name}} <br/> ( {{shelf.category}} )</span>
                </h1>
            </div>
        </div>

        <v-container class="shelf_component-container">

            <div class="shelf_component-books" v-if="shelf.books.length">
                <div v-for="book in shelf.books" :key="book.id" class="shelf_component-book">
                    <div class="shelf_component-book-content" @click="saveBook(book)">
                        <router-link class="shelf_component-book-text"
                          :to="{ name: 'book', params: { shelfId: book.shelf_id, bookId: book.bookId }}">
                            <v-img v-bind:src="book.image"></v-img>
                            <b class="shelf_component-book-title"> {{ book.title }}</b> <br/><br/>
                            <span class="shelf_component-book-author"> {{ book.author }}</span> <br/>
                            <span class="shelf_component-book-title"> {{ book.year }}</span>
                        </router-link>
                    </div>
                    <div class="shelf_component-book-remove" @click="remove(book)">×</div>
                </div>
            </div>

            <form @submit.prevent="handleSubmit">
                <div class="form-group">
                    <v-text-field type="text" label="Name" v-model="name" name="name"
                      :class="{ 'is-invalid': submitted && !name }">
                    </v-text-field>
                    <div v-show="submitted && !name" class="invalid-feedback">Name is required</div>
                </div>
                <v-btn class="mr-4" @click="handleSubmit">Search books</v-btn>
            </form>

            <books v-if="foundBooks"
              v-bind:books="foundBooks"
              v-bind:bookDetail="bookToShow"
              v-bind:user="user"
              v-bind:shelf="shelf.id"
              v-bind:shelfs="allShelfs"
              v-bind:loading="booksStatus.loadingBookToShow">
            </books>

        </v-container>
      </template>

  </div>
</template>

<script>
import Loader from './Loader.vue';
import Books from './Books.vue';
import { mapState, mapActions } from 'vuex';

export default {
    data() {
        return {
            name: '',
            submitted: false,
        };
    },
    components: {
        loader  : Loader,
        books   : Books
    },
    computed: {
        ...mapState('shelfs', ['status', 'shelf', 'allShelfs']),
        ...mapState('account', ['user']),
        ...mapState('books', {
            foundBooks  : 'foundBooks',
            bookToShow  : 'bookToShow',
            booksStatus : 'status'
        }),
    },
    mounted() {
        this.tokenRefresh();

        if (!this.allShelfs && this.user) {
            this.getAllShelfs(this.user);
        }

        this.unsub = this.$store.subscribe((mutation, state) => {
            if (mutation.type === 'account/userSave' && mutation.payload && (!this.shelf || this.shelf && this.shelf.name !== this.$route.params.shelfName)) {
                this.getByName({ name: this.$route.params.shelfName, user: this.user });
            }

            if (mutation.type === 'books/removeBookSuccess' || mutation.type === 'books/addBookSuccess') {
                this.getByName({ name: this.$route.params.shelfName, user: this.user });
            }

        });
    },
    beforeDestroy() {
        this.unsub();
    },
    methods: {
        ...mapActions('shelfs', ['getByName', 'getAllShelfs']),
        ...mapActions('account', ['tokenRefresh']),
        ...mapActions('books', ['searchBooks', 'saveBookToStore', 'removeBook']),

        initForm() {
            this.name = '';
        },

        handleSubmit(evt) {
            this.submitted = true;
            this.searchBooks(this.name);
        },

        saveBook(book) {
            this.saveBookToStore(book);
        },
        remove(book) {
          const bookToRemove = {
              ...book,
              shelf_id: this.shelf.id
          }
          this.removeBook(bookToRemove);
        }

    }

};
</script>

<style lang="scss" scoped>

.shelf_component {
  position: relative;

  &-header {
    min-height: 150px;
    width: 100%;
    background-repeat: repeat;
    background-position: center;
    background-size: contain;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    position: relative;
  }

  &-header-title {
    text-align: center;
    font-family: 'Gentium Book Basic', serif;
  }

  &-background {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-container {
     z-index: 10;
  }

  &-books {
    display: flex;
    flex-wrap: wrap;
  }

  &-book {
    width: 150px;
    margin: 10px 15px 0 0;
    background: #fff;
    display: flex;
    flex-flow: column;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
    padding: 10px;
    cursor: pointer;
  }

  &-book-content {
      flex: 1;
  }

  &-book-remove {
    display: flex;
    justify-content: flex-end;
    padding: 0 10px;
    color: rgba(217, 30, 24, 1);
    font-size: 12px;
    box-shadow: 0px 0px 2px rgba(217, 30, 24, 0.5);
    cursor: pointer;
    align-self: flex-end;
  }

  &-book-text,
  &-book-title,
  &-book-author {
    text-decoration: none;
    color: rgba(0, 0, 0, 0.9);
  }
}


</style>
