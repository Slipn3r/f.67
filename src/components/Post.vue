<template>
	<div id="post-container">
		<Navbar enableSearch='false'></Navbar>
		<div id="post">
			<editor v-bind:showEdit="isAuthorized"></editor>
		</div>
		<div id="remark42"></div>
		<Footer></Footer>
	</div>
</template>

<script>
	import Navbar from '@/components/Navbar'
	import Footer from '@/components/Footer'
	import Editor from '@/components/Editor'
	export default {
		components: {
			Navbar,
			Footer,
			Editor
		},
		data(){
			return {
				isAuthorized: false
			}
		},
		methods: {
			checkAuth() {
				if (localStorage.getItem('jwt') == null) {
					this.isAuthorized = false
				}else {
					this.isAuthorized = true
				}
			}
		},
		created() {
			this.checkAuth()
		}
	}
</script>

<style scoped>
	#post-container {
		position: relative;
		padding-bottom: 7em;
	}
	#post {
		margin: 5em 15vw 0 15vw;
	}
</style>