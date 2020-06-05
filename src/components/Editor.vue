<template>
	<div class="editor">
		<div v-if="showEditable" class="checkbox">
			<input type="checkbox" id="editable" v-model="editable" />
			<label for="editable">editable</label>
		</div>

		<img v-if="post.cover_image" v-bind:src="post.cover_image"/>

		<editor-floating-menu :editor="editor" v-slot="{ commands, isActive, menu }" v-bind:class="{disabled: !editable}">
			<div
				class="editor__floating-menu"
				:class="{ 'is-active': menu.isActive }"
				:style="`top: ${menu.top}px`"
			>

				<button
					class="menubar__button"
					:class="{ 'is-active': isActive.heading({ level: 1 }) }"
					@click="commands.heading({ level: 1 })"
				>
					H1
				</button>

				<button
					class="menubar__button"
					:class="{ 'is-active': isActive.heading({ level: 2 }) }"
					@click="commands.heading({ level: 2 })"
				>
					H2
				</button>

				<button
					class="menubar__button"
					:class="{ 'is-active': isActive.heading({ level: 3 }) }"
					@click="commands.heading({ level: 3 })"
				>
					H3
				</button>

				<button
					class="menubar__button"
					:class="{ 'is-active': isActive.bullet_list() }"
					@click="commands.bullet_list"
				>
					<i class="fa fa-fw fa-list-ul"></i>
				</button>

				<button
					class="menubar__button"
					:class="{ 'is-active': isActive.ordered_list() }"
					@click="commands.ordered_list"
				>
					<i class="fa fa-fw fa-list-ol"></i>
				</button>

				<button
					class="menubar__button"
					:class="{ 'is-active': isActive.blockquote() }"
					@click="commands.blockquote"
				>
					<i class="fa fa-fw fa-quote-right"></i>
				</button>

				<button
					class="menubar__button"
					:class="{ 'is-active': isActive.code_block() }"
					@click="commands.code_block"
				>
					{...}
				</button>

				<button
					class="menubar__button"
					@click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: false })"
				>
					<i class="fa fa-fw fa-table"></i>
				</button>

			</div>
		</editor-floating-menu>

		<editor-menu-bar :editor="editor" v-slot="{ commands, isActive }" v-bind:class="{disabled: !editable}">
			<div class="menubar">

				<button
					class="menubar__button"
					:class="{ 'is-active': isActive.bold() }"
					@click="commands.bold"
				>
					<i class="fa fa-fw fa-bold"></i>
				</button>

				<button
					class="menubar__button"
					:class="{ 'is-active': isActive.italic() }"
					@click="commands.italic"
				>
					<i class="fa fa-fw fa-italic"></i>
				</button>

				<button
					class="menubar__button"
					:class="{ 'is-active': isActive.strike() }"
					@click="commands.strike"
				>
					<i class="fa fa-fw fa-strikethrough"></i>
				</button>

				<button
					class="menubar__button"
					:class="{ 'is-active': isActive.underline() }"
					@click="commands.underline"
				>
					<i class="fa fa-fw fa-underline"></i>
				</button>

				<button
					class="menubar__button"
					:class="{ 'is-active': isActive.code() }"
					@click="commands.code"
				>
					<i class="fa fa-fw fa-code"></i>
				</button>

				<button
					class="menubar__button"
					:class="{ 'is-active': isActive.link() }"
					@click="paste('link')"
				>
					<i class="fa fa-fw fa-chain"></i>
				</button>

				<button
					class="menubar__button"
					:class="{ 'is-active': isActive.heading({ level: 1 }) }"
					@click="commands.heading({ level: 1 })"
				>
					H1
				</button>

				<button
					class="menubar__button"
					:class="{ 'is-active': isActive.heading({ level: 2 }) }"
					@click="commands.heading({ level: 2 })"
				>
					H2
				</button>

				<button
					class="menubar__button"
					:class="{ 'is-active': isActive.heading({ level: 3 }) }"
					@click="commands.heading({ level: 3 })"
				>
					H3
				</button>

				<button
					class="menubar__button"
					:class="{ 'is-active': isActive.bullet_list() }"
					@click="commands.bullet_list"
				>
					<i class="fa fa-fw fa-list-ul"></i>
				</button>

				<button
					class="menubar__button"
					:class="{ 'is-active': isActive.ordered_list() }"
					@click="commands.ordered_list"
				>
					<i class="fa fa-fw fa-list-ol"></i>
				</button>

				<button
					class="menubar__button"
					:class="{ 'is-active': isActive.blockquote() }"
					@click="commands.blockquote"
				>
					<i class="fa fa-fw fa-quote-right"></i>
				</button>

				<button
					class="menubar__button"
					:class="{ 'is-active': isActive.code_block() }"
					@click="commands.code_block"
				>
					{...}
				</button>

				<!--<button
					class="menubar__button"
					:class="{ 'is-active': isActive.code() }"
					@click="paste('image')"
				>
					<i class="fa fa-fw fa-image"></i>
				</button>-->

				<button
					class="menubar__button"
					@click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: false })"
				>
					<i class="fa fa-fw fa-table"></i>
				</button>

				<span v-if="isActive.table()" class="table-controls">
					<button
						class="menubar__button"
						@click="commands.deleteTable"
					>
						<i class="fa fa-fw fa-trash"></i>
					</button>
					<button
						class="menubar__button"
						@click="commands.addColumnAfter"
					>
						Add column
					</button>
					<button
						class="menubar__button"
						@click="commands.deleteColumn"
					>
						Delete column
					</button>
					<button
						class="menubar__button"
						@click="commands.addRowAfter"
					>
						Add row
					</button>
					<button
						class="menubar__button"
						@click="commands.deleteRow"
					>
						Delete row
					</button>
					<button
						class="menubar__button"
						@click="commands.toggleCellMerge"
					>
						Combine cells
					</button>
				</span>

				<button
					class="menubar__button"
					@click="commands.horizontal_rule"
				>
					<i class="fa fa-fw fa-minus"></i>
				</button>

				<button
					class="menubar__button"
					@click="commands.undo"
				>
					<i class="fa fa-fw fa-rotate-left"></i>
				</button>

				<button
					class="menubar__button"
					@click="commands.redo"
				>
					<i class="fa fa-fw fa-rotate-right"></i>
				</button>

			</div>
		</editor-menu-bar>

		<editor-content :editor="editor" />

		<label for="cover-image" v-bind:class="{disabled: !editable}">Cover image (url)</label>
		<div v-bind:class="{disabled: !editable}">
			<input id="cover-image" type="text" v-model="coverImage" required>
		</div>

		<div v-bind:class="{disabled: !editable}">
			<button type="submit" @click="handleSubmit">
				<i class="fa fa-fw fa-floppy-o"></i>Save
			</button>
		</div>
	</div>
