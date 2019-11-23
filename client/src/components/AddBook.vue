<template>
  <div class="addbook_component">
    <template v-if="status.loading">
      <loader></loader>
    </template>
    <template v-if="allShelfs && allShelfs.length && !status.loading">
      <div
        class="addbook_component-header"
        v-bind:style="{ 'background-image': 'url(' + ('https://cdn5.teebooks.com/256-large_default/bookshelf-u-60-cm.jpg') + ')'}"
      >
        <div class="addbook_component-background">
          <h1 class="addbook_component_component-header-title">Add Book</h1>
        </div>
      </div>

      <v-container class="addbook_component-container">
        <form @submit.prevent="handleSubmit" class="addbook_component-form">
          <div class="form-group">
            <v-text-field
              type="text"
              label="Name"
              v-model="name"
              name="name"
              :class="{ 'is-invalid': submitted && !name }"
            ></v-text-field>
            <div v-show="submitted && !name" class="invalid-feedback">Name is required</div>
          </div>
          <v-btn class="mr-4" @click="handleSubmit">Search books</v-btn>
        </form>

        <books
          v-if="foundBooks"
          v-bind:books="foundBooks"
          v-bind:bookDetail="bookToShow"
          v-bind:user="user"
          v-bind:shelfs="allShelfs"
          v-bind:loading="booksStatus.loadingBookToShow"
        ></books>
      </v-container>
    </template>
    <template
      v-if="(!allShelfs || (allShelfs && !allShelfs.length)) && !status.loading"
    >Please add shelf first!</template>
  </div>
</template>

<script>
import Books from "./Books.vue";
import Loader from "./Loader.vue";
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      name: "",
      submitted: false
    };
  },
  components: {
    books: Books,
    loader: Loader
  },
  computed: {
    ...mapState("shelfs", ["status", "allShelfs"]),
    ...mapState("account", ["user"]),
    ...mapState("books", {
      foundBooks: "foundBooks",
      bookToShow: "bookToShow",
      booksStatus: "status"
    })
  },
  created() {
    this.tokenRefresh();

    if (!this.allShelfs && this.user) {
      this.getAllShelfs(this.user);
    }

    this.unsub = this.$store.subscribe((mutation, state) => {
      if (mutation.type === "books/addBookSuccess") {
        this.getById({ id: mutation.payload.shelf_id, user: this.user });
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
    ...mapActions("shelfs", ["getById", "getAllShelfs"]),
    ...mapActions("account", ["tokenRefresh"]),
    ...mapActions("books", ["searchBooks"]),

    initForm() {
      this.name = "";
    },

    handleSubmit(evt) {
      this.submitted = true;
      this.searchBooks(this.name);
    }
  }
};
</script>

<style lang="scss" scoped>
.addbook_component {
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
    font-family: "Gentium Book Basic", serif;
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

  &-form {
    margin-bottom: 25px;
  }
}
</style>
