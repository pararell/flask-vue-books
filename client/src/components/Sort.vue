<template>
  <div class="sort_component">
    <v-container class="sort_component-container">
      <div class="sort_component-sorts" v-if="type === 'shelfs' && shelfsSort">
        <v-chip
          class="sort_component-sort"
          v-for="(sort, index) in shelfsSort"
          :key="sort.name"
          :class="{ 'sort_component-sort-active': activeSort ? activeSort == sort.name : index === 0 }"
          @click="choseSort(sort)"
        >{{ sort.label }}</v-chip>
      </div>
      <div class="sort_component-sorts" v-if="type === 'categories' && categoriesSort">
        <v-chip
          class="sort_component-sort"
          v-for="(sort, index) in categoriesSort"
          :key="sort.name"
          :class="{ 'sort_component-sort-active':activeSort ? activeSort == sort.name : index === 0 }"
          @click="choseSort(sort)"
        >{{ sort.label }}</v-chip>
      </div>
      <div class="sort_component-search">
        <div class="sort_component-search">
          <i class="v-icon notranslate mdi mdi-magnify"></i>
          <v-text-field label="Search book" v-model="query" v-on:input="searchBook(query)"></v-text-field>
        </div>
        <v-chip v-if="count">
          <v-icon left>mdi-book</v-icon>
          {{ count }}
        </v-chip>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      firstSort: true,
      activeSort: null,
      query: ""
    };
  },
  mounted() {
      if (this.$route.query.sort && this.count) {
        const sortName = this.$route.query.sort.split("-")[0];
        this.activeSort = sortName;
            const sortToSend = {
                name: sortName,
                active: this.$route.query.sort.split("-")[1]
            };
            if (this.type === "categories") {
                this.categoriesSetSort(sortToSend);
            }
            if (this.type === "shelfs") {
                this.shelfsSetSort(sortToSend);
            }
      }
  },
  beforeDestroy() {
    this.categoriesSetQuery("");
    this.shelfsSetQuery("");
  },
  props: ["type", "count"],
  watch: {
      count(newVal, oldVal) {
        if (this.firstSort && newVal != 0) {
           if (this.$route.query.sort) {
              const sortName = this.$route.query.sort.split("-")[0];
              const sortToSend = {
                name: sortName,
                active: this.$route.query.sort.split("-")[1]
              };
              if (this.type === "categories") {
                this.categoriesSetSort(sortToSend);
              }
              if (this.type === "shelfs") {
                this.shelfsSetSort(sortToSend);
             }
          }
          this.firstSort = false;
        }
      }
  },
  computed: {
    ...mapState("shelfs", { shelfsSort: "sorts", shelfsQuery: "query" }),
    ...mapState("categories", {
      categoriesSort: "sorts",
      categoriesQuery: "query"
    })
  },
  methods: {
    ...mapActions("shelfs", {
      shelfsSetSort: "setSort",
      shelfsSetQuery: "setQuery"
    }),
    ...mapActions("categories", {
      categoriesSetSort: "setSort",
      categoriesSetQuery: "setQuery"
    }),

    choseSort(sort) {
      const sortToSend = {
        ...sort,
        active: sort.active === "asc" ? "desc" : "asc"
      };
      this.activeSort = sortToSend.name;
      this.$router.push({
        query: { sort: sortToSend.name + "-" + sortToSend.active }
      });
      if (this.type === "categories") {
        this.categoriesSetSort(sortToSend);
      }
      if (this.type === "shelfs") {
        this.shelfsSetSort(sortToSend);
      }
    },
    searchBook(query) {
      if (this.type === "categories") {
        this.categoriesSetQuery(query);
      }
      if (this.type === "shelfs") {
        this.shelfsSetQuery(query);
      }
    }
  }
};
</script>

<style lang="scss">
.sort_component {
  &-sorts {
    display: flex;
    flex-wrap: wrap;
  }
  &-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  &-sort {
    margin-right: 10px;

    &-active {
      color: #fff;
      font-weight: bold;
    }
  }
  &-search {
    display: flex;
    align-items: center;
  }
}
</style>
