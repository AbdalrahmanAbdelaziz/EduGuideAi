import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandComponent } from './pages/land/land.component';
import { InfoComponent } from './pages/info/info.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FooterComponent } from './pages/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { RegisterStudentComponent } from './pages/register-student/register-student.component';
import { RegisterAdminComponent } from './pages/register-admin/register-admin.component';
import { StudentPageComponent } from './pages/student-page/student-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LandComponent,
    InfoComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    RegisterStudentComponent,
    RegisterAdminComponent,
    StudentPageComponent,
    AdminPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right', // Position set to bottom-right
      newestOnTop: false,
      preventDuplicates: true,  // Prevents duplicate toastrs from showing
      closeButton: true,  // Adds a close button
      progressBar: true,  // Shows a progress bar
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
