<template>
    <section class="content">
        <div class="row center-block">
            <h2>Activity</h2>
            <div class="col-md-12">
       <!-- <code>query: {{ query }}</code> -->
                <div class="box">
                    <div class="box-header">
                        Data table for task
                    </div>
                    <div class="box-body">
                        <datatable v-bind="$data">
                            <button class="btn btn-default" v-on:click="show()">
                                <i class="fa fa-pencil"></i>
                                Add task
                            </button>

                            <button class="btn btn-default" @click="showEdit()">
                                <i class="fa fa-edit"></i>
                                Edit
                            </button>

                            <button class="btn btn-default" @click="removeRecord()">
                                <i class="fa fa-remove"></i>
                                Remove
                            </button>

                            <!-- Future update -->
                            <!-- <button class="btn btn-default" @click="">
                                <i class="fa fa-reply"></i>
                                Restore
                            </button> -->

                            <button class="btn btn-default" v-on:click="getRecords()">
                                <i class="fa fa-refresh"></i>
                                Update
                            </button>

                            <modal name="create-task-modal">
                                <div class="box box-primary">
                                    <div class="box-header with-border">
                                        <h3 class="box-title">{{ modalTitle }}</h3>
                                    </div>
                                    <!-- /.box-header -->
                                    <!-- form start -->
                                    <form v-on:submit.prevent="hide();createRecord()" role="form" class="timesheet-modal-form">
                                        <div class="box-body">
                                            <div class="input-group">
                                            <span class="input-group-addon" style="height:2em !important;">
                                                <i class="fa fa-fw fa-calendar"></i>
                                            </span>
                                                <datepicker placeholder=" Pick a date" v-model="datePick" required ></datepicker>
                                            </div>
                                            <div class="form-group">
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
                                                    <option>Architecture</option>
                                                    <option>Design</option>
                                                    <option>Development</option>
                                                    <option>Holiday</option>
                                                    <option>Managmenet</option>
                                                    <option>Product Owner</option>
                                                    <option>Sickness</option>
                                                    <option>Overtime</option>
                                                    <option>Support</option>
                                                    <option>Testing</option>
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label class="control-label" for="project-hours">
                                                    Hours
                                                </label>
                                                <input v-model="projectHours" class="form-control" id="project-hours" placeholder="Enter hours ..." type="number" step="0.1">
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
                                        <!-- v-on:submit.prevent="hide();createRecord()" -->
                                        <div class="box-footer">
                                            <button type="submit" class="btn btn-primary">{{ modalButton }}</button>
                                            <button class="btn btn-danger right" v-on:click="hide()">Close</button>
                                        </div>

                                    </form>
                                </div>
                            </modal>
                        </datatable>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
	import api from '../../api'
    import Datepicker from 'vuejs-datepicker'
    import TableComps from './table-comps/td-Date.vue'

	export default {
		name:'timesheet',

		components: {
			Datepicker,
            TableComps
        },
		data:  () => ({
			columns: [
				{ title: 'UID', field: 'uid', visible:false },
				{ title: 'Date', field: 'date', tdComp: TableComps, sortable: true },
				{ title: 'Project', field: 'project' },
				{ title: 'Activity', field: 'activity', sortable: true },
				{ title: 'Hours', field: 'hours', sortable: true },
				{ title: 'Feature', field: 'feature' },
				{ title: 'ID', field: 'id' },
				{ title: 'Extra info', field: 'extra' }
			],
			data: [],
			total: 0,
			query: {},
			selection: [],

			selectProject:'',
            selectActivity:'',
			projectHours:'',
            selectFeature:'',
            projectId:'',
            projectInfo:'',
            datePick:'',

            modalTitle:'',
            modalButton:'',



		}),
		watch: {
			query: {
				handler (query) {
					this.getRecords()
				},
				deep: true
			}
		},
		methods: {
			removeRecord(){

				if(this.selection[0] && !this.selection[1]){
                    var uid = this.selection[0].uid
                }else{
					alert("Choose only ONE to remove")
                }

                api
                    .request('post', '/record/removeRecord', { uid })
                    .then(response => {
                        this.getRecords()
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
			getRecords() {

                //console.log("user id->"+this.$store.state.userId)

				var query = this.query
                var userId = this.$store.state.userId

				api
					.request('post', '/record/getRecord', { query, userId })
					.then(response => {
                        var data = response.data
						this.data = data[0]
                        this.total = data[1]
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

                var uid = '_' + Math.random().toString(36).substr(2, 14)+this.selectProject

                if(this.selection[0]) {
	                uid = this.selection[0].uid
                }

                var date = this.datePick
	            var project = this.selectProject
		        var activity = this.selectActivity
                var hours = this.projectHours
                var feature = this.selectFeature
                var id = this.projectId
                var extra = this.projectInfo
                var userId = this.$store.state.userId

	            api
		            .request('post', '/record/create', { uid, date, project, activity, hours, feature, id, extra, userId })
		            .then(response => {
                      /* if success exists */
                        if(response.data.success){
	                        this.getRecords()
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
				this.clearForm()
				this.modalTitle = 'Create task'
				this.modalButton = 'Create'
				this.$modal.show('create-task-modal');
			},
			hide () {
				this.$modal.hide('create-task-modal');
			},
			showEdit () {
                if(this.selection[0] && !this.selection[1]) {
                	this.modalTitle = 'Update task'
                    this.modalButton = 'Update'

	                this.selectProject = this.selection[0].project
	                this.selectActivity = this.selection[0].activity
	                this.projectHours = this.selection[0].hours
	                this.selectFeature = this.selection[0].feature
	                this.projectId = this.selection[0].id
	                this.projectInfo = this.selection[0].extra

          		    this.$modal.show('create-task-modal');
                }else {
                	alert("Select only ONE to modify")
                }
			},
            clearForm() {
				this.datePick = ''
	            this.selectProject = ''
	            this.selectActivity = ''
	            this.projectHours = ''
	            this.selectFeature = ''
	            this.projectId = ''
	            this.projectInfo = ''
	            this.selection = []
            }
		}
	}
</script>

<style>
    .btn.right {
        float:right;
    }
    @media (max-width:960px) {
        .form-group {
            margin-bottom: 0px !important;
        }
    }
    .vdp-datepicker input {
        width:100%;
    }
    .vdp-datepicker input {
        height: 2.5em;
    }
    .btn-default {
        margin-right:5px;
    }
    .v--modal-box.v--modal {
        height:670px !important;
        top:60px !important;
        max-width:600px !important;
        width:auto !important;
    }
    .timesheet-modal-form {
        padding:0px !important;
    }
</style>