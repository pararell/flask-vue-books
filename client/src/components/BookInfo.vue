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
              <span v-if="book.pages">
                <v-icon>mdi-book-open-page-variant</v-icon>
                {{ book.pages }}
                <br />
              </span>
              <span v-if="book.rating">
                <v-icon>mdi-star</v-icon>
                {{ book.rating }}
                <br />
              </span>
              <br />
              <div>
                <form>
                  <div class="form-group">
                    <v-switch v-model="bookIsRead" :label="'Book is readed'"></v-switch>
                    <v-select
                      v-model="chosenShelf"
                      :items="allShelfs"
                      item-text="name"
                      item-value="id"
                      label="Shelf"
                    ></v-select>
                  </div>
                  <v-btn @click="handleBookSave" :disabled="!chosenShelf">Save book</v-btn>
                </form>
              </div>
              <br />
            </div>
          </div>
          <template v-if="status.loading">
            <loader></loader>
          </template>
          <div class="book_component-book-info">
            <div class="book_component-book-review" v-if="book.reviews">
              <div v-if="showReviews" v-html="book.reviews"></div>
              <v-btn @click="showReviews = !showReviews">Toggle Goodreads reviews</v-btn>
            </div>
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
      bookIsRead: false,
      showReviews: false,
      chosenShelf: ""
    };
  },
  components: {
    loader: Loader,
    books: Books
  },
  computed: {
    ...mapState("account", ["user"]),
    ...mapState("shelfs", ["allShelfs"]),
    ...mapState("books", ["book", "bookToShow", "status"])
  },
  mounted() {
    this.tokenRefresh();

    if (!this.allShelfs && this.user) {
      this.getAllShelfs(this.user);
    }

    this.unsub = this.$store.subscribe((mutation, state) => {
      if (mutation.payload && mutation.type === "account/userSave") {
        this.getInfoById(this.$route.params.bookId);
      }

      if (mutation.payload && mutation.type === "books/addBookSuccess") {
        this.getShelfById({ id: mutation.payload.shelf_id, user: this.user });
        this.$router.push({
          name: "shelf",
          params: { shelfId: mutation.payload.shelf_id }
        });
      }
    });
  },
  beforeDestroy() {
    this.unsub();
  },
  methods: {
    ...mapActions("account", ["tokenRefresh"]),
    ...mapActions("books", ["getInfoById", "addBook"]),
    ...mapActions("shelfs", {
      getAllShelfs: "getAllShelfs",
      getShelfById: "getById"
    }),
    handleBookSave(event) {
      const book = {
        ...this.book,
        isRead: this.bookIsRead,
        shelf_id: this.chosenShelf,
        user_id: this.user
      };
      this.addBook(book);
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
    justify-content: space-between;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
    padding: 20px;
    margin: 10px 0 5px 0;

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
    padding: 15px;
    margin: 0 10px;
    min-width: 180px;
    display: flex;
    flex-flow: column;
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
    margin-bottom: 20px;
  }
}
</style>
