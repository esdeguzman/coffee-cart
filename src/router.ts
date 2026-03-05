import { createRouter, createWebHistory } from 'vue-router'
import ListPage from './components/pages/ListPage.vue'
import CartPage from './components/pages/CartPage.vue'
import AdPage from './components/pages/AdPage.vue'
import GitHubPage from './components/pages/GitHubPage.vue'
import AccountPage from './components/pages/AccountPage.vue'
const authStorageKey = 'coffee-cart-auth'
const authOrigin = 'http://localhost:4170'

const getQueryValue = (value: string | string[] | null | undefined) => {
  if (Array.isArray(value)) return value[0] || ''
  return typeof value === 'string' ? value : ''
}

const readAuth = () => {
  try {
    const raw = localStorage.getItem(authStorageKey)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const isLoggedIn = () => {
  const auth = readAuth()
  return Boolean(auth?.token)
}

const storeAuthFromQuery = (to: any) => {
  const token = getQueryValue(to.query.token)
  const auth = getQueryValue(to.query.auth)
  const user = getQueryValue(to.query.user)

  if (!user || (!token && !auth)) return false

  try {
    const parsedUser = JSON.parse(user)
    localStorage.setItem(
      authStorageKey,
      JSON.stringify({ token: token || auth, user: parsedUser })
    )
    return true
  } catch (e) {
    console.error('Failed to parse user data', e)
    return false
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: ListPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/cart',
      component: CartPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/ad',
      component: AdPage
    },
    {
      path: '/github',
      component: GitHubPage
    },
    {
      path: '/account',
      component: AccountPage,
      meta: { requiresAuth: true }
    },
  ]
})

router.beforeEach((to) => {
  const didStoreAuth = storeAuthFromQuery(to)

  if (didStoreAuth) {
    const cleanedQuery = { ...to.query } as Record<string, any>
    delete cleanedQuery.token
    delete cleanedQuery.auth
    delete cleanedQuery.user
    return { path: to.path, query: cleanedQuery, hash: to.hash }
  }

  if (to.meta.requiresAuth && !isLoggedIn()) {
    const returnTo = `${window.location.origin}${to.fullPath}`
    const loginUrl = new URL('/login', authOrigin)
    loginUrl.searchParams.set('returnTo', returnTo)
    window.location.assign(loginUrl.toString())
    return false
  }

  return true
})

export default router
