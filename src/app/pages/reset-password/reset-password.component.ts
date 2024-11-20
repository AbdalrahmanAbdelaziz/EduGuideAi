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
  email = '';

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.queryParams['token'];
    this.email = this.activatedRoute.snapshot.queryParams['email'] || '';
  
    this.resetPasswordForm = this.formBuilder.group({
      email: [{ value: this.email, disabled: true }], 
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

    if (this.resetPasswordForm.invalid) return;

    const newPassword = this.fc['newPassword'].value;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        this.toastr.success('Password has been reset successfully');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toastr.error('Error resetting password');
        console.error(err);
      }
    });
  }
}
