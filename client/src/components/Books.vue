<template>
 <div class="books_component">
    <v-container>
      <div class="books_component-books" v-if="books">
          <div class="books_component-book" v-for="book in books" :key="book.id" @click="choseBook(book)">
              <div class="books_component-book-content">
                  <v-img v-bind:src="book.image"></v-img>
                  <b>{{ book.title }}</b> <br/> <br/>
                  {{book.author}} <br/>
                  {{ book.year }}<br/><br/>
                  Rating : {{ book.rating }}
              </div>
          </div>
      </div>
    </v-container>

    <modal v-if="showModal" @close="toggleModal">
      <template v-if="loading">
        <div slot="body">
          <loader></loader>
        </div>
      </template>
      <template v-if="!loading">
        <h3 slot="header">{{ bookDetail.title }} <span v-if="bookDetail.year">({{bookDetail.year}})</span> </h3>
        <div slot="body">
          <p v-html=" bookDetail.description"> </p>
          <a v-if="bookDetail.link" v-bind:href="bookDetail.link" target="_blank">Goodreads</a>
        </div>
        <div slot="footer" class="books_component-book-modal-footer">
          <form>
            <div class="form-group">
                <input type="checkbox" id="bookIsRead" v-model="bookIsRead">
                <label for="bookIsRead">Book is readed</label>
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
              chosenShelf: this.shelfs ? this.shelfs[0] : {}
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

        choseBook(book) {
          this.toggleModal();
          this.showBook(book.id);
          this.chosenShelf = this.shelfs
            .filter(shelf => shelf.id === this.shelf)[0] || this.chosenShelf;
        },
          handleBookSave(event) {
            const book = { ...this.bookDetail,
                isRead  : this.bookIsRead,
                shelf_id: this.chosenShelf.id,
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
    box-shadow: 1px 1px 3px rgba(0,0,0,0.2);
    padding: 10px;
    cursor: pointer;
  }

  &-book-content {
    flex: 1;
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
}
</style>
