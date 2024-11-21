import { Component, OnInit } from '@angular/core';
import { Student } from '../../shared/interfaces/Student';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-department',
  templateUrl: './my-department.component.html',
  styleUrl: './my-department.component.css'
})
export class MyDepartmentComponent implements OnInit{

  student!: Student;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.studentObservable.subscribe((newStudent) => {
      if (newStudent) {
        this.student = newStudent;
      }
    });
  }


  ngOnInit(): void {
      
  }
}
