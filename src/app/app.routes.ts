import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { authGuard } from './guards/auth-guard';
import { Register } from './pages/register/register';
import { Admin } from './pages/admin/admin';
import { Products } from './pages/admin/products/products';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },{
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component : Register
    },
    {
        path: 'home',
        component: Home,
        canActivate : [authGuard]
    },
    {
        path: 'admin',
        component: Admin,
        canActivate : [authGuard]   
    },
    {
        path: 'admin/products',
        component: Products,
        canActivate : [authGuard]   
    },

    
    
];
