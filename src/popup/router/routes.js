import PageIndex from './pages/Index'
import Login from './pages/Login'
import NewIndex from './pages/New-Index'

export default [
  {
    path: '/',
    component: NewIndex
  },
  {
    path: '/new-index',
    component: PageIndex
  },
  {
    path: '/login',
    component: Login
  }
]
