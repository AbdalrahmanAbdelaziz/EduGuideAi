import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { Student } from '../../shared/interfaces/Student';

@Component({
  selector: 'app-register-student',
  templateUrl: './register-student.component.html',
  styleUrl: './register-student.component.css'
})
export class RegisterStudentComponent implements OnInit{


  constructor(private authService: AuthService){}

  ngOnInit(): void {
      
  }

  onSubmit(form: NgForm){
    if(form.valid){
      const { firstName, lastName, email, password, confirmPassword } = form.value;

      if(password === confirmPassword){
        const student: Student = { firstName, lastName, email, password};
        this.authService.register(student).subscribe();
      }
      else{
        alert('Passwords do not match')
      }
    }
  }
}
