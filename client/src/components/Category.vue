<template>
    <div class="category_component">

        <template v-if="status.loading">
            <loader></loader>
       </template>

      <template v-if="!status.loading && category">
        <div class="category_component-header"
          v-bind:style="{ 'background-image': 'url(' + ( category.image || 'https://cdn5.teebooks.com/256-large_default/bookshelf-u-60-cm.jpg') + ')'}">
            <div class="category_component-background">
                <h1 class="category_component-header-title"> <span> {{category.name}} </span>
                </h1>
            </div>
        </div>

        <v-container class="category_component-container" v-if="category.books && category.books.length">
            <sort v-bind:type="'categories'" v-bind:count="category.books.length"></sort>
            <div class="category_component-books">
                <div v-for="book in category.books" :key="book.id" class="category_component-book">
                    <div class="category_component-book-content" @click="saveBook(book)">
                        <router-link class="category_component-book-text"
                          :to="{ name: 'book', params: { shelfId: book.shelf_id, bookId: book.bookId }}">
                            <v-img v-bind:src="book.image"></v-img>
                            <b class="category_component-book-title"> {{ book.title }}</b> <br/><br/>
                            <span class="category_component-book-author"> {{ book.author }}</span> <br/>
                            <span class="category_component-book-title"> {{ book.year }}</span>
                        </router-link>
                    </div>
                    <div class="category_component-book-remove" @click="remove(book)">×</div>
                </div>
            </div>

        </v-container>
      </template>
  </div>
</template>

<script>
import Loader from './Loader.vue';
import Sort from './Sort.vue';
import { mapState, mapActions } from 'vuex';


export default {
    data() {
        return {
        };
    },
    components: {
        loader  : Loader,
        sort    : Sort
    },
    computed: {
        ...mapState('categories', ['status', 'category']),
        ...mapState('account', ['user'])
    },
    created() {
        this.tokenRefresh();

        this.unsub = this.$store.subscribe((mutation, state) => {
            if (mutation.type === 'account/userSave' && mutation.payload) {
                this.getById({ id: this.$route.params.categoryId, user: this.user });
            }

        });
    },
    beforeDestroy() {
        this.unsub();
    },
    methods: {
        ...mapActions('categories', ['getById', 'updateCategory']),
        ...mapActions('account', ['tokenRefresh']),
        ...mapActions('books', ['saveBookToStore']),

      saveBook(book) {
            this.saveBookToStore(book);
        },

      remove(book) {
          const bookToRemove = {
              ...this.category,
              book_id: book.id
          }
          this.updateCategory(bookToRemove);
        }
    }

};
</script>

<style lang="scss" scoped>

.category_component {
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
