<template>
	<div id="signup-form">
		<form>
			<h1>Register</h1>
			<div>
				<input id="name" type="text" v-model="name" placeholder="Name" required autofocus>
			</div>

			<div>
				<input id="email" type="email" v-model="email" placeholder="E-Mail" required>
			</div>

			<div>
				<input id="password" type="password" v-model="password" placeholder="Password" required>
			</div>

			<div>
				<input id="password-confirm" type="password" v-model="password_confirmation" placeholder="Confirm password" required>
			</div>

			<label for="password-confirm">Admin</label>
			<div>
				<select v-model="is_admin">
					<option value=1>Yes</option>
					<option value=null>No</option>
				</select>
			</div>

			<div>
				<button type="submit" @click="handleSubmit">
					Register
				</button>
			</div>
		</form>
	</div>
</template>

<script>
	export default {
		props : ["nextUrl"],
		data(){
			return {
				name : "",
				email : "",
				password : "",
				password_confirmation : "",
				is_admin : null
			}
		},
		methods : {
			handleSubmit(e) {
				e.preventDefault()

				if (this.password === this.password_confirmation && this.password.length > 0)
				{
					let url = "http://" + this.$domain + ":3000/register"
					if(this.is_admin == 1) url = "http://" + this.$domain + ":3000/register-admin"
					this.$http.post(url, {
						name: this.name,
						email: this.email,
						password: this.password,
						is_admin: this.is_admin
					})
					.then(response => {
						localStorage.setItem('user',JSON.stringify(response.data.user))
						localStorage.setItem('jwt',response.data.token)

						if (localStorage.getItem('jwt') != null){
							this.$emit('loggedIn')
							this.$router.push('admin')
						}
					})
					.catch(error => {
						console.error(error);
					});
				} else {
					this.password = ""
					this.passwordConfirm = ""

					return alert("Passwords do not match")
				}
			}
		}
	}
</script>

<style scoped>
	#signup-form {
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