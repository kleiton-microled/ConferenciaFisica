import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { JoyrideModule } from 'ngx-joyride';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { FakeBackendProvider } from './core/helpers/fake-backend';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';
import { LayoutModule } from './layout/layout.module';
import { NgbDatepickerPtDirective } from './shared/directives/ngb-datepicker-pt.directive';
import { NgbDateParserFormatter, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { CustomDatepickerI18n, I18n } from './shared/directives/ngb-datepicker-i18n';
import { CustomDatepickerFormatter } from './shared/directives/custom-datepicker-formatter';
import { ConfigService } from './shared/services/config.service';

export function initializeApp(configService: ConfigService) {
    return () => configService.loadConfig();
}

@NgModule({
    declarations: [
        AppComponent,
        NgbDatepickerPtDirective

    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        JoyrideModule.forRoot(),
        SweetAlert2Module.forRoot(),
        AppRoutingModule,
        LayoutModule],
    providers: [
        ConfigService,
        Title,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [ConfigService],
            multi: true
        },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        // { provide: 'BASE_API_URL', useValue: 'https://api.conferencia-fisica.com.br/api/Service' },
        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }, I18n,
        { provide: NgbDateParserFormatter, useClass: CustomDatepickerFormatter },
        // provider used to create fake backend
        //FakeBackendProvider,
        provideHttpClient(withInterceptorsFromDi()),
    ]
})
export class AppModule { }
