<template>
	<div id="login-form">
		<form>
			<h1>Login</h1>
			<div>
				<input id="email" type="email" v-model="email" placeholder="E-mail" required autofocus>
			</div>
			<div>
				<div>
					<input id="password" type="password" v-model="password" placeholder="Password" required>
				</div>
			</div>
			<div>
				<button type="submit" @click="handleSubmit">
					Login
				</button>
			</div>
		</form>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				email : "",
				password : ""
			}
		},
		methods : {
			handleSubmit(e){
				e.preventDefault()
				if (this.password.length > 0) {
					this.$http.post('http://' + this.$domain + ':3000/login', {
						email: this.email,
						password: this.password
					})
					.then(response => {
						let is_admin = response.data.user.is_admin
						localStorage.setItem('user',JSON.stringify(response.data.user))
						localStorage.setItem('jwt',response.data.token)

						if (localStorage.getItem('jwt') != null){
							this.$emit('loggedIn')

							if(this.$route.params.nextUrl != null){
								this.$router.push(this.$route.params.nextUrl)
							}
							else {
								if(is_admin == 1){
									this.$router.push('admin')
								}
								else {
									this.$router.push('dashboard')
								}
							}
						}
					})
				}
			}
		},
		created() {
			this.$http.get('http://' + this.$domain + ':3000/v1/getusers')
				.then(response => {if(response.data.rows.length == 0)this.$router.push('register')})
		}
	}
</script>

<style scoped>
	#login-form {
		width: 300px;
		margin: 30vh auto auto auto;
		text-align: center;
	}
	button, input, select, select > option {
		height: 2.5em;
		width: 100%;
		margin-bottom: 1em;
		padding: 0 1em;
		-webkit-appearance: none;
		outline: none;
		border: 1px solid rgba(0, 0, 0, 0.125);
		border-radius: 3px;
		background: #fff;
		color: #2c3e50;
	}
	button {
		height: 3em;
		width: 33%;
		cursor: pointer;
	}
</style>