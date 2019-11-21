<template>
    <div class="sort_component">
        <v-container class="sort_component-container">
          <div class="sort_component-sorts" v-if="type === 'shelfs' && shelfsSort">
              <v-chip class="sort_component-sort"
                v-for="(sort, index) in shelfsSort"
                  :key="sort.name"
                  :class="{ 'sort_component-sort-active': activeSort ? activeSort == sort.name : index === 0 }"
                  @click="choseSort(sort)">
                  {{ sort.label }}
              </v-chip>
          </div>
          <div class="sort_component-sorts" v-if="type === 'categories' && categoriesSort">
              <v-chip class="sort_component-sort"
                v-for="(sort, index) in categoriesSort"
                  :key="sort.name"
                  :class="{ 'sort_component-sort-active':activeSort ? activeSort == sort.name : index === 0 }"
                  @click="choseSort(sort)">
                  {{ sort.label }}
              </v-chip>
          </div>
          <v-chip v-if="count">
            <v-icon left>mdi-book</v-icon>
            {{ count }}
          </v-chip>
      </v-container>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
      data() {
        return {
            activeSort: null
        };
    },
    created() {
      if (this.$route.query.sort) {
        const sortName = this.$route.query.sort.split('-')[0];
        this.activeSort = sortName;
        const sortToSend = {name: sortName, active: this.$route.query.sort.split('-')[1] }
        if (this.type === 'categories') {
            this.categoriesSetSort(sortToSend);
        }
        if (this.type === 'shelfs') {
          this.shelfsSetSort(sortToSend);
        }
      }
    },
    props: ['type', 'count'],
    computed: {
        ...mapState('shelfs', { shelfsSort: 'sorts' }),
        ...mapState('categories', { categoriesSort: 'sorts' } )
    },
    methods: {
        ...mapActions('shelfs', { shelfsSetSort: 'setSort' } ),
        ...mapActions('categories', { categoriesSetSort: 'setSort' } ),

        choseSort(sort) {
          const sortToSend = {...sort, active: sort.active === 'asc' ? 'desc' : 'asc'};
          this.activeSort = sortToSend.name;
          this.$router.push({query: {sort: sortToSend.name + '-' + sortToSend.active}})
          if (this.type === 'categories') {
             this.categoriesSetSort(sortToSend);
          }
          if (this.type === 'shelfs') {
            this.shelfsSetSort(sortToSend);
          }
        }
    }
}
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
}
</style>
