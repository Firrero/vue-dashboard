import DashView from './components/Dash.vue'
import LoginView from './components/Login.vue'
import SignUpView from './components/SignUp.vue'
import NotFoundView from './components/404.vue'

// Import Views - Dash
import DashboardView from './components/views/Dashboard.vue'
import SettingView from './components/views/Setting.vue'
import TimesheetView from './components/views/Timesheet.vue'

// Routes
const routes = [
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/sign-up',
    component: SignUpView
  },
  {
    path: '/',
    meta: { requiresAuth: true },
    component: DashView,
    children: [
      {
        path: 'dashboard',
        alias: '',
        component: DashboardView,
        name: 'Dashboard',
        meta: {description: 'Overview of environment'}
      },{
		    path: 'timesheet',
		    component: TimesheetView,
		    name: 'Timesheet',
		    meta: {description: 'Add your time to this timesheet'}
	    },{
        path: 'setting',
        component: SettingView,
        name: 'Settings',
        meta: {description: 'User settings page'}
      }
    ]
  }, {
    // not found handler
    path: '*',
    component: NotFoundView
  }
]

export default routes
