import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordForm!: FormGroup;
  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.forgetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get fc() {
    return this.forgetPasswordForm.controls;
  }

  submit(): void {
    this.isSubmitted = true;

    if (this.forgetPasswordForm.invalid) {
      this.toastr.error('Please provide a valid email.');
      return;
    }

    const email = this.fc['email'].value;
    this.authService.forgetPassword(email).subscribe({
      next: () => {
        this.toastr.success('Reset link sent to your email.');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.toastr.error('Failed to send reset link. Try again.');
      }
    });
  }
}
