<template>
	<div id="home">
		<Navbar v-model="searchQuery" enableSearch='true'></Navbar>
		<div id="posts">
			<div 
				v-for="post in filteredList"
				v-bind:key="post.id"
				class="post-card">
				<div class="cover-image">
					<img v-bind:src="post.cover_image"/>
				</div>
				<a v-bind:href="'/post/' + post.link">
					<h3>{{post.title ? post.title : "No title! How is that possible?"}}</h3>
				</a>
				<div class="post-info">
					<span>{{post.author ? post.author : "Unknown author"}}, {{new Date(post.timestamp*60000).toLocaleString().slice(0, -3)}}</span>
					<i class="fa fa-eye"></i>{{post.views > 1000 ? post.views/1000 + "k" : post.views ? post.views : 0}}
					<i class="fa fa-comments"></i>{{post.comments ? post.comments : 0}}
				</div>
			</div>
		</div>
		<Footer></Footer>
	</div>
</template>

<script>
	import Navbar from '@/components/Navbar'
	import Footer from '@/components/Footer'
	export default {
		components: {
			Navbar,
			Footer
		},
		data () {
			return {
				posts: [],
				searchQuery: ''
			}
		},
		computed: {
			filteredList() {
				return this.posts.filter(post => {
					return post.title.toLowerCase().includes(this.searchQuery.toLowerCase())
				})
			}
		},
		methods: {
			checkAuth() {
				if (localStorage.getItem('jwt') == null) {
					this.isAuthorized = false
				}else {
					this.isAuthorized = true
				}
			},
			getPosts() {
				this.$http.get('http://' + this.$domain + ':3000/v1/getposts')
				.then(response => {
					this.posts = []
					this.posts = response.data.rows
					this.posts.reverse()
				})
			}
		},
		created() {
			this.getPosts()
		}
	}
</script>
<style scoped>
	#home {
		position: relative;
		padding: 70px 0 100px 0;
		height: 100%;
		overflow: hidden;
	}
	#posts {
		width: 100%;
		display: inline-block;
		padding: 0 5em;
	}
	.post-card {
		height: 20em;
		width: calc(33% - 1em);
		margin: 0.6em;
	}
</style>