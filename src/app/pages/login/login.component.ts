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
    private toastr: ToastrService  // Add toastr service here
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
      return;
    }

    this.authService.login({
      email: this.fc['email'].value,
      password: this.fc['password'].value
    }).subscribe({
      next: (response) => {
        const userRole = response.role;
        if (userRole === 'Student') {
          this.router.navigateByUrl('/student-page');
          this.toastr.success('Login successful!', 'Welcome Back!', {
            timeOut: 3000,  // To show it for 3 seconds
          });
        } else if (userRole === 'Admin') {
          this.router.navigateByUrl('/admin-page');
          this.toastr.success('Login successful!', 'Welcome Admin!', {
            timeOut: 3000,
          });
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.toastr.error('Login failed. Please check your credentials.', 'Error', {
          timeOut: 3000,
        });
      }
    });
  }
}
