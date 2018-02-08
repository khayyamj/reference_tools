import { BrowserModule } from '@angular/platform-browser';
import { SharedModule, RolesService, RoleModuleLoader, RoleGuard, ToolsInfoService } from './shared/';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MTCCoreModule, SimpleConfirmationComponent, MTCAuthInterceptor } from 'mtc-modules';
import { AppRouting } from './app.routes';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations/';
import { AssistanceModule } from './assistance/';
import { CoreModule } from './core/';
import { DeveloperModule } from './developer';
import { MissionaryModule } from './core-missionary';
import { DashboardModule } from './core-dashboard';
import { MissionsModule } from './core-missions';
import { GeneralServicesModule } from './general-services';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

const modules = [
	AssistanceModule,
	BrowserModule,
	SharedModule,
	HttpClientModule,
	HttpModule,
	MTCCoreModule.forRoot(),
	AppRouting,
	BrowserAnimationsModule,
	MissionaryModule,
	CoreModule,
	DeveloperModule,
	DashboardModule,
	GeneralServicesModule,
	MissionsModule
];
@NgModule({
	declarations: [
		AppComponent,
	],
	imports: modules,
	providers: [
		RoleGuard,
		RolesService,
		ToolsInfoService,
		RoleModuleLoader,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: MTCAuthInterceptor,
			multi: true,
		}
	],
	bootstrap: [AppComponent],
	entryComponents: [
		SimpleConfirmationComponent
	]
})
export class AppModule { }
