import PageIndex from './pages/Index'
import WorkQ from './pages/WorkQ'
import Tutorial from './pages/Tutorial'
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
    path: '/tutorial',
    component: Tutorial
  },
  {
    path: '/trash',
    component: Trash
  }
]
