import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit{

  resetPasswordForm!: FormGroup;
  isSubmitted = false;
  token = '';

  constructor(private authService: AuthService, private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute, private router: Router,
              private toastr: ToastrService){}

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.queryParams['token'];
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup): null | {notMatching: true} {
    return formGroup.get('newPassword')?.value === formGroup.get('confirmPassword')?.value
    ? null
    : {notMatching : true};
  }

  get fc(){
    return this.resetPasswordForm.controls;
  }

  submit(): void {
    this.isSubmitted = true;

    if(this.resetPasswordForm.invalid)
      return;

    this.authService.resetPassword(this.token, this.fc['newPassword'].value)
    .subscribe({
      next: () => {
        this.toastr.success('Password reset successful');
        this.router.navigate(['/login']);
      },

      error: () => {
        this.toastr.error('Password reset failed', 'Error');
      }
    });
  }

}
