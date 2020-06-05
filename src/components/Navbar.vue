<template>
	<div id="navbar">
		<ul>
			<li><router-link to="/"><i class="fa fa-fw fa-home"></i>Home</router-link></li>
			<li v-if="isAuthorized"><router-link to="/admin"><i class="fa fa-fw fa-dashboard"></i>Dashboard</router-link></li>
			<li><div v-if="enableSearch == 'true'"><i class="fa fa-search"></i><input type="text" v-bind:value="value" v-on:input="$emit('input', $event.target.value)"/></div></li>
		</ul>
	</div>
</template>

<script>
	export default {
		props: {
			value: String,
			enableSearch: String
		},
		data(){
			return {
			}
		},
		methods: {
			checkAuth() {
				this.isAuthorized = false
				if(localStorage) {
					if (localStorage.getItem('jwt') != null) {
						this.isAuthorized = true
					}
				}
			}
		},
		created() {
			this.checkAuth()
		}
	}
</script>

<style scoped>
	#navbar {
		position: fixed;
		top: 0;
		width: 100vw;
		height: 50px;
		padding: 0 5em;
		z-index: 10;
		background: #f8f9fa;
		border-bottom: 1px solid rgba(0, 0, 0, 0.125);
	}
	ul {
		list-style: none;
	}
	li {
		float: left;
    position: relative;
    width: auto;
    height: 49px;
    padding: 1em;
	}
	li:hover:not(:last-of-type) {
		background: #e9ecef;
	}
	li > a > i {
		margin-right: 0.2em;
	}
	li:last-of-type {
		float: right;
		padding: 0.5em 1em;
	}
	li:last-of-type > div {
		padding: 0 0.2em 0 0.7em;
		background: #fff;
		border: 1px solid rgba(0, 0, 0, 0.125);
		border-radius: 3px;
	}
	li:last-of-type > div > input {
		height: 2.5em;
		margin-left: 0.5em;
		-webkit-appearance: none;
		border: none;
		background: #fff;
		outline: none;
		color: #2c3e50;
		cursor: text;
		padding: 0;
	}
</style>