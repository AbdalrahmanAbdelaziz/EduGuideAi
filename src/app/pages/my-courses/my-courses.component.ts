import { Component, OnInit } from '@angular/core';
import { Student } from '../../shared/interfaces/Student';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.css'
})
export class MyCoursesComponent implements OnInit{
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

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
   
  }

}
