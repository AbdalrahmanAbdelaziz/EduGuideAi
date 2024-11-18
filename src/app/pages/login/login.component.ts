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

    if(this.loginForm.invalid) {
      return;
    }

    this.authService.login({
      email: this.fc['email'].value,
      password: this.fc['password'].value
    }).subscribe({
      next: (response) => {
        const userRole = response.role;
        if (userRole === 'student') {
          this.router.navigateByUrl('/student-page');
        } else if (userRole === 'admin') {
          this.router.navigateByUrl('/admin-page');
        } 
      },
      error: (error) => {
        console.error('Login error:', error);
      }
    });
  }
}
