import PageIndex from './pages/Index'
import Login from './pages/Login'
import NewIndex from './pages/New-Index'

export default [
  {
    path: '/',
    component: PageIndex
  },
  {
    path: '/new-index',
    component: NewIndex
  },
  {
    path: '/login',
    component: Login
  }
]
