import { createBrowserRouter } from 'react-router'
import App from './app/App'
import { AdminDashboard } from './app/components/admin/AdminDashboard'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/thiep-moi/:hash',
        element: <App />,
    },
    {
        path: '/thiep-cuoi',
        element: <AdminDashboard />,
    },
])
