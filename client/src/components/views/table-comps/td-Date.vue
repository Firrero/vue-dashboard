
<template>
    <span>{{ t }}</span>
</template>
<script>
	import moment from 'moment'
	export default {
		props: ['value'],

		computed: {
			t () {
				const t = moment(this.value)
				return t.format('DD.MM.YYYY')

			}
		}
	}
</script>