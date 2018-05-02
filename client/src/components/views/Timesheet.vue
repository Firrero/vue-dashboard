<template>
    <div>
        <code>query: {{ query }}</code>
        <div class="box">
            <div class="box-header">
                This is a datatable
            </div>
            <div class="box-body">
                <datatable v-bind="$data">
                    <button class="btn btn-default" @click="alertSelectedUids">
                        <i class="fa fa-edit"></i>
                        Edit
                    </button>
                    <button class="btn btn-default" @click="">
                        <i class="fa fa-remove"></i>
                        Remove
                    </button>
                    <button class="btn btn-default" @click="">
                        <i class="fa fa-reply"></i>
                        Restore
                    </button>
                </datatable>
            </div>
        </div>

        <div class="box">
            <div class="box-header">
                This is a modal box ;)
            </div>
            <div class="box-body">
                <modal name="hello-world">
                    <div class="box box-primary">
                        <div class="box-header with-border">
                            <h3 class="box-title">Quick Example</h3>
                        </div>
                        <!-- /.box-header -->
                        <!-- form start -->
                        <!-- REPLACE FUNCTION ORDER -->
                        <form v-on:submit.prevent="hide();createRecord()" role="form" class="timesheet-modal-form">
                            <div class="box-body">
                                <div class="input-group">
                                    <span class="input-group-addon">
                                        <i class="fa fa-fw fa-calendar"></i>
                                    </span>
                                    <datepicker :readonly="true" format="MMM/D/YYYY" id="dateInput" height="44px" width="100%"></datepicker>
                                </div>
                                <div class="form-group has-success">
                                    <label for="select-project">Project</label>
                                    <select v-model="selectProject" id="select-project" class="form-control">
                                        <option>option 1</option>
                                        <option>option 2</option>
                                        <option>option 3</option>
                                        <option>option 4</option>
                                        <option>option 5</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="select-activity">Activity</label>
                                    <select v-model="selectActivity" id="select-activity" class="form-control">
                                        <option>option 1</option>
                                        <option>option 2</option>
                                        <option>option 3</option>
                                        <option>option 4</option>
                                        <option>option 5</option>
                                    </select>
                                </div>
                                <div class="form-group has-success">
                                    <label class="control-label" for="project-hours">
                                        <i class="fa fa-fw fa-check"></i>
                                        Input with success
                                    </label>
                                    <input v-model="projectHours" class="form-control" id="project-hours" placeholder="Enter hours ..." type="text">
                                    <span class="help-block">Write project hours</span>
                                </div>
                                <div class="form-group">
                                    <label for="select-feature">Feature</label>
                                    <select v-model="selectFeature" id="select-feature" class="form-control">
                                        <option>option 1</option>
                                        <option>option 2</option>
                                        <option>option 3</option>
                                        <option>option 4</option>
                                        <option>option 5</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="control-label" for="project-id">Project ID</label>
                                    <input v-model="projectId" class="form-control" id="project-id" placeholder="ID ..." type="text">
                                </div>
                                <div class="form-group">
                                    <label class="control-label" for="project-info">Extra information</label>
                                    <textarea v-model="projectInfo" id="project-info" class="form-control" rows="3" placeholder="Enter ..."></textarea>
                                </div>

                            </div>
                            <!-- /.box-body -->
                            <div class="box-footer">
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                </modal>
                <button class="btn btn-default" v-on:click="show()">
                    <i class="fa fa-pencil"></i>
                    Add task</button>
                <button class="btn btn-default" v-on:click="getUsers()">
                    <i class="fa fa-refresh"></i>
                    Update</button>
            </div>
        </div>




    </div>
</template>


<script>
	//import mockData from '../_mockData'
	import api from '../../api'
    // Change it to vuejs-datepicker
	import datepicker from 'vue-date-picker'


	export default {
		name:'timesheet',
		components: { datepicker },
		data:  () => ({

			columns: [
				{ title: 'Date', field: 'date', sortable: true },
				{ title: 'Project', field: 'project' },
				{ title: 'Activity', field: 'activity', sortable: true },
				{ title: 'Hours', field: 'hours' },
				{ title: 'Feature', field: 'feature' },
				{ title: 'ID', field: 'id' },
				{ title: 'Extra info', field: 'extra' }
			],
			data: [],
			total: 0,
			query: {},
			selection: [],
			supportNested: 'accordion',

			selectProject:'',
            selectActivity:'',
			projectHours:'',
            selectFeature:'',
            projectId:'',
            projectInfo:''

		}),
		watch: {
			query: {
				handler (query) {
					console.log("HERE IT IS_--------->"+this.getUsers())
					this.getUsers()
					this.total = 2
				},
				deep: true
			}
		},
		methods: {
					alertSelectedUids () {
						alert(this.selection.map(({ hours }) => hours))
                      console.log(this.selection)
					},
			getUsers() {
				api
					.request('get', '/user/getUser')
					.then(response => {

						var data = response.data
						this.data = data

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
            createRecord() {

	            var project = this.selectProject
		        var activity = this.selectActivity
                var hours = this.projectHours
                var feature = this.selectFeature
                var id = this.projectId
                var extra = this.projectInfo

	            api
		            .request('post', '/user/create', { project, activity, hours, feature, id, extra })
		            .then(response => {
					    var data = response.data.success
                      /* if success exists */
                        if(data){
	                        this.getUsers()
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
			show () {
				this.$modal.show('hello-world');
			},
			hide () {
				this.$modal.hide('hello-world');
			}
		}
	}
</script>

<style>
    .btn-default {
        margin-right:5px;
    }
    .v--modal-box.v--modal {
        height:710px !important;
        top:60px !important;
    }
    .timesheet-modal-form {
        padding:0px !important;
    }
</style>