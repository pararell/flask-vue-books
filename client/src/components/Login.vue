<template>
    <div>
      <v-container>
        <h2>Login</h2>
          <form>
            <div class="form-group">
                <v-text-field type="text"
                  label="Username"
                  v-model="username"
                  name="username"
                  :class="{ 'is-invalid': submitted && !username }">
                </v-text-field>
                <div v-show="submitted && !username" class="invalid-feedback">Username is required</div>
            </div>
            <div class="form-group">
                <v-text-field type="password"
                  label="Password"
                  v-model="password"
                  name="password"
                  class="form-control">
                </v-text-field>
                <div v-show="submitted && !password" class="invalid-feedback">Password is required</div>
            </div>
              <v-btn class="mr-4 login-button" :disabled="status.loggingIn" @click="handleSubmit">Login</v-btn>
              <v-btn class="mr-4" to="/register">Register</v-btn>
          </form>

      </v-container>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    data () {
        return {
            username: '',
            password: '',
            submitted: false
        }
    },
    computed: {
        ...mapState('account', ['status'])
    },
    created () {
        // reset login status
        this.logout();
    },
    methods: {
        ...mapActions('account', ['login', 'logout']),
        handleSubmit (e) {
            this.submitted = true;
            const { username, password } = this;
            if (username && password) {
                this.login({ username, password })
            }
        }
    }
};
</script>

<style lang="scss" scoped>

.login-button {
  margin-right: 20px;
}

</style>
