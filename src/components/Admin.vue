<template>
	<div id="container">
		<div id="sideMenu">
			<h1><router-link to="/">f.67</router-link></h1>

			<ul class="menu">
				<li
					v-for="view in views"
					v-bind:key="view.name"
					v-bind:class="['menu-button', { active: currentView.name === view.name }]"
					v-on:click="currentView = view"
				>
					<i class="fa fa-fw" v-bind:class="view.icon"></i>
					{{ view.name }}
				</li>
			</ul>

			<ul class="menu">
				<li @click="statusActive = !statusActive"><i class="fa fa-fw fa-server"></i>Status <span class="colorIcon" v-bind:class="status.all"></span></li>
				<li class="status" v-bind:class="{active: statusActive}">
					<p>{{$domain}}: <span v-bind:class="status.domain">{{status.domain}}</span></p>
					<p>Backend: <span v-bind:class="status.backend">{{status.backend}}</span></p>
					<button @click="statusActive = false"><i class="fa fa-fw fa-times"></i></button>
				</li>
			</ul>

		</div>
		<div id="content">
			<div id="titleBar">
				<h2>Dashboard / {{currentView.name.toLowerCase()}}</h2>
				<span class="controls activeControl"><router-link to="/logout">Log out</router-link></span>
				<span class="controls">{{username}}</span>
			</div>
			<component v-bind:is="currentView.component" v-on:change-view="currentView = views[$event]" class="view"></component>
		</div>
	</div>
</template>

<script>
	import Overview from './Dashboard/Overview'
	import NewPost from './Dashboard/NewPost'
	import AllPosts from './Dashboard/AllPosts'
	import Comments from './Dashboard/Comments'
	import Users from './Dashboard/Users'
	import Settings from './Dashboard/Settings'

	var views = [
		{
			name: "Overview",
			icon: "fa-desktop",
			component: Overview
		},
		{
			name: "New post",
			icon: "fa-pencil",
			component: NewPost
		},
		{
			name: "All posts",
			icon: "fa-list",
			component: AllPosts
		},
		{
			name: "Comments",
			icon: "fa-comments",
			component: Comments
		},
		{
			name: "Users",
			icon: "fa-user",
			component: Users
		},
		{
			name: "Settings",
			icon: "fa-cog",
			component: Settings
		}
	];

	export default {
		data () {
			return {
				username: 'user.name',
				views: views,
				currentView: views[0],
				statusActive: false,
				status: {domain:'checking', backend:'checking', all:'checking'}
			}
		},
		methods: {
			checkStatus() {
				this.$http.get('http://' + this.$domain + ':8080')
				.then(response => {
					if(Math.floor(response.status/100) == 2) {
						this.status.domain = 'online'
						if(this.status.all != 'failed') {
							this.status.all = 'online'
						}
					}
				})
				.catch(err => {
					if(err) {
						this.status.domain = this.status.all = 'failed'
					}
				})
				document.querySelector("li.status > p:nth-child(1) > span").classList.add(this.status.domain)
				this.$http.get('http://' + this.$domain + ':3000/v1/getusers')
				.then(response => {
					if(Math.floor(response.status/100) == 2) {
						this.status.backend = 'online'
						if(this.status.all != 'failed') {
							this.status.all = 'online'
						}
					}
				})
				.catch(err => {
					if(err) {
						this.status.backend = this.status.all = 'failed'
					}
				})
				document.querySelector("li.status > p:nth-child(2) > span").classList.add(this.status.backend)
			}
		},
		mounted() {
			localStorage.getItem('user') ? this.username = JSON.parse(localStorage.getItem('user')).name : 'unknown'
			this.checkStatus()
		}
	}
