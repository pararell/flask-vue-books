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
                <v-btn x-small @click="toggleModal('book_edit')"><v-icon small>mdi-pencil</v-icon></v-btn>
              </div>
              <div class="book_component-book-rating">
                <span v-if="book.rating">
                  <v-icon small color="amber">mdi-star</v-icon>
                  <span  class="book_component-book-smallinfo"> {{ book.rating }}</span>
                </span>
              </div>
                <div> <br/>
                  <v-chip
                      class="book_component-category"
                      v-for="category in book.categories"
                      :key="category.name"
                      :to="{ name: 'category', params: { categoryId: category.id }}"
                    >{{ category.name }}</v-chip>
                </div>
                <div><br/>
                  {{book.note}}
                </div>
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
       <modal v-if="showModal === 'book_edit'" @close="toggleModal('book_edit')">
        <template>
          <h3 slot="header">Book Edit</h3>
          <div slot="body">
            <div class="book_component-edit">
              <div class="book_component-changes">
                <div class="book_component-changes-top">
                  <v-switch v-model="book.isRead" :label="'Is readed'" inset></v-switch>
                  <v-text-field
                    type="text"
                    label="Position"
                    v-model="book.position"
                    name="position"
                    class="book_component-position"
                    :class="{ 'is-invalid': !book.position }"
                  ></v-text-field>
                </div> 
                   <v-textarea
                      name="input-7-1"
                      label="Note"
                      v-model="book.note"
                  ></v-textarea>
               </div>
                <div class="book_component-categories">
                  <v-select
                    v-model="chosenCategory"
                    :items="allCategories"
                    item-text="name"
                    item-value="id"
                    label="Category"
                  ></v-select>
                </div>
            </div>
          </div>
          <div slot="footer" class="books_component-book-modal-footer">
           <v-btn small :disabled="!book.position" @click="saveChanges()">Edit</v-btn>
           <v-btn small v-if="chosenCategory" @click="saveCategory()">Save Category</v-btn>
          </div>
        </template>
      </modal>
    </template>
  </div>
</template>

<script>
import Loader from "./Loader.vue";
import Books from "./Books.vue";
import Modal from './Modal.vue';
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      chosenCategory: 0
    };
  },
  components: {
    loader: Loader,
    books: Books,
    modal:  Modal
  },
  computed: {
    ...mapState("account", ["user"]),
    ...mapState("shelfs", ["allShelfs", "activeSort"]),
    ...mapState("categories", ["allCategories"]),
    ...mapState("books", ["book", "bookToShow", "status"]),
    ...mapState('modal', ['showModal'])
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
    ...mapActions('modal', ['toggleModal']),
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
        this.toggleModal('book_edit')
      }
    },
    saveChanges() {
      if (this.book.position) {
        const bookToSend = {...this.book, isRead: this.book.isRead ? 1 : 0}
        this.updateBookInfo(bookToSend);
        this.toggleModal('book_edit')
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.book_component {
  margin-top: 5px;
  background: #fffffa;

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
  &-book-rating {
    min-height: 24px;
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
  &-edit {
    display: flex;
    flex-wrap: wrap;

    @media (max-width: 600px) {
      flex-flow: column;
    }
  }
  &-categories {
    display: flex;
    flex-flow: column;
    padding: 10px;
    flex: 1;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  &-changes {
    padding: 10px;
    flex: 1;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  &-changes-top {
    display: flex;
    justify-content: space-between;
  }
  &-position {
    margin: 0 5px;
    align-items: center !important;
    max-width: 100px;
  }
}
</style>
