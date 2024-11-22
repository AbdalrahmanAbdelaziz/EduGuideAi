import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

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
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] || '';

    this.resetPasswordForm = this.formBuilder.group(
      {
        newPassword: ['', Validators.required],
        confirmPassword: ['', [Validators.required]]
      },
      { validator: this.passwordMatchValidator }
    );
  }

  get fc() {
    return this.resetPasswordForm.controls;
  }

  passwordMatchValidator(formGroup: FormGroup): null | { notMatching: true } {
    return formGroup.get('newPassword')?.value === formGroup.get('confirmPassword')?.value
      ? null
      : { notMatching: true };
  }

  submit(): void {
    this.isSubmitted = true;
  
    if (this.resetPasswordForm.invalid) {
      this.toastr.error('Please fill in the form correctly.');
      return;
    }
  
    const payload = {
      token: this.token,
      newPassword: this.fc['newPassword'].value
    };
  
    this.authService.resetPassword(payload).subscribe({
      next: () => {
        this.toastr.success('Password reset successfully!');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.toastr.error('Password reset failed. Try again later.');
      }
    });
  }
  
}
