<template>
	<h4>Logging out...</h4>
</template>

<script>
	export default {
		methods : {
			logout(){
				localStorage.removeItem('user')
				localStorage.removeItem('jwt')
				this.$emit('loggedOut')
				this.$router.push('/')
			}
		},
		created(){
			this.logout()
		}
	}
</script>