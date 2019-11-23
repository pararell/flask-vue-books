<template>
    <div id="app">
      <v-app>
        <nav>
            <!-- Start of app toolbar -->
            <v-app-bar dense>
                <v-toolbar-title class="headline text-uppercase">My Library</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items class="hidden-sm-and-down">
                    <v-btn :to="{ name: 'addBook' }">Add Book</v-btn>
                    <v-btn :to="{ name: 'shelfs' }">Shelfs</v-btn>
                    <v-btn :to="{ name: 'categories' }">Categories</v-btn>
                  </v-toolbar-items>
                  <v-menu left bottom class="hidden-md-and-up">
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item :to="{ name: 'addBook' }">
                        <v-list-item-title>Add Book</v-list-item-title>
                      </v-list-item>
                      <v-list-item :to="{ name: 'shelfs' }">
                        <v-list-item-title>Shelfs</v-list-item-title>
                      </v-list-item>
                      <v-list-item :to="{ name: 'categories' }">
                        <v-list-item-title>Categories</v-list-item-title>
                      </v-list-item>
                      <v-list-item :to="{ name: 'login' }">
                        <v-list-item-title v-if="!user">Login</v-list-item-title>
                        <v-list-item-title v-if="user">Logout</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
            </v-app-bar>
            <!-- End of app toolbar -->

        </nav>
        <!-- End of Navigation -->

        <v-content class="main-content">
             <router-view/>
        </v-content>

        <v-footer>
            <v-row no-gutters class="center-content">
                <v-btn :to="{ name: 'shelfs' }"  text rounded class="my-2">Shelfs</v-btn>
                <v-btn v-if="!user" :to="{ name: 'login' }"  text rounded class="my-2">Login</v-btn>
                <v-btn v-if="user" :to="{ name: 'login' }"  text rounded class="my-2">Logout</v-btn>
                <v-col class="lighten-2 py-4 center-content" cols="12">
                    {{ new Date().getFullYear() }} — <strong>Your Library</strong>
                </v-col>
            </v-row>
        </v-footer>
   </v-app>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: "App",
    data() {
        return {
            drawer: false // Hide mobile side menu by default
        };
    },
    computed: {
        ...mapState('account', ['user'])
    },
};
</script>

<style lang="scss">
html {
    height:100%;
}
body {
    min-height:100%;
}

.main-content {
    min-height: 85vh;
    // margin-top: 48px;
}

.center-content {
    justify-content: center;
    display: flex;
}
</style>
