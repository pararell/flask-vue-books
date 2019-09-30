<template>
  <v-container>
    <div class="shelfs_component">
        <h1>Shelfs</h1>
        <template v-if="status.loading">
          <loader></loader>
        </template>
        <template v-if="!status.loading && allShelfs">
          <div class="shelfs_component-shelfs-list">
            <div v-for="shelf in allShelfs" :key="shelf.id" @click="saveShelf(shelf)">
              <v-card class="shelfs_component-shelf" max-width="400"
                :to="{ name: 'shelf', params: { shelfName: shelf.name }}">
                  <v-img v-if="!shelf.image" height="400"
                    class="white--text" src="https://cdn5.teebooks.com/256-large_default/bookshelf-u-60-cm.jpg">
                  </v-img>
                  <v-img v-if="shelf.image" height="400"
                    class="white--text" v-bind:src="shelf.image">
                  </v-img>
                  <h2 class="shelfs_component-shelf-text" headline>
                       {{ shelf.name }} <br/>
                      ({{ shelf.category }})
                  </h2>
                  <div class="shelfs_component-shelf-remove" @click.prevent="remove(shelf)">×</div>
              </v-card>
            </div>
          </div>


        <h2>Add Shelf</h2>
        <form>
            <div class="form-group">
                <v-text-field type="text" label="Name" v-model="name" name="name" :class="{ 'is-invalid': submitted && !name }">
                </v-text-field>
                <div v-show="submitted && !name" class="invalid-feedback">Name is required</div>
            </div>
            <div class="form-group">
                <v-text-field type="text" label="Category" v-model="category" name="category" class="form-control">
                </v-text-field>
            </div>
              <div class="form-group">
                <v-text-field type="text" label="Image Url" v-model="image" name="image" class="form-control">
                </v-text-field>
            </div>
            <v-btn class="mr-4" @click="handleSubmit">Add Shelf</v-btn>
        </form>
      </template>
   </div>
  </v-container>
</template>



<script>
import { mapState, mapActions } from 'vuex';
import Loader from './Loader.vue';

export default {
    data() {
        return {
            name: '',
            category: '',
            image: '',
            isShow: true,
            submitted: false,
            showMessage: false,
        };
    },
    components: {
      loader: Loader
    },
    computed: {
        ...mapState('shelfs', ['status', 'allShelfs']),
        ...mapState('account', ['user'])
    },
    mounted() {
        this.tokenRefresh();

        this.unsub = this.$store.subscribe((mutation, state) => {
          if (mutation.payload && mutation.type === 'account/userSave' && !this.allShelfs) {
                this.getAllShelfs(this.user);
          }
          if (mutation.payload && mutation.type === 'shelfs/addShelfsuccess' ) {
                this.getAllShelfs(this.user);
            }

            if (mutation.type === 'shelfs/removeShelfsuccess') {
                this.getAllShelfs(this.user);
            }

        });
    },
    beforeDestroy() {
        this.unsub();
    },
    methods: {
        ...mapActions('shelfs', ['getAllShelfs', 'addShelf', 'removeShelf', 'saveShelfToStore']),
        ...mapActions('account', ['tokenRefresh']),

        initForm() {
            this.name = '';
            this.category = '';
            this.isShow = true;
        },

        handleSubmit(evt) {
            this.submitted = true;
            const payload = {
                name      : this.name,
                category  : this.category,
                image     : this.image,
                isShow    : this.isShow,
                user_id   : this.user
            };
            this.addShelf(payload);
            this.message = 'Shelf added!';
            this.showMessage = true;
            this.initForm();
        },

        saveShelf(shelf) {
            this.saveShelfToStore(shelf);
        },

        remove(shelf) {
          this.removeShelf(shelf);
        }

    }

};
</script>

<style lang="scss" scoped>
.shelfs_component {
  &-shelfs-list {
    display: flex;
    flex-flow: wrap;
    margin-bottom: 50px;
 }

  &-shelf {
    margin: 10px;
    display: flex;
    flex-flow: column;
  }

  &-shelf-remove {
    display: flex;
    justify-content: flex-end;
    padding: 0 10px;
    color: rgba(217, 30, 24, 1);
    font-size: 12px;
    box-shadow: 0px 0px 2px rgba(217, 30, 24, 0.5);
    cursor: pointer;
    align-self: flex-end;
  }

  &-shelf-text {
    text-align: center;
    font-size: 20px;
    margin: 10px;
    font-weight: 600;
    font-family: 'Gentium Book Basic', serif;
    text-transform: uppercase;
  }
}

</style>
