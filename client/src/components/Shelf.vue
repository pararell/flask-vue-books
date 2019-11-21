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

        <v-container class="shelf_component-container" >
            <sort v-if="shelf.books && shelf.books.length" v-bind:type="'shelfs'" v-bind:count="shelf.books.length"></sort>
            <div class="shelf_component-books" v-if="shelf.books && shelf.books.length">
                <div v-for="book in shelf.books" :key="book.id" class="shelf_component-book">
                    <div class="shelf_component-book-content" @click="saveBook(book)">
                        <router-link class="shelf_component-book-link"
                          :to="{ name: 'book', params: { shelfId: book.shelf_id, bookId: book.bookId }}">
                            <v-img class="shelf_component-book-image" v-bind:src="book.image"></v-img>
                        </router-link>
                        <div class="shelf_component-book-text">
                            <b class="shelf_component-book-title"> {{ book.title }}</b> <br/><br/>
                            <span class="shelf_component-book-author"> {{ book.author }}</span> <br/>
                            <span class="shelf_component-book-title"> {{ book.year }}</span>
                            <br/>
                            <v-chip class="shelf_component-category" v-for="category in book.categories" :key="category.name"
                              :to="{ name: 'category', params: { categoryId: category.id }}">
                                {{ category.name }}
                            </v-chip>
                        </div>
                    </div>
                    <div class="shelf_component-book-remove" @click="remove(book)">×</div>
                </div>
            </div>

            <form @submit.prevent="handleSubmit" class="shelf_component-form">
                <div class="form-group">
                    <v-text-field
                      type="text"
                      label="Name"
                      v-model="name"
                      name="name"
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
import Sort from './Sort.vue';
import { mapState, mapActions } from 'vuex';


export default {
    data() {
        return {
            name: '',
            submitted: false
        };
    },
    components: {
        loader  : Loader,
        books   : Books,
        sort    : Sort
    },
    computed: {
        ...mapState('shelfs', ['status', 'shelf', 'allShelfs']),
        ...mapState('account', ['user']),
        ...mapState('books', {
            foundBooks  : 'foundBooks',
            bookToShow  : 'bookToShow',
            booksStatus : 'status'
        })
    },
    created() {
        this.tokenRefresh();

        if (!this.allShelfs && this.user) {
            this.getAllShelfs(this.user);
        }

        this.unsub = this.$store.subscribe((mutation, state) => {
            if (mutation.type === 'account/userSave' && mutation.payload && (!this.shelf || this.shelf && this.shelf.id != this.$route.params.shelfId)) {
                this.getById({ id: this.$route.params.shelfId, user: this.user });
            }

            if (mutation.type === 'books/removeBookSuccess' || mutation.type === 'books/addBookSuccess') {
                this.getById({ id: this.$route.params.shelfId, user: this.user });
            }

        });
    },
    beforeDestroy() {
        this.unsub();
    },
    methods: {
        ...mapActions('shelfs', ['getById', 'getAllShelfs']),
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
    margin-bottom: 50px;
  }

  &-book {
    max-width: 500px;
    min-width: 300px;
    min-height: 200px;
    margin: 10px 15px 0 0;
    background: #fff;
    display: flex;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
    padding: 8px;
    position: relative;
    flex: 1 0 0;
  }

  &-book-content {
      flex: 1;
      display: flex;
  }

  &-book-remove {
    display: flex;
    justify-content: flex-end;
    align-self: flex-end;
    padding: 0 10px;
    color: rgba(217, 30, 24, 1);
    font-size: 12px;
    box-shadow: 0px 0px 2px rgba(217, 30, 24, 0.5);
  }

  &-book-image {
    max-width: 150px;
    min-width: 150px;
    margin-right: 10px;
    cursor: pointer;
  }

  &-book-text,
  &-book-title,
  &-book-author {
    text-decoration: none;
    color: rgba(0, 0, 0, 0.9);
    text-align: center;
  }

  &-category {
    margin-top: 2px !important;
  }

  &-form {
    margin-bottom: 25px;
  }
}


</style>
