<template>
    <div>
       <v-container>
        <h2>Register</h2>
          <form>
            <div class="form-group">
                <v-text-field type="text"
                  label="Username"
                  v-model="user.username"
                  name="lastName"
                  :class="{ 'is-invalid': submitted && errors.has('username') }">
                </v-text-field>
                <div v-if="submitted && errors.has('username')" class="invalid-feedback">{{ errors.first('username') }}</div>
            </div>
            <div class="form-group">
                <v-text-field type="password"
                  label="Password"
                  v-model="user.password"
                  v-validate="{ required: true, min: 6 }"
                  name="password"
                  class="form-control">
                </v-text-field>
                <div v-if="submitted && errors.has('password')" class="invalid-feedback">{{ errors.first('password') }}</div>
            </div>
              <v-btn class="mr-4" :disabled="status.registering" @click="handleSubmit">Register</v-btn>
          </form>
        </v-container>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    data () {
        return {
            user: {
                username: '',
                password: ''
            },
            submitted: false
        }
    },
    computed: {
        ...mapState('account', ['status'])
    },
    methods: {
        ...mapActions('account', ['register']),
        handleSubmit(e) {
            this.submitted = true;
            this.$validator.validate().then(valid => {
                if (valid) {
                    this.register(this.user);
                }
            });
        }
    }
};
</script>
