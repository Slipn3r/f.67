import Vue from 'vue'
import VueRouter from 'vue-router'
import Homepage from '@/components/Homepage'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Logout from '@/components/Logout'
import UserBoard from '@/components/UserBoard'
import Admin from '@/components/Admin'
import Editor from '@/components/Editor'
import Post from '@/components/Post'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Homepage',
		component: Homepage
	},
	{
		path: '/login',
		name: 'login',
		component: Login,
		meta: { 
			guest: true
		}
	},
	{
		path: '/register',
		name: 'register',
		component: Register,
		meta: { 
			guest: true
		}
	},
	{
		path: '/logout',
		name: 'logout',
		component: Logout,
		meta: { 
			requiresAuth: true
		}
	},
	{
		path: '/dashboard',
		name: 'userboard',
		component: UserBoard,
		meta: { 
			requiresAuth: true
		}
	},
	{
		path: '/admin',
		name: 'admin',
		component: Admin,
		meta: { 
			requiresAuth: true,
			is_admin : true
		}
	},
	{
		path: '/editor',
		name: 'editor',
		component: Editor,
		meta: { 
			requiresAuth: true
		}
	},
	{
		path: '/post',
		redirect: '/editor',
		name: 'post',
		component: Post,
		meta: { 
			requiresAuth: true
		}
	},
	{
		path: '/post/:link',
		name: 'post/link',
		component: Post
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

router.beforeEach((to, from, next) => {
	if(to.matched.some(record => record.meta.requiresAuth)) {
		if (localStorage.getItem('jwt') == null) {
			next({
				path: '/login',
				params: { nextUrl: to.fullPath }
			})
		} else {
			let user = JSON.parse(localStorage.getItem('user'))
			if(to.matched.some(record => record.meta.is_admin)) {
				if(user.is_admin == 1){
					next()
				}
				else{
					next({ name: 'userboard'})
				}
			}else {
				next()
			}
		}
	} else if(to.matched.some(record => record.meta.guest)) {
		if(localStorage.getItem('jwt') == null){
			next()
		}
		else{
			next({ name: 'userboard'})
		}
	}else {
		next() 
	}
})

export default router