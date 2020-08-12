<template>
	<div class="new-post">
		<h2>New post</h2>
		<editor v-bind:showEditable="false"></editor>
	</div>
</template>

<script>
	import Editor from '@/components/Editor'
	export default {
		components: {
			Editor
		},
		data () {
			return {
			}
		}
	}
</script>
<style>
	#container .editor__content {
		border: 1px solid rgba(0, 0, 0, 0.125);
		border-top: none;
		height: 60vh;
	}
</style>