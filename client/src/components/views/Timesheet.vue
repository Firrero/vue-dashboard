<template>
    <div>
        <code>query: {{ query }}</code>
        <div class="box">
            <div class="box-header">
                This is a datatable
            </div>
            <div class="box-body">
                <datatable v-bind="$data" />
            </div>
        </div>

    </div>
</template>
<script>
	import mockData from '../_mockData'

	export default {
		name:'timesheet',
		data: () => ({
		columns: [
			{ title: 'User ID', field: 'uid', sortable: true },
			{ title: 'Username', field: 'name' },
			{ title: 'Age', field: 'age', sortable: true },
			{ title: 'Email', field: 'email' },
			{ title: 'Country', field: 'country' }
		],
		data: [],
		total: 0,
		query: {}
	}),
	watch: {
		query: {
			handler (query) {
				mockData(query).then(({ rows, total }) => {
					this.data = rows
				this.total = total
			})
			},
			deep: true
		}
	}
	}
</script>