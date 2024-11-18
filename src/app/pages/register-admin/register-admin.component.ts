import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { Admin } from '../../shared/interfaces/Admin';

@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrl: './register-admin.component.css'
})
export class RegisterAdminComponent implements OnInit{

  constructor(private authService: AuthService){}

  ngOnInit(): void {
      
  }

  onSubmit(form: NgForm){
    if(form.valid){
      const { firstName, lastName, email, password, confirmPassword } = form.value;

      if(password === confirmPassword){
        const admin: Admin = { firstName, lastName, email, password};
        this.authService.registerAdmin(admin).subscribe();
      }
      else{
        alert('Passwords do not match');
      }

    }

    
  }

}
