<template>
    <!-- Main content -->
    <section class="content">
        <!-- Info boxes -->

        <!-- /.row -->

        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title"></h3>
                    <div class="box-body">
                        <div class="col-sm-6 col-xs-12">
                            <p class="text-center">
                                <strong>Tasks Overview</strong>
                            </p>
                            <canvas id="trafficBar"></canvas>
                        </div>
                        <hr class="visible-xs-block">
                        <div class="col-sm-6 col-xs-12">
                            <p class="text-center">
                                <strong>Activity Overview</strong>
                            </p>
                            <canvas id="languagePie"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- /.row -->

    </section>
    <!-- /.content -->
</template>

<script>
	import api from '../../api'
	import Chart from 'chart.js'

	export default {
		data() {
			return {}
		},
		methods: {

			generateStatistics() {

				var  obj = {}
				var dataArray = Array.apply(null, Array(12)).map(Number.prototype.valueOf, 0);
				var token = this.$store.state.token

				var uid = this.$store.state.userId
				api
					.request('post', '/record/getStatistics', {uid, token})
					.then(response => {

					var data = response.data[0]
					for (var i = 0; i < data.length; i++) {

					// Axis
					var taskDate = parseInt(data[i].date.substring(5, 7))
					dataArray[taskDate - 1] = dataArray[taskDate - 1] + data[i].hours

					// Pie
					if(!obj.hasOwnProperty(data[i].activity)){
						obj[data[i].activity] = +1
					}else {
						var count = obj[data[i].activity]
						obj[data[i].activity] = count + 1
					}
				}

				this.createChart(dataArray)
				this.createPie(obj)

			})
			.catch(error => {
					this.$store.commit('TOGGLE_LOADING')
				console.log(error)

			})
			},
			createChart(dataArray) {

				var ctx = document.getElementById('trafficBar').getContext('2d')
				var config = {
					type: 'line',
					data: {
						labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
						datasets: [{
							label: 'Hours',
							fill: false,
							borderColor: '#284184',
							pointBackgroundColor: '#284184',
							backgroundColor: 'rgba(0, 0, 0, 0)',
							data: dataArray
						}]
					},
					options: {
						responsive: true,
						maintainAspectRatio: !this.isMobile,
						legend: {
							position: 'bottom',
							display: true
						},
						tooltips: {
							mode: 'label',
							xPadding: 10,
							yPadding: 10,
							bodySpacing: 10
						}
					}
				}

				new Chart(ctx, config) // eslint-disable-line no-new

			},
			createPie(obj) {
				var labelsArr = []
				var dataArr = []
				var count = 0

				for(var k in obj) count = count + obj[k]

				for(var e in obj){
					labelsArr.push(e)
					dataArr.push(obj[e]/count*100)
				}

				var pieChartCanvas = document.getElementById('languagePie').getContext('2d')
				var pieConfig = {
					type: 'pie',
					data: {
						labels: labelsArr,
						datasets: [{
							data: dataArr,
							backgroundColor: ['#00a65a', '#f39c12', '#00c0ef'],
							hoverBackgroundColor: ['#00a65a', '#f39c12', '#00c0ef']
						}]
					},
					options: {
						responsive: true,
						maintainAspectRatio: !this.isMobile,
						legend: {
							position: 'bottom',
							display: true
						}
					}
				}

				new Chart(pieChartCanvas, pieConfig) // eslint-disable-line no-new
			}
		},
		computed: {

			isMobile() {
				return (window.innerWidth <= 800 && window.innerHeight <= 600)
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.generateStatistics()

		})
		}
	}
</script>
<style>
    .info-box {
        cursor: pointer;
    }

    .info-box-content {
        text-align: center;
        vertical-align: middle;
        display: inherit;
    }

    .fullCanvas {
        width: 100%;
    }
</style>
