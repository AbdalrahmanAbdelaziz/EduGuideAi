import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Student } from '../../shared/interfaces/Student';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Course } from '../../shared/interfaces/Course';
import { UpdateCourse } from '../../shared/interfaces/UpdateCourse';

@Component({
  selector: 'app-my-faculty',
  templateUrl: './my-faculty.component.html',
  styleUrl: './my-faculty.component.css'
})
export class MyFacultyComponent implements OnInit{

  student!: Student;
  allCourses: Course[] = [];
  coreCourses: Course[] = [];
  electiveCourses: Course[] = [];

  @Output() calculatedHoursEvent = new EventEmitter<number>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    
    this.authService.studentObservable.subscribe((newStudent) => {
      if (newStudent) {
        this.student = newStudent;
      }
    });

    this.authService.fetchCourses().subscribe((courses: Course[]) => {
      this.coreCourses = courses.filter(course => course.type === 'f_core');
      this.electiveCourses = courses.filter(course => course.type === 'f_elective');
    });
  }

  canTakeCourse(course: Course): boolean {
    if (!course.preRequest) return true;
    const preRequestCourse = this.allCourses.find((c) => c.code === course.preRequest);
    return preRequestCourse?.grade !== 'none' && preRequestCourse?.grade !== 'F';
  }

  calculateTotalHours(): number {
    return this.allCourses
      .filter((course) => course.grade !== 'none')
      .reduce((total, course) => total + course.hours, 0);
  }

  submitCourses(): void {
    const updatedCourses: UpdateCourse[] = this.allCourses.map((course) => ({
      code: course.code,
      grade: course.grade || 'none',
    }));

    this.authService.updateGeneralCourses(updatedCourses).subscribe(() => {
      const calculatedHours = this.calculateTotalHours();
      this.calculatedHoursEvent.emit(calculatedHours); 
    });
  }
}

