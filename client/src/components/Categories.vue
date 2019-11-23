<template>
  <v-container>
    <div class="categories_component">
      <h1>Categories</h1>
      <template v-if="status.loading">
        <loader></loader>
      </template>
      <template v-if="!status.loading && allCategories">
        <div class="categories_component-categories-list">
          <div v-for="category in allCategories" :key="category.id">
            <v-card
              class="categories_component-category"
              max-width="150"
              :to="{ name: 'category', params: { categoryId: category.id }}"
            >
              <v-img
                v-if="!category.image"
                height="150"
                class="white--text"
                src="https://cdn5.teebooks.com/256-large_default/bookshelf-u-60-cm.jpg"
              ></v-img>
              <v-img
                v-if="category.image"
                height="150"
                class="white--text"
                v-bind:src="category.image"
              ></v-img>
              <h2 class="categories_component-category-text" headline>
                {{ category.name }}
                <br />
              </h2>
              <div class="categories_component-category-remove" @click.prevent="remove(category)">×</div>
            </v-card>
          </div>
        </div>

        <h2>Add Category</h2>
        <form>
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
          <div class="form-group">
            <v-text-field
              type="text"
              label="Image Url"
              v-model="image"
              name="image"
              class="form-control"
            ></v-text-field>
          </div>
          <v-btn class="mr-4" @click="handleSubmit">Add Category</v-btn>
        </form>
      </template>
    </div>
  </v-container>
</template>



<script>
import { mapState, mapActions } from "vuex";
import Loader from "./Loader.vue";

export default {
  data() {
    return {
      name: "",
      image: "",
      isShow: true,
      submitted: false,
      showMessage: false
    };
  },
  components: {
    loader: Loader
  },
  computed: {
    ...mapState("categories", ["status", "allCategories"]),
    ...mapState("account", ["user"])
  },
  mounted() {
    this.tokenRefresh();

    this.unsub = this.$store.subscribe((mutation, state) => {
      if (
        mutation.payload &&
        mutation.type === "account/userSave" &&
        !this.allCategories
      ) {
        this.getAllCategories(this.user);
      }
      if (
        mutation.payload &&
        mutation.type === "categories/addCategorysuccess"
      ) {
        this.getAllCategories(this.user);
      }

      if (mutation.type === "categories/removeCategorysuccess") {
        this.getAllCategories(this.user);
      }
    });
  },
  beforeDestroy() {
    this.unsub();
  },
  methods: {
    ...mapActions("categories", [
      "getAllCategories",
      "addCategory",
      "removeCategory"
    ]),
    ...mapActions("account", ["tokenRefresh"]),

    initForm() {
      this.name = "";
      this.isShow = true;
    },

    handleSubmit(evt) {
      this.submitted = true;
      const payload = {
        name: this.name,
        image: this.image,
        isShow: this.isShow,
        user_id: this.user
      };
      this.addCategory(payload);
      this.message = "Category added!";
      this.showMessage = true;
      this.initForm();
    },

    remove(category) {
      this.removeCategory(category);
    }
  }
};
</script>

<style lang="scss" scoped>
.categories_component {
  &-categories-list {
    display: flex;
    flex-flow: wrap;
    margin-bottom: 50px;
  }

  &-category {
    margin: 10px;
    display: flex;
    flex-flow: column;
  }

  &-category-remove {
    display: flex;
    justify-content: flex-end;
    padding: 0 10px;
    color: rgba(217, 30, 24, 1);
    font-size: 12px;
    box-shadow: 0px 0px 2px rgba(217, 30, 24, 0.5);
    cursor: pointer;
    align-self: flex-end;
  }

  &-category-text {
    text-align: center;
    font-size: 20px;
    margin: 10px;
    font-weight: 600;
    font-family: "Gentium Book Basic", serif;
    text-transform: uppercase;
  }
}
</style>
