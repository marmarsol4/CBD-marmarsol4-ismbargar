import { createRouter, createWebHistory } from 'vue-router'
import login from './components/login.vue'
import register from './components/register.vue'
import myFiles from './components/myFiles.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/login',name: 'login',component: login},
        {path: '/register',name: 'register',component: register},
        {path: '/',name: 'myFiles',component: myFiles},
    ] 
})

export default router;