</template>

<script>
	import Axios from 'axios'
	import javascript from 'highlight.js/lib/languages/javascript'
	import css from 'highlight.js/lib/languages/css'
	import nginx from 'highlight.js/lib/languages/nginx'
	import bash from 'highlight.js/lib/languages/bash'

	import { Editor, EditorContent, EditorMenuBar, EditorFloatingMenu} from 'tiptap'
	import {
		Blockquote,
		CodeBlock,
		HardBreak,
		Heading,
		HorizontalRule,
		OrderedList,
		BulletList,
		ListItem,
		Bold,
		Code,
		Italic,
		Link,
		Table,
		TableHeader,
		TableCell,
		TableRow,
		Strike,
		Underline,
		History,
		Search,
		Placeholder,
		CodeBlockHighlight
	} from 'tiptap-extensions'
	import Doc from '@/js/Doc'
	import Title from '@/js/Title'
	import Image from '@/js/Image'

	async function upload(file) {
		let formData = new FormData()
		formData.append('file', file)
		const headers = {'Content-Type': 'multipart/form-data'}
		const response = await Axios.post('http://' + this.$domain + ':3000/upload', formData, {headers: headers} )
		return response.data.src
	}

	export default {
		components: {
			EditorContent,
			EditorMenuBar,
			EditorFloatingMenu,
		},
		props: {
			showEditable: Boolean,
		},
		data(){
			return {
					editor: new Editor({
						editable: false,
						extensions: [
							new Doc(),
							new Title(),
							new Placeholder({
								showOnlyCurrent: false,
								emptyNodeText: node => {
									if (node.type.name === 'title') {
										return 'Give me a name'
									}
									return 'Write something'
								},
							}),
							new Blockquote(),
							new BulletList(),
							new CodeBlock(),
							new HardBreak(),
							new Heading(),
							new HorizontalRule(),
							new ListItem(),
							new OrderedList(),
							new Link(),
							new Bold(),
							new Code(),
							new Italic(),
							new Strike(),
							new Underline(),
							new History(),
							new Image(null, null, upload),
							new Table({
								resizable: true,
							}),
							new TableHeader(),
							new TableCell(),
							new TableRow(),
							new Search({
								disableRegex: false,
							}),
							new CodeBlockHighlight({
								languages: {
									javascript,
									css,
									nginx,
									bash,
								}
							})
						],
						content: '',
						onUpdate: ({ getJSON, getHTML }) => {
							this.json = getJSON()
							this.html = getHTML()
						},
				}),
				editable: false,
				id: null,
				json: '',
				html: '',
				coverImage: '',
				post: []
			}
		},
		methods : {
			paste(arg) {
				switch (arg) {
					case 'link':
						var url = prompt('URL (leave empty to remove existing link):', '')
						if (url != null) {
							var from = this.editor.state.selection.from
							if(this.editor.state.selection.empty) {
								this.editor.view.dispatch(this.editor.state.tr.insertText(url))
								this.editor.setSelection(from, from + url.length)
							}
							this.editor.commands.link({"href": url})
						}
						break
					case 'image':
						//todo
						break
				}
			},
			handleSubmit(e) {
				if(this.json.content[0].content[0].text){
					if(this.link) {
						this.updatePost(e)
					}else {
						this.saveNewPost(e)
					}
				}else {
					alert('Please give your post some title')
				}
			},
			getPostByLink(){
				if(this.$route.params.link) {
					this.link = encodeURI(this.$route.params.link)
					this.$http.post('http://' + this.$domain + ':3000/v1/getpostbylink', {link: this.link})
					.then(response => {
						if(response.data.post){
							this.post = response.data.post
							this.html = response.data.post.html
							this.editor.setContent(response.data.post.html)
							this.coverImage = response.data.post.cover_image
						} else {
							this.editor.content = 'empty post'
						}
					})
				}else {
					this.editable = true
					this.editor.setOptions({
						editable: this.editable,
					})
				}
			},
			saveNewPost(e) {
				e.preventDefault()
				this.post.title = this.json.content[0].content[0].text
				this.post.timestamp = Math.round(Date.now()/60000)
				let date = new Date(this.post.timestamp*60000)
				this.post.author = JSON.parse(localStorage.getItem('user')).name
				this.post.link = encodeURI(date.getFullYear().toString() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + this.post.title.replace(/[\s\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]+/g, '-') + '-' + date.getMinutes())

				this.$http.post('http://' + this.$domain + ':3000/v1/getpostbylink', {link: this.post.link})
					.then(response => {
					if(response.data.post) {
						alert('Wait a minute or change post title')
					}else {
						this.post.cover_image = this.coverImage
						this.post.html = this.html
						this.post.json = JSON.stringify(this.json)
						let url = "http://" + this.$domain + ":3000/v1/Editor/save"
						this.$http.post(url, {
							title: this.post.title, 
							timestamp: this.post.timestamp,
							author: this.post.author, 
							link: this.post.link, 
							cover_image: this.post.cover_image, 
							html: this.post.html, 
							json: this.post.json
						})
						.then(this.$router.push('/post/' + this.post.link))
					}
				})
			},
			updatePost(e) {
				e.preventDefault()
				this.post.title = this.json.content[0].content[0].text
				let date = new Date(this.post.timestamp*60000)
				this.post.link = encodeURI(date.getFullYear().toString() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + this.post.title.replace(/[\s\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]+/g, '-') + '-' + date.getMinutes())
				this.post.last_changed = Math.round(Date.now()/60000)
				this.post.cover_image = this.coverImage
				this.post.html = this.html
				this.post.json = JSON.stringify(this.json)
				let url = "http://" + this.$domain + ":3000/v1/Editor/update"
				this.$http.post(url, {
					title: this.post.title, 
					last_changed: this.post.last_changed,
					cover_image: this.post.cover_image, 
					html: this.post.html, 
					json: this.post.json,
					link: this.post.link,
					id: this.post.id
				}).then(this.link == this.post.link ? this.getPostByLink() : this.$router.push('/post/' + this.post.link))
			}
		},
		watch: {
			editable() {
				this.editor.setOptions({
					editable: this.editable,
				})
			},
		},
		mounted() {
			if (!document.querySelector('editor__content')) {
				if(document.querySelector('div.menubar')) {
					document.querySelector('div.menubar').nextElementSibling.classList.add('editor__content')
				}
			}
			this.getPostByLink()
		},
		beforeDestroy() {
			this.editor.destroy()
		}
	}
