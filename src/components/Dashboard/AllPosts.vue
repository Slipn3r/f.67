<template>
	<div class="allposts">
		<div class="controls">
			<div class="timestamp">
				<button type="button" @click="sortAsc('timestamp')" class="control-active"><i class="fa fa-sort-amount-asc"></i></button>
				<i class="fa fa-calendar"></i>
				<button type="button" @click="sortDesc('timestamp')"><i class="fa fa-sort-amount-desc"></i></button>
			</div>
			<div class="views">
				<button type="button" @click="sortAsc('views')"><i class="fa fa-sort-amount-asc"></i></button>
				<i class="fa fa-eye"></i>
				<button type="button" @click="sortDesc('views')"><i class="fa fa-sort-amount-desc"></i></button>
			</div>
			<div class="comments">
				<button type="button" @click="sortAsc('comments')"><i class="fa fa-sort-amount-asc"></i></button>
				<i class="fa fa-comments"></i>
				<button type="button" @click="sortDesc('comments')"><i class="fa fa-sort-amount-desc"></i></button>
			</div>
			<div class="search">
				<i class="fa fa-search"></i><input type="text" v-model="searchQuery" />
			</div>
			<div class="width">
				<button type="button" @click="cardWidth = 'col-3'" v-bind:class="cardWidth == 'col-3' ? 'control-active' : ''">
					<i class="fa fa-th"></i>
				</button>
				<button type="button" @click="cardWidth = 'col-1'" v-bind:class="cardWidth == 'col-1' ? 'control-active' : ''">
					<i class="fa fa-th-list"></i>
				</button>
			</div>
		</div>
		<div 
			v-for="post in filteredList"
			v-bind:key="post.id"
			v-bind:class="cardWidth"
			class="post-card"
		>
			<button @click="deletePost(post.id)"><i class="fa fa-trash"></i></button>
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
</template>

<script>
	export default {
		data () {
			return {
				posts: [],
				sortCond: '',
				searchQuery: '',
				cardWidth: 'col-3'
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
			getPosts() {
				this.$http.get('http://' + this.$domain + ':3000/v1/getposts')
				.then(response => {
					this.posts = []
					this.posts = response.data.rows
					this.sortDesc('timestamp')
				})
			},
			deletePost(id) {
				if(confirm('Are you sure you want to delete this post?')) {
					this.$http.post('http://' + this.$domain + ':3000/v1/deletepost', {
						id: id
					})
					.then(this.getPosts())
				}
			},
			sortAsc(cond) {
				this.sortCond = cond;
				this.posts.sort(this.sortAlphaNumAsc)
				document.querySelectorAll('.controls > div:not(.width) > button').forEach(element => element.classList.remove('control-active'))
				document.querySelector('.' + cond + ' > button:nth-child(1)').classList.add('control-active')
			},
			sortDesc(cond) {
				this.sortCond = cond;
				this.posts.sort(this.sortAlphaNumAsc)
				this.posts.reverse()
				document.querySelectorAll('.controls > div:not(.width) > button').forEach(element => element.classList.remove('control-active'))
				document.querySelector('.' + cond + ' > button:nth-child(3)').classList.add('control-active')
			},
			sortAlphaNumAsc(a,b) {
				var cond = this.sortCond
				var reA = /[^a-zA-Z]/g
				var reN = /[^0-9]/g
				a[cond] == null ? a[cond] = 0 : a[cond]
				b[cond] == null ? b[cond] = 0 : b[cond]
				var aA = a[cond].toString().replace(reA, "")
				var bA = b[cond].toString().replace(reA, "")
				if(aA === bA) {
						var aN = parseInt(a[cond].toString().replace(reN, ""), 10)
						var bN = parseInt(b[cond].toString().replace(reN, ""), 10)
						return aN === bN ? 0 : aN > bN ? 1 : -1
				} else {
						return aA > bA ? 1 : -1
				}
			},
			reverse() {
				this.posts.reverse()
			}
		},
		mounted(){
			this.getPosts()
		}
	}
</script>
<style scoped>
	.controls {
		padding: 0 0.5em 1.35em 0.5em;
	}
	.controls > div {
		display: inline-block;
		margin-right: 1.5em;
		background: #fff;
		border: 1px solid rgba(0, 0, 0, 0.125);
		border-radius: 3px;
	}
	.controls > div > button, .controls > div > input {
		height: 2.5em;
		-webkit-appearance: none;
		border: none;
		background: #fff;
		outline: none;
		color: #2c3e50;
	}
	.controls > div > button {
		cursor: pointer;
		padding: 0 10px;
	}
	.controls > div > input {
		cursor: text;
		padding: 0;
	}
	.control-active {
		background: #e9ecef !important;
	}
	.controls > div i {
		font-size: 14px;
	}
	.controls > div > i {
		vertical-align: middle;
		padding: 0 9px;
	}
	.post-card {
		position: relative;
		display: inline-block;
		vertical-align: top;
		padding: 1em;
		margin: 0.5em;
		background: #fff;
		border: 1px solid rgba(0, 0, 0, 0.125);
		border-radius: 5px;
	}
	.post-card > button {
		position: absolute;
		top: 0.5em;
		right: 0.5em;
		padding: 0.5em 0.7em;
		-webkit-appearance: none;
		background: #ffe2e2;
		border: 1px solid rgba(0, 0, 0, 0.125);
		border-radius: 3px;
		cursor: pointer;
	}

	.post-card > .post-info {
		position: initial;
	}

	.post-card.col-3 {
		width: calc(33% - 3em);
	}
	.post-card.col-3 > a > h3 {
		width: calc(100% - 1.5em);
		margin-bottom: 0.3em;
	}

	.post-card.col-1 {
		width: calc(100% - 3em);
	}
	.post-card.col-1 > a {
		display: inline-block;
		width: calc(66% - 2em);
	}
	.post-card.col-1 > .post-info {
		display: inline-block;
	}
	.post-card.col-1 > .post-info > span {
		display: inline-block;
		margin: 0 2em 0 1em;
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
</style>