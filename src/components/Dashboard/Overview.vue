<template>
	<div class="recent">
		<h2>Recent posts</h2>
		<div 
			v-for="post in recentPosts"
			v-bind:key="post.id"
			class="post-card"
		>
				<div class="cover-image">
					<img v-bind:src="post.cover_image"/>
				</div>
				<div class="post-info">
					<a v-bind:href="'/post/' + post.link" target="blank">
						<h3>{{post.title ? post.title : "No title! How is that possible?"}}</h3>
					</a>
					<span>{{post.author ? post.author : "Unknown author"}}, {{new Date(post.timestamp*60000).toLocaleDateString()}}</span>
					<i class="fa fa-fw fa-eye"></i>{{post.views > 1000 ? Math.round(post.views/1000) + "k" : post.views ? post.views : 0}}
					<i class="fa fa-fw fa-comments"></i>{{post.comments ? post.comments : 0}}
				</div>
		</div>
		<button v-on:click="$emit('change-view', 2)">All posts</button>

		<h2>Recent comments</h2>
		<p>Feature in development</p>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				posts: []
			}
		},
		computed: {
			recentPosts() {
				return this.posts.slice(this.posts.length - 3 >= 0 ? this.posts.length - 3 : 0, this.posts.length)
			}
		},
		methods: {
			getPosts() {
				this.$http.get('http://' + this.$domain + ':3000/v1/getposts')
				.then(response => {
					this.posts = response.data.rows
				})
			}
		},
		mounted(){
			this.getPosts()
		}
	}
</script>
<style>
	.recent .post-card {
		width: calc(33% - 3em);
		height: 20em;
	}
	.post-card {
		display: inline-block;
    vertical-align: text-top;
		padding: 1em;
		margin: 0.5em;
		background: #fff;
		border: 1px solid rgba(0, 0, 0, 0.125);
		border-radius: 5px;
	}
	.post-card > .cover-image {
		height: 60%;
		position: relative;
		overflow: hidden;
		margin-bottom: 0.75em;
    border-radius: 3px;
	}
	.post-card > .cover-image > img {
		height: 100%;
    position: absolute;
    top: -9999px;
    bottom: -9999px;
    left: -9999px;
    right: -9999px;
    margin: auto;
	}
	.post-card > .post-info {
		height: 33%;
	}
	.post-card > .post-info > h3 {
		font-size: 1.4em;
		margin: 0 0 0.5em 0;
	}
	.post-card > .post-info > span {
		display: block;
		font-size: 14px;
		margin-bottom: 0.3em;
	}
	.post-card > .post-info {
		font-size: 14px;
	}
	.post-card > .post-info > i {
		margin-right: 4px;
	}
	.post-card > .post-info > i:nth-of-type(2) {
		margin-left: 0.7em;
	}

	.recent > button {
		display: block;
		height: 2.5em;
		margin: 0.5em 0 0 0.5em;
		padding: 0 1em;
		-webkit-appearance: none;
		border: 1px solid rgba(0, 0, 0, 0.125);
		border-radius: 3px;
		background: #fff;
		outline: none;
		color: #2c3e50;
		cursor: pointer;
	}
</style>