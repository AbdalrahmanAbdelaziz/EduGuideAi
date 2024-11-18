import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent implements OnInit{

  forgetPasswordForm!: FormGroup;
  isSubmitted = false;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router){

  }

  ngOnInit(): void {
    this.forgetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get fc(){
    return this.forgetPasswordForm.controls;
  }

  submit(){
    this.isSubmitted = true;
    if(this.forgetPasswordForm.invalid)
      return;

    const email = this.fc['email'].value;
    this.authService.forgetPassword(email).subscribe(
      response => {
        this.router.navigateByUrl('/login')
      }
    );
  }

}
