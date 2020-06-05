<template>
	<table>
		<thead>
			<tr>
				<th v-for="(key, index) in columns"
					:key="index">
					{{ key == 'is_admin' ? 'account' : key }}
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="entry in users" :key="entry.id">
				<td v-for="(key, index) in columns" :key="index">
					{{entry[key] == null ? '' : entry[key]}}
					<div v-if="!entry[key]" class="actionsContainer">
						<button @click="$emit('actionsClick', [entry.id - 1, 'is_admin'])">
							<span v-if="entry.is_admin == 'admin'">to user</span>
							<span v-else>to admin</span>
						</button>
						<button @click="$emit('actionsClick', [entry.id - 1, 'is_disabled'])">
							<i v-if="entry.is_disabled == 'enabled'" class="fa fa-fw fa-lock"></i>
							<i v-else class="fa fa-fw fa-unlock"></i>
						</button>
						<button @click="$emit('actionsClick', [entry.id - 1, 'toDelete'])"><i class="fa fa-fw fa-trash"></i></button>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
	export default {
		props: {
			users: Array,
			columns: Array
		},
		data() {
			return {}
		}
	}
</script>