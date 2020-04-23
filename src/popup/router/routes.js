import PageIndex from './pages/Index'
import WorkQ from './pages/WorkQ'
import Trash from './pages/Trash'
export default [
  {
    path: '/',
    component: PageIndex
  },
  {
    path: '/workq',
    component: WorkQ
  },
  {
    path: '/trash',
    component: Trash
  }
]
