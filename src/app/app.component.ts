import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLandingPage: boolean = false;
  isLoginPage: boolean = false;
  isRegisterPage: boolean = false;
  isForgetPage: boolean = false;
  isResetPage: boolean = false;
  isRegisterStudentPage: boolean = false;
  isRegisterAdminPage: boolean = false;

  constructor(private router: Router) {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isLandingPage = event.urlAfterRedirects === '/';
      this.isLoginPage = event.urlAfterRedirects === '/login'; 
      this.isRegisterPage = event.urlAfterRedirects ==='/register'
      this.isForgetPage = event.urlAfterRedirects ==='/forget'
      this.isResetPage = event.urlAfterRedirects ==='/reset'
      this.isRegisterStudentPage = event.urlAfterRedirects ==='/registerStudent'
      this.isRegisterAdminPage = event.urlAfterRedirects ==='/registerAdmin'

    });
  }
}
