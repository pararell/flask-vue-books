<template>
  <div>
    <v-container>
      <h2>Login</h2>
      <form>
        <div class="form-group">
          <v-text-field
            type="text"
            label="Email"
            v-model="email"
            name="email"
            :class="{ 'is-invalid': submitted && !email }"
          ></v-text-field>
          <div v-show="submitted && !email" class="invalid-feedback">Email is required</div>
        </div>
        <div class="form-group">
          <v-text-field
            type="password"
            label="Password"
            v-model="password"
            name="password"
            class="form-control"
          ></v-text-field>
          <div v-show="submitted && !password" class="invalid-feedback">Password is required</div>
        </div>
        <v-btn class="mr-4 login-button" :disabled="status.loggingIn" @click="handleSubmit">Login</v-btn>
        <v-btn class="mr-4" to="/register">Register</v-btn>
      </form>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      email: "",
      password: "",
      submitted: false
    };
  },
  computed: {
    ...mapState("account", ["status"])
  },
  created() {
    // reset login status
    this.logout();
  },
  methods: {
    ...mapActions("account", ["login", "logout", "goodreadsLogin"]),
    handleSubmit(e) {
      this.submitted = true;
      const { email, password } = this;
      if (email && password) {
        this.login({ email, password });
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
