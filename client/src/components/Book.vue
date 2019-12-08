<template>
  <div class="book_component">
    <template v-if="status.loading && !book">
      <loader></loader>
    </template>
    <template v-if="book">
      <v-container>
        <div class="book_component-book-wrapp">
          <div class="book_component-book-shelf-link">
            <v-btn v-if="!activeSort" x-small
                :to="{ name: 'shelf', params: { shelfId: book.shelf_id }}"
              ><v-icon small>mdi-bookmark-multiple</v-icon></v-btn>
              <v-btn v-if="activeSort" x-small
                :to="{ name: 'shelf', params: { shelfId: book.shelf_id }, query: {sort: activeSort.name + '-' + activeSort.active}}"
              ><v-icon small>mdi-bookmark-multiple</v-icon></v-btn>
          </div>
          <div class="book_component-book-detail">
            <div>
              <h1>
                {{ book.title }}
                <span v-if="book.year">({{ book.year }})</span>
              </h1>
              <h3>{{ book.author }}</h3>
              <br />
              <div class="book_component-book-description" v-html="book.description"></div>
            </div>
            <div class="book_component-book-image-wrap">
              <a v-bind:href="book.link" target="_blank">
                <v-img class="book_component-book-image" v-bind:src="book.image"></v-img>
              </a>
              <div class="book_component-book-pages">
                <span v-if="book.pages">
                  <v-icon small color="blue-grey darken-3">mdi-book-open-page-variant</v-icon>
                  <span class="book_component-book-smallinfo"> {{ book.pages }}</span> &nbsp;&nbsp;
                </span>
                <v-btn x-small @click="editOpen = !editOpen"><v-icon small>mdi-pencil</v-icon></v-btn>
              </div>
              <span v-if="book.rating">
                <v-icon small color="amber">mdi-star</v-icon>
                <span  class="book_component-book-smallinfo"> {{ book.rating }}</span>
              </span>
              <div>
                <div class="book_component-changes">
                  <div v-if="editOpen">
                  <v-switch v-model="book.isRead" :label="'Is readed'" inset></v-switch>
                  <v-text-field
                    type="text"
                    label="Position"
                    v-model="book.position"
                    name="position"
                    :class="{ 'is-invalid': !book.position }"
                  ></v-text-field>
                  <v-btn small :disabled="!book.position" @click="savePositionAndReadStatus()">Save</v-btn>
                  </div>
                  <br />
                </div>
                <div>
                  <v-chip
                    class="book_component-category"
                    v-for="category in book.categories"
                    :key="category.name"
                    :to="{ name: 'category', params: { categoryId: category.id }}"
                  >{{ category.name }}</v-chip>
                </div>
                <v-select v-if="editOpen"
                  v-model="chosenCategory"
                  :items="allCategories"
                  item-text="name"
                  item-value="id"
                  label="Category"
                ></v-select>
                <v-btn small v-if="chosenCategory && editOpen" @click="saveCategory()">Save Category</v-btn>
              </div>
              <!-- <v-btn
                v-if="!activeSort"
                small
                :to="{ name: 'shelf', params: { shelfId: book.shelf_id }}"
              >Book shelf</v-btn>
              <v-btn
                v-if="activeSort"
                small
                :to="{ name: 'shelf', params: { shelfId: book.shelf_id }, query: {sort: activeSort.name + '-' + activeSort.active}}"
              >Book shelf</v-btn> -->
            </div>
          </div>
          <template v-if="status.loading">
            <loader></loader>
          </template>
          <div class="book_component-book-info">
            <div class="book_component-book-review" v-if="book.reviews" v-html="book.reviews"></div>
            <div v-if="book.similarBooks && book.similarBooks.length">
              <h2 v-if="book.similarBooks">Similar books</h2>
              <books
                v-if="book.similarBooks"
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
import Loader from "./Loader.vue";
import Books from "./Books.vue";
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      chosenCategory: 0,
      editOpen: false
    };
  },
  components: {
    loader: Loader,
    books: Books
  },
  computed: {
    ...mapState("account", ["user"]),
    ...mapState("shelfs", ["allShelfs", "activeSort"]),
    ...mapState("categories", ["allCategories"]),
    ...mapState("books", ["book", "bookToShow", "status"])
  },
  mounted() {
    this.tokenRefresh();
    this.getAllCategories(this.user);

    if (!this.allShelfs && this.user) {
      this.getAllShelfs(this.user);
    }

    this.unsub = this.$store.subscribe((mutation, state) => {
      if (mutation.payload && mutation.type === "account/userSave") {
        const book = {
          bookId: this.$route.params.bookId,
          shelf_id: this.$route.params.shelfId,
          user_id: this.user
        };
        this.getById(book);
      }

      if (mutation.payload && mutation.type === "books/addBookSuccess") {
        this.getShelfById({ id: mutation.payload.shelf_id, user: this.user });
        this.$router.push({
          name: "shelf",
          params: { shelfId: mutation.payload.shelf_id }
        });
      }

      if (mutation.payload && mutation.type === "books/updateBookSuccess") {
        this.getShelfById({ id: mutation.payload.shelf_id, user: this.user });
      }
    });
  },
  beforeDestroy() {
    this.unsub();
  },
  methods: {
    ...mapActions("account", ["tokenRefresh"]),
    ...mapActions("books", ["getById", "updateBook", "updateBookInfo"]),
    ...mapActions("categories", ["getAllCategories"]),
    ...mapActions("shelfs", {
      getAllShelfs: "getAllShelfs",
      getShelfById: "getById"
    }),

    saveCategory() {
      if (this.chosenCategory) {
        const bookToUpdate = {
          ...this.book,
          category_id: this.chosenCategory
        };
        this.updateBook(bookToUpdate);
        this.editOpen = false;
      }
    },
    savePositionAndReadStatus() {
      if (this.book.position) {
        const bookToSend = {...this.book, isRead: this.book.isRead ? 1 : 0}
        this.updateBookInfo(bookToSend);
        this.editOpen = false;
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
    position: relative;
  }
  &-book-detail {
    display: flex;
    justify-content: space-between;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
    padding: 20px;
    margin: 10px 0 5px 0;
    background: #fff;
    position: relative;

    @media (max-width: 600px) {
      flex-wrap: wrap;
    }
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
    padding: 0 10px;
    margin: 0 10px;
    min-width: 180px;
    display: flex;
    flex-flow: column;
    // align-items: center;
  }
  &-book-shelf-link {
    position: absolute;
    top: 5px;
    right: 0;
    z-index: 10;
  }
  &-book-image {
    min-width: 130px;
  }
  &-book-pages {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
  }
  &-book-smallinfo {
    font-size: 15px;
    color: rgba(0, 0, 0, 0.6);
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
