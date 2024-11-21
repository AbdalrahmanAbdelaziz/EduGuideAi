import { Component, OnInit } from '@angular/core';
import { Student } from '../../shared/interfaces/Student';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.css']
})
export class MyCoursesComponent implements OnInit {
  student!: Student;
  generalHours: number = 0;
  facultyHours: number = 0;
  departmentHours: number = 0;

  features = [
    {
      name: 'General Requirements',
      caption: 'Lexi: Your intelligent assistant, always here to help.',
      link: '/my-general'
    },
    {
      name: 'Faculty Requirements',
      caption: 'Your path to knowledge begins right here with us.',
      link: '/my-faculty'
    },
    {
      name: 'Department Requirements',
      caption: 'A snapshot of your progress and great achievements.',
      link: '/my-department'
    }
  ];

  constructor(private authService: AuthService, private router: Router) {
    this.authService.studentObservable.subscribe((newStudent) => {
      if (newStudent) {
        this.student = newStudent;
      }
    });
  }

  ngOnInit(): void {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(link: string) {
    this.router.navigate([link]);
  }

  updateGeneralHours(hours: number) {
    this.generalHours = hours; 
  }

  updateFacultyHours(hours: number) {
    this.facultyHours = hours;
  }

  updateDepartmentHours(hours: number) {
    this.departmentHours = hours;
  }


  

  
}
