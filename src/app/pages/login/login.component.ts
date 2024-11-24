import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  isSubmitted = false; 
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
  }

  get fc() {
    return this.loginForm.controls;
  }

  submit(): void {
    this.isSubmitted = true;
  
    if (this.loginForm.invalid) {
      console.log('Login form is invalid:', this.loginForm);
      return;
    }
  
    console.log('Form Submitted:', this.loginForm.value);
  
    this.authService.login({
      email: this.fc['email'].value,
      password: this.fc['password'].value
    }).subscribe({
      next: (response) => {
        const userRole = response.data.role;
  
        if (userRole === 'Student') {
          console.log('Navigating to Student Page');
          this.router.navigateByUrl('/student-page');
        } else if (userRole === 'Admin') {
          console.log('Navigating to Admin Page');
          this.router.navigateByUrl('/admin-page');
        } else {
          console.log('Unexpected user role:', userRole);
        }
      },
      error: (error) => {
        console.error('Login error:', error);
      }
    });
  }
}
