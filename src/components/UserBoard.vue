<template>
    <div class="hello">
        <h1>Welcome to regular users page</h1>
        <h2>{{msg}}</h2>
        <router-link to="/">Homepage</router-link>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                msg: 'Feature in development'
            }
        }
    }
</script>

<style scoped>
    h1, h2 {
        font-weight: normal;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        display: inline-block;
        margin: 0 10px;
    }
    a {
        color: #42b983;
    }
</style>