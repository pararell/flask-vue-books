<template>
 <div class="books_component">
    <div class="books_component-books" v-if="books">
    <v-sheet class="mx-auto"  max-width="1200">
      <v-slide-group show-arrows>
        <v-slide-item class="books_component-book" v-for="book in books" :key="book.id">
              <div class="books_component-book-content"  @click="chooseBook(book)">
                  <v-img class="books_component-book-image" v-bind:src="book.image"></v-img>
                  <div class="books_component-book-detail">
                    <div>
                      <b>{{ book.title }}</b>
                    </div>
                    <div>
                      <span>{{ book.author }} </span> <span> {{ book.year }}</span>
                    </div>
                  </div>
                  <!-- <p class="books_component-book-rating">{{ book.rating }}</p> -->
              </div>
          </v-slide-item>
        </v-slide-group>
      </v-sheet>
  </div>

  <modal v-if="showModal" @close="toggleModal">
    <template v-if="loading">
      <div slot="body">
        <loader></loader>
      </div>
    </template>
    <template v-if="!loading">
      <h3 slot="header">{{ bookDetail.title }} <span v-if="bookDetail.year">({{bookDetail.year}})</span> </h3>
      <div slot="body">
        <p v-html="bookDetail.description"> </p>
        <a v-if="bookDetail.link" v-bind:href="bookDetail.link" target="_blank">Goodreads</a>
      </div>
      <div slot="footer" class="books_component-book-modal-footer">
        <form>
          <div class="form-group">
              <v-switch v-model="bookIsRead" :label="'Book is readed'"></v-switch>
              <v-select
                v-model="chosenShelf"
                :items="shelfs"
                item-text="name"
                item-value="id"
                label="Shelf">
              </v-select>
          </div>
          <div class="books_component-book-modal-button-save">
              <v-btn class="btn btn-primary" @click="handleBookSave">Save book</v-btn>
          </div>
        </form>
          <v-btn class="books_component-book-modal-button-close" @click="toggleModal">
            OK
        </v-btn>
      </div>
    </template>
  </modal>

 </div>

</template>

<script>
  import Modal from './Modal.vue';
  import Loader from './Loader.vue';
  import { mapState, mapActions } from 'vuex';

  export default {
        data() {
          return {
              bookIsRead: false,
              chosenShelf: this.shelfs ? (this.shelfs.filter(shelf => shelf.id == this.shelf)[0] || this.shelfs[0]) : {}
          };
      },
      props: ['books', 'loading', 'user', 'shelf', 'shelfs', 'bookDetail'],
          computed: {
          ...mapState('modal', ['showModal']),
    },
      components: {
          modal: Modal,
          loader: Loader
      },
      methods: {
        ...mapActions('books', ['showBook', 'addBook', 'removeFoundBooks']),
        ...mapActions('modal', ['toggleModal']),

        chooseBook(book) {
          this.toggleModal();
          this.showBook(book.id);
          this.chosenShelf = this.shelfs
            .filter(shelf => shelf.id === this.shelf)[0] || this.chosenShelf;
        },
        handleBookSave(event) {
          const book = { ...this.bookDetail,
              isRead  : this.bookIsRead,
              shelf_id: this.chosenShelf.id || this.chosenShelf,
              user_id : this.user
          };
          this.addBook(book);
          this.toggleModal();
          this.removeFoundBooks();
      },
    }

  }
</script>

<style lang="scss">
.books_component {
  &-book {
    width: 150px;
    max-width: 150px;
    margin: 0 10px 0 0;
    background: #fff;
    display: flex;
    flex-flow: column;
    border: 1px solid rgba(0,0,0,0.1);
    padding: 10px;
    cursor: pointer;
    position: relative;
  }

  &-book-content {
    flex: 1;
  }

  &-book-image {
    max-height: 200px;
  }

  &-book-detail {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    white-space: pre-wrap;
  }

  &-book-modal-footer {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

  &-book-modal-button-save {
    margin-top: 15px;
  }

  &-book-modal-button-close {
    align-self: flex-end;
  }

  &-book-rating {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 0 !important;
    font-size: 12px;
    color: rgba(0,0,0,0.8);
    padding: 2px;
  }

  .v-slide-group__next, .v-slide-group__prev {
    min-width: 40px !important;
    box-shadow: 0px 1px 2px 2px rgba(0,0,0,0.1);
    z-index: 1;
  }
}
</style>
