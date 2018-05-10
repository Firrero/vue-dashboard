<template>
  <div>
    <h1 class="text-center">Settings</h1>
    <section class="content">
      <div class="row">
        <div class="col-md-12">
          <form v-on:submit.prevent="updateUser()" role="form" class="setting-form">
          <div class="box box-info">
            <!-- Input Addons -->
            <div class="box-header with-border">
              <h3 class="box-title">User</h3>
            </div>

            <div class="box-body">

              <br />
              <br />

              <!-- with characthers -->
              <div class="input-group">
                <span class="input-group-addon">
                  <i class="fa fa-fw fa-at" aria-hidden="true"></i>
                </span>
                <input class="form-control" v-model="currentUser" placeholder="Username" type="text">
              </div>
              <br />
              <div class="input-group">
                <span class="input-group-addon">
                  <i class="fa fa-key" aria-hidden="true"></i>
                </span>
                <input class="form-control" placeholder="Password" v-model="newPassword" type="password">
              </div>

            </div>

            <div class="box-footer">
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
            <!-- /.box-body -->
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>
<script>

import api from '../../api'
import datepicker from 'vue-date-picker'

export default {
  name: 'Settings',
  components: { datepicker },
  computed: {

  },
  data: function () {
	  return {
	  	newPassword: '',
        currentUser: this.$store.state.user
	  }
  },
  methods: {
  	updateUser(){
  		// updating user on db
      var uid = this.$store.state.userId
      var email =  this.currentUser
      var password = this.newPassword

		  api
			  .request('post', '/user/editUser', { uid, email, password })
			  .then(response => {
				  console.log("got response from server: "+response.success)

			  })
			  .catch(error => {
				  this.$store.commit('TOGGLE_LOADING')
				  console.log(error)

				  if (error) {
					  //this.response = error.response.data.error
				  } else {
					  //this.response = 'default response'
				  }
				  this.toggleLoading()
			  })

      console.log("updating a user")
      console.log("new name:"+this.currentUser)
      console.log("new pass:"+this.newPassword)

	  }

  }
}
</script>

<style>

</style>
