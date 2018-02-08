import { Routes, RouterModule } from '@angular/router';
import { RoleModuleLoader, RoleGuard } from './shared/';
import { LogListComponent } from './developer';

const routes: Routes = [
	{ path: 'travel', loadChildren: './travel/travel.module#TravelModule' },
	{ path: 'scheduling', loadChildren: './scheduling/scheduling.module#SchedulingModule'},
	{ path: 'general-services', loadChildren: './general-services/general-services.module#GeneralServicesModule' },
	{ path: 'assistance', loadChildren: './assistance/assistance.module#AssistanceModule'},
	{ path: 'logs', component: LogListComponent, canActivate: [RoleGuard], data: { roles: ['developer'] } },
	{ path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
];

export const AppRouting = RouterModule.forRoot(routes, {useHash: true, preloadingStrategy: RoleModuleLoader } );