</script>
<style scoped>
	* {
		box-sizing: border-box;
	}
	a, a:visited {
		text-decoration: none;
		color: #2c3e50;
	}
	a:hover {
		color: #183652;
	}
	#container {
		display: table;
		width: 100%;
		height: 100vh;
		background: #fff;
	}

	/* Side Bar */
	#sideMenu {
		width: 203px;
		height: 100%;
		border-right: 1px solid rgba(0, 0, 0, 0.25);
		display: table-cell;
		vertical-align: top;
		color: #2c3e50;
	}
	.menu {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.menu:last-child {
		position: fixed;
		bottom: 0.5em;
		width: inherit;
		background: #fff;
		border-right: 1px solid rgba(0, 0, 0, 0.25);
	}
	.menu::before {
		height: 1px;
		background: rgba(0, 0, 0, 0.25);
		width: calc(100% - 40px);
		display: block;
		margin: 15px auto;
		content:"";
	}
	.menu li {
		display: block;
		padding: 0.5em 20px;
		width: 100%;
		line-height: 30px;
		font-size: 14px;
		color:  #2c3e50;
		position: relative;
	}
	.menu li:hover {
		cursor: pointer;
		color: #183652;
		background: #e9ecef;
	}
	.menu li:hover .notification {
		background: #183652;
	}
	.menu li .fa {
		margin-right: 1em;
	}
	.menu-button.active {
		color: #183652;
		font-weight: 600;
		background: #e9ecef;
	}

	#content {
		max-width: calc(100vw - 203px);
		height: 100%;
		padding: 25px;
		display: table-cell;
		background: #f8f9fa;
	}
	#titleBar {
		height: 36px;
		margin-bottom: 10px;
	}
	.controls {
		display: block;
		height: 20px;
		padding: 0 1em;
		color: #2c3e50;
		font-size: 10px;
		text-transform: uppercase;
		text-align: center;
		line-height: 20px;
		float: right;
		border-radius: 20px;
	}
	.activeControl {
		background: rgba(44, 62, 80, 0.8);
		color: #fff;
	}
	.activeControl a {
		color: #fff;
	}

	.notification {
		display: block;
		width: 22px;
		height: 22px;
		color: #fff;
		font-weight: 600;
		font-size: 12px;
		line-height: 22px;
		text-align: center;
		border-radius: 50%;
		background: #2c3e50;
		position: absolute;
		top: 0; bottom: 0; right: 20px;
		margin: auto;
	}
	.colorIcon {
		display: block;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		position: absolute;
		top: 0; bottom: 0; right: 20px;
		margin: auto;
	}
	.colorIcon.failed {
		background: #ec151f;
	}
	.failed {
		color: #ec151f;
	}
	.colorIcon.checking {
		background: #ff9939;
	}
	.checking {
		color: #ff9939;
	}
	.colorIcon.online {
		background: #2bab51;
	}
	.online {
		color: #2bab51;
	}

	h1 {
		padding: 20px 20px 5px 20px;
		font-size: 1.5em;
		letter-spacing: 1px;
		text-transform: uppercase;
		text-align: center;
		font-weight: 400;
		margin: 0;
	}
	h2 {
		float: left;
		font-size: 1.2em;
		letter-spacing: 1px;
		font-weight: 400;
		margin: 0;
		color: rgba(44, 62, 80, 0.8);
	}
	h3 {
		float: left;
		color: #2c3e50;
		font-size: 32px;
		font-weight: 400;
		margin: 0;
		margin-top: 8%;
		margin-left: 20px;
		margin-bottom: 6px;
	}
	.clearFix {
		clear: both;
	}

	.menu > li.status {
		display: none;
		width: min-content;
		width: auto;
		position: fixed;
		left: 202px;
		bottom: 0;
		padding: 0.5em 2.5em 0.5em 1em;
		background: #fff;
		border: 1px solid rgba(0, 0, 0, 0.25);
		border-radius: 3px;
		cursor: initial;
		z-index: 5;
	}
	.menu > li.status.active {
		display: block;
	}
	.menu > li.status > p {
		margin: 0;
	}
	.menu > li.status > button {
		position: absolute;
    top: 0;
    right: 0;
    padding: 0.5em;
    -webkit-appearance: none;
    border: none;
    outline: none;
    background: none;
    cursor: pointer;
	}
	.menu > li.status > button > i {
		margin: 0;
	}
</style>