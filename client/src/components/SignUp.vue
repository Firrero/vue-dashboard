<template>
    <div id="login">
        <img src="/static/img/unit4-logout.png" class="center-block logo">

        <div class="text-center col-sm-12">
            <!-- login form -->
            <form @submit.prevent="signUp">
                <div class="input-group">
                    <span class="input-group-addon"><i class="fa fa-envelope"></i></span>
                    <input class="form-control" name="email" placeholder="Email" type="email" v-model="email" required>
                </div>

                <div class="input-group">
                    <span class="input-group-addon"><i class="fa fa-lock"></i></span>
                    <input class="form-control" name="password" placeholder="Password" type="password" v-model="password" required>
                </div>

                <div class="input-group">
                    <span class="input-group-addon"><i class="fa fa-lock"></i></span>
                    <input class="form-control" name="passwordConfirm" placeholder="Confirm password" type="password" v-model="passwordConfirm" required>
                </div>
                <button type="submit" v-bind:class="'btn btn-primary btn-lg ' + loading">Sign Up</button>
                <router-link tag="a" class="pageLink" to="/login">

                    <span class="page">&nbsp; or Login</span>
                </router-link>
            </form>

            <!-- errors -->
            <div v-if=response class="text-red"  v-bind:class="{ 'text-green': noError }">
                <p class="vertical-5p lead">{{response}}</p>
            </div>
        </div>
    </div>
</template>

<script>
  import api from '../api'

  export default {
    name: 'sign-up',
    data(router) {
      return {
        noError: false,
        section: 'SignUp',
        loading: '',
        email: '',
        password: '',
        passwordConfirm: '',
        response: ''
      }
    },
    methods: {
      toLogin() {
        this.$router.push('/login')
      },

      signUp() {
        const { email, password } = this

        this.toggleLoading()
        this.resetResponse()
        this.$store.commit('TOGGLE_LOADING')

        /* Making API call to authenticate a user */
        if (this.password === this.passwordConfirm) {
          api
            .request('post', '/user/signup', {email, password})
            .then(response => {
              this.toggleLoading()
              var data = response.data
              /* Checking if error object was returned from the server */
              if (data.error) {
                this.response = data.error
              }

              if (data.success) {
                this.noError = true
                this.response = data.success
                setTimeout(this.toLogin, 2000)
              }

              // this.$router.push(data.redirect ? data.redirect : '/')
            })
            .catch(error => {
              this.$store.commit('TOGGLE_LOADING')
              console.log(error)

              if (error) {
                this.response = error.response.data.error
              } else {
                this.response = 'default response'
              }

              this.toggleLoading()
            })
        } else {
          this.response = 'Passwords does not match'
        }
      },
      toggleLoading() {
        this.loading = this.loading === '' ? 'loading' : ''
      },
      resetResponse() {
        this.response = ''
        this.noError = false
      }
    }
  }
</script>

<style>
    #login {
        padding: 10em;
    }

    html,
    body,
    .container-table {
        height: 100%;
        background-color: #282b30 !important;
    }
    .container-table {
        display: table;
        color: white;
    }
    .vertical-center-row {
        display: table-cell;
        vertical-align: middle;
    }
    .vertical-20p {
        padding-top: 20%;
    }
    .vertical-10p {
        padding-top: 10%;
    }
    .vertical-5p {
        padding-top: 5%;
    }
    .logo {
        width: 15em;
        padding: 3em;
    }

    .input-group {
        padding-bottom: 2em;
        height: 4em;
        width: 100%;
    }

    .input-group span.input-group-addon {
        width: 2em;
        height: 4em;
    }

    @media (max-width: 1241px) {
        .input-group input {
            height: 4em;
        }
    }
    @media (min-width: 1242px) {
        form {
            padding-left: 20em;
            padding-right: 20em;
        }

        .input-group input {
            height: 6em;
        }
    }

    .input-group-addon i {
        height: 15px;
        width: 15px;
    }
</style>
