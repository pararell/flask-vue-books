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
                    <h1>{{ book.title }} <span v-if="book.year">({{ book.year }})</span> </h1>
                    <h3>{{ book.author }}</h3>
                    <br/>
                    <div class="book_component-book-description" v-html="book.description"></div>
                </div>
                <div class="book_component-book-image-wrap">
                    <a v-bind:href="book.link" target="_blank">
                        <v-img class="book_component-book-image" v-bind:src="book.image"></v-img>
                    </a> <br/>
                    <v-btn small :to="{ name: 'shelf', params: { shelfId: book.shelf_id }}">Book shelf</v-btn>
                    <br/>
                    <div>
                      <v-select
                        v-model="chosenCategory"
                        :items="allCategories"
                        item-text="name"
                        item-value="id"
                        label="Category">
                      </v-select>
                      <v-btn small v-if="chosenCategory" @click="saveCategory()">Save Category</v-btn>
                    </div>

                </div>
            </div>
            <template v-if="status.loading">
                <loader></loader>
            </template>
         <div class="book_component-book-info">
          <div class="book_component-book-review" v-if="book.reviews" v-html="book.reviews"> </div>
          <div>
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
        </div>
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
    data() {
          return {
              chosenCategory:  0
          };
      },
    components: {
        loader: Loader,
        books: Books
    },
    computed: {
        ...mapState('account', ['user']),
        ...mapState('shelfs', ['allShelfs']),
        ...mapState('categories', ['allCategories']),
        ...mapState('books', ['book', 'bookToShow', 'status'])
    },
    mounted() {
        this.tokenRefresh();
        this.getAllCategories(this.user);

        if (!this.allShelfs && this.user) {
            this.getAllShelfs(this.user);
        }

        this.unsub = this.$store.subscribe((mutation, state) => {
            if (mutation.payload && mutation.type === 'account/userSave') {
                const book = { bookId: this.$route.params.bookId, shelf_id: this.$route.params.shelfId, user_id: this.user }
                this.getById(book);
            }

            if (mutation.payload && mutation.type === 'books/addBookSuccess') {
                this.getShelfById({ id: mutation.payload.shelf_id, user: this.user });
                this.$router.push({ name: 'shelf', params: { shelfId: mutation.payload.shelf_id } })
            }
        });
    },
    beforeDestroy() {
        this.unsub();
    },
    methods: {
        ...mapActions('account', ['tokenRefresh']),
        ...mapActions('books', ['getById', 'updateBook']),
        ...mapActions('categories', ['getAllCategories']),
        ...mapActions('shelfs', { getAllShelfs: 'getAllShelfs', getShelfById: 'getById' }),

        saveCategory() {
          if (this.chosenCategory) {
            const bookToUpdate = {
              ...this.book,
              category_id: this.chosenCategory
            }
            this.updateBook(bookToUpdate);
          }
        }
    }

};
</script>

<style lang="scss" scoped>
.book_component {
    &-book-wrapp {
        display: flex;
        flex-wrap: wrap;
        flex-flow: column;
    }
    &-book-detail {
        display: flex;
        box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
        padding: 20px;
        margin: 10px 0 30px 0;
        background: #fff;
    }
    &-book-description {
        font-size: 16px;
        line-height: 18px;
    }
    &-book-description p {
        font-size: 16px;
        line-height: 18px;
    }
    &-book-image-wrap {
        padding: 30px;
        display: flex;
        flex-flow: column;
        align-items: center;
    }
    &-book-image {
        min-width: 130px;
    }
    &-book-info {
      display: flex;
      flex-flow: column;
    }
    &-book-review {
        box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
        padding: 25px;
        background: #fff;
        margin-bottom: 20px;
    }
}
</style>
