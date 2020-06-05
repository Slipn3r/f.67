<template>
	<div class="userlist">
		<h2>Users</h2>
		<users-grid
			:users="users"
			:columns="columns"
			:key="gridId"
			v-on:actionsClick="actionsHandler($event)"
		>
		</users-grid>

		<button @click="toggleForm()">Add user<i class="fa fa-fw fa-chevron-down"></i></button>

		<form id="add-user">
			<label for="name">Name</label>
			<div><input id="name" type="text" v-model="name" required autofocus></div>

			<label for="email" >E-Mail Address</label>
			<div><input id="email" type="email" v-model="email" required></div>

			<label for="password">Password</label>
			<div><input id="password" type="password" v-model="password" required></div>

			<label for="password-confirm">Confirm Password</label>
			<div><input id="password-confirm" type="password" v-model="password_confirmation" required></div>

			<label for="password-confirm">Is this an administrator account?</label>
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
	import UsersGrid from './UsersGrid'
	export default {
		components: {
			UsersGrid
		},
		data(){
			return {
				columns: ["id", "name", "email", "is_admin", 'is_disabled', ''],
				users: [],
				gridId: +new Date(),
				actions: [],
				name: "",
				email: "",
				password: "",
				password_confirmation: "",
				is_admin: null
			}
		},
		methods : {
			getUsers(){
				this.$http.get('http://' + this.$domain + ':3000/v1/getusers')
				.then(response => {
					this.users = response.data.rows
					this.users.forEach(user => this.actions.push({id: user.id, is_admin: user.is_admin, is_disabled: user.is_disabled, toDelete: null}))
					this.users.forEach(user => user.is_admin = user.is_admin ? 'admin' : 'user')
					this.users.forEach(user => user.is_disabled = user.is_disabled ? 'disabled' : 'enabled')
					this.gridId = +new Date()
				})
			},
			toggleForm() {
				if (document.querySelector('#add-user').style.display == 'block') {
					document.querySelector('#add-user').style.display = 'none'
					document.querySelector('.userlist > button > i').classList.remove('fa-chevron-up')
					document.querySelector('.userlist > button > i').classList.add('fa-chevron-down')
				} else {
					document.querySelector('#add-user').style.display = 'block'
					document.querySelector('.userlist > button > i').classList.remove('fa-chevron-down')
					document.querySelector('.userlist > button > i').classList.add('fa-chevron-up')
				}
			},
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
					.then(this.getUsers())
					this.name = ""
					this.email = ""
					this.password = ""
					this.password_confirmation = ""
					this.is_admin = null
				} else {
					this.password = ""
					this.passwordConfirm = ""

					return alert("Passwords do not match")
				}
			},
			actionsHandler(event) {
				var id = event[0]
				var action = event[1]
				var confimString = 'do this'
				switch (action) {
					case 'is_admin':
						confimString = 'make ' + this.users[id].name + (this.actions[id].is_admin ? ' a regular user?' : ' a mighty admin?')
						break
					case 'is_disabled':
						confimString = 'disable ' + this.users[id].name + '\'s account? Login will be disabled, posts authorship won\'t change'
						break
					case 'toDelete':
						confimString = 'delete ' + this.users[id].name + '\'s account? THIS ACTION CANNOT BE UNDONE! The account will be purged completely, posts authorship will change to "Unknown author"'
						break
				}

				if(confirm('Are you sure you want to ' + confimString)) {
					this.actions[id][action] == null ? this.actions[id][action] = 1 : this.actions[id][action] = null
					if(action != 'toDelete') {
						this.$http.post("http://" + this.$domain + ":3000/v1/update-user", {
							is_admin: this.actions[id].is_admin,
							is_disabled: this.actions[id].is_disabled,
							id: id + 1,
						}).then(this.getUsers())
					}
					else {
						this.$http.post("http://" + this.$domain + ":3000/v1/delete-user", {
							id: id + 1,
						}).then(this.getUsers())
					}
				}
			}
		},
		created(){
			this.getUsers()
		}
	}
</script>

<style>
	.userlist table {
		width: 100%;
		background: #fff;
		border: 1px solid rgba(0, 0, 0, 0.125);
		font-size: 14px;
	}
	.userlist table td {
		padding: 0.5em;
		text-align: left;
	}
	.userlist table td:last-of-type {
		text-align: center;
		background: #fff;
		border-left: 2px solid #2c3e50;
		width: 163px;
		padding: 0 0 0 0.5em;
	}
	.userlist table tbody tr:nth-of-type(odd) {
		background: #e9ecef;
	}
	.userlist button, .userlist #add-user input, .userlist select, .userlist select > option {
		-webkit-appearance: none;
		outline: none;
		border: 1px solid rgba(0, 0, 0, 0.125);
		border-radius: 3px;
		background: #fff;
		color: #2c3e50;
	}
	.userlist button {
		display: block;
		height: 2.5em;
		margin: 1em 0 0 0;
		padding: 0 1em;
		cursor: pointer;
	}
	.userlist button > i {
		margin-left: 1em;
	}
	.userlist #add-user{
		display: none;
		margin-top: 1em;
	}
	.userlist #add-user input {
		height: 2em;
		width: 33%;
		margin-bottom: 1em;
		cursor: text;
	}
	.userlist select {
		-webkit-appearance: menulist;
		padding: 0.2em 1em;
	}

	.actionsContainer {
		display: inline-block;
	}
	.actionsContainer button {
		display: inherit;
		height: 1.8em;
		padding: 0 0.5em;
		margin: 0 0.5em 0 0;
	}
	.actionsContainer button:first-of-type {
		min-width: 5em;
	}
	.actionsContainer button:nth-of-type(3) {
		background: #ffe2e2;
	}
	.actionsContainer button > i {
		margin: 0;
	}
</style>