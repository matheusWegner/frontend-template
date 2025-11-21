import { Routes } from '@angular/router';
import { authGuard } from '@core/auth/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
	{
		path: '',
		component: MainLayoutComponent,
		canActivate: [authGuard],
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'dashboard' },
			{
				path: 'dashboard',
				loadComponent: () => import('./features/dashboard/dashboard.page').then((m) => m.DashboardPage)
			}
		]
	},
	{
		path: 'auth',
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'login' },
			{
				path: 'login',
				loadComponent: () => import('./features/auth/login-page/login.page').then((m) => m.LoginPage)
			}
		]
	},
	{ path: '**', redirectTo: '' }
];
