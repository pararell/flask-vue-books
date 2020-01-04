<template>
  <div>
    <v-container>
      <h2>Register</h2>
      <form>
        <div class="form-group">
          <v-text-field
            type="text"
            label="Email"
            v-model="user.email"
            name="lastName"
            :class="{ 'is-invalid': submitted }"
          ></v-text-field>
        </div>
        <div class="form-group">
          <v-text-field
            type="password"
            label="Password"
            v-model="user.password"
            name="password"
            class="form-control"
          ></v-text-field>
        </div>
        <v-btn class="mr-4" :disabled="status.registering" @click="handleSubmit">Register</v-btn>
      </form>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      user: {
        email: "",
        password: ""
      },
      submitted: false
    };
  },
  computed: {
    ...mapState("account", ["status"])
  },
  methods: {
    ...mapActions("account", ["register"]),
    handleSubmit(e) {
      this.submitted = true;
      this.register(this.user);
    }
  }
};
</script>
