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

  onSubmit(form: NgForm) {
    if (form.valid) {
        const { firstName, lastName, email, password, confirmPassword } = form.value;

        if (password === confirmPassword) {
            const student: Student = { firstName, lastName, email, password };
            this.authService.register(student).subscribe({
                next: () => {
                    alert('Registration successful');
                },
                error: (err) => {
                    console.error(err);
                    alert('An error occurred during registration');
                }
            });
        } else {
            alert('Passwords do not match');
        }
    } else {
        alert('Please fill in all required fields');
    }
}

}