</script>

<style>
	.editor .is-empty:nth-child(1)::before,
	.editor .is-empty:nth-child(2)::before {
		content: attr(data-empty-text);
		float: left;
		color: #aaa;
		pointer-events: none;
		height: 0;
		font-style: italic;
	}
	.editor img {
		max-width: 100%;
    margin-left: 1em;
	}
	.editor button:not(.menubar__button), .editor input[type=text], .editor select, .editor select > option {
		-webkit-appearance: none;
		outline: none;
		border: 1px solid rgba(0, 0, 0, 0.125);
		border-radius: 3px;
		background: #fff;
		color: #2c3e50;
	}
	.editor button:not(.menubar__button) {
		display: block;
		height: 2.5em;
		margin: 1em 0 0 0;
		padding: 0 1em;
		cursor: pointer;
	}
	.editor button:not(.menubar__button) > i {
		margin-right: 0.5em;
	}
	.editor input[type=text] {
		height: 2em;
		width: 33%;
		margin-bottom: 1em;
		cursor: text;
	}

	.disabled {
		visibility: hidden !important;
	}
</style>
<style lang="css" src="@/assets/css/style.css"></style>
<style lang="css" src="@/assets/css/floatingmenu.css"></style>
<style lang="css" src="@/assets/css/monokai-sublime.css"></style>