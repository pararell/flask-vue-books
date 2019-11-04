<template>
    <div class="sort_component">
        <v-container v-if="type === 'shelfs'">
            <div class="sort_component-sorts" v-if="shelfsSort">
                <v-chip class="sort_component-sort"
                  v-for="sort in shelfsSort"
                    :key="sort.name"
                    @click="choseSort(sort)">
                    {{ sort.label }}
                </v-chip>
            </div>
        </v-container>
        <v-container v-if="type === 'categories'">
            <div class="sort_component-sorts" v-if="categoriesSort">
                <v-chip class="sort_component-sort"
                  v-for="sort in categoriesSort"
                    :key="sort.name"
                    @click="choseSort(sort)">
                    {{ sort.label }}
                </v-chip>
            </div>
        </v-container>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    props: ['type'],
    computed: {
        ...mapState('shelfs', { shelfsSort: 'sorts' }),
        ...mapState('categories', { categoriesSort: 'sorts' } )
    },
    methods: {
        ...mapActions('shelfs', { shelfsSetSort: 'setSort' } ),
        ...mapActions('categories', { categoriesSetSort: 'setSort' } ),

        choseSort(sort) {
          const sortToSend = {...sort, active: sort.active === 'asc' ? 'desc' : 'asc'};
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
    &-sort {
        margin-right: 10px;
    }
}
</style>
