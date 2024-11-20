import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm!: FormGroup;
  isSubmitted = false;
  token = '';

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.queryParams['token'];
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup): null | { notMatching: true } {
    return formGroup.get('newPassword')?.value === formGroup.get('confirmPassword')?.value
      ? null
      : { notMatching: true };
  }

  get fc() {
    return this.resetPasswordForm.controls;
  }

  submit(): void {
    this.isSubmitted = true;

    if (this.resetPasswordForm.invalid)
      return;

    const email = this.fc['email'].value;
    const newPassword = this.fc['newPassword'].value;

    this.authService.resetPasswordWithEmail(this.token, email, newPassword).subscribe({
      next: () => {
        this.toastr.success('Password reset successfully.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toastr.error('Error resetting password: ' + err.message);
      }
    });
  }
}
