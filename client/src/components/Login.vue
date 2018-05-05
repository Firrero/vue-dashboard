<template>
  <div id="login">
    <img src="/static/img/unit4-logout.png" class="center-block logo">

    <div class="text-center col-sm-12">
      <!-- login form -->
      <form @submit.prevent="checkCreds">
        <div class="input-group">
          <span class="input-group-addon"><i class="fa fa-envelope"></i></span>
          <input class="form-control" name="email" placeholder="Email" type="text" v-model="email">
        </div>

        <div class="input-group">
          <span class="input-group-addon"><i class="fa fa-lock"></i></span>
          <input class="form-control" name="password" placeholder="Password" type="password" v-model="password">
        </div>
        <button type="submit" v-bind:class="'btn btn-primary btn-lg ' + loading">Login</button>
        <router-link tag="a" class="pageLink" to="/sign-up">
            <span class="page">&nbsp; Sign up</span>
        </router-link>
      </form>

      <!-- errors -->
      <div v-if=response class="text-red"><p class="vertical-5p lead">{{response}}</p></div>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  name: 'Login',
  data(router) {
    return {
      section: 'Login',
      loading: '',
      email: '',
      password: '',
      userId:'',
      response: ''
    }
  },
  methods: {
    checkCreds() {
      const { email, password } = this

      this.toggleLoading()
      this.resetResponse()
      this.$store.commit('TOGGLE_LOADING')

      /* Making API call to authenticate a user */
      api
        .request('post', '/user/signin', { email, password })
        .then(response => {
          this.toggleLoading()
          var data = response.data

         /* Checking if error object was returned from the server */
          if (data.error) {
            this.response = data.error
          }

          /* Setting user email in the state and caching record to the localStorage */
          if (data.user) {
            /* var token = 'Bearer ' + data.token */
            var token = data.token

	        this.$store.commit('SET_USERID', data.userId)
            this.$store.commit('SET_USER', data.user)
	        this.$store.commit('SET_TOKEN', token)

            if (window.localStorage) {
              window.localStorage.setItem('user', JSON.stringify(data.user))
              window.localStorage.setItem('token', token)
              window.localStorage.setItem('userId', data.userId)
            }

            this.$router.push(data.redirect ? data.redirect : '/')
            // seems to fix footer bug after login :|
            //location.reload()
          }
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
    },
    toggleLoading() {
      this.loading = this.loading === '' ? 'loading' : ''
    },
    resetResponse() {
      this.response = ''
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
