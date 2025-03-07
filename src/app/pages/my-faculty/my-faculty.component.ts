import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Course } from '../../shared/interfaces/Course';
import { UpdateCourse } from '../../shared/interfaces/UpdateCourse';
import { Student } from '../../shared/interfaces/Student';
import { DarkModeService } from '../../services/dark-mode.service';

@Component({
  selector: 'app-my-faculty',
  templateUrl: './my-faculty.component.html',
  styleUrls: ['./my-faculty.component.css']
})
export class MyFacultyComponent implements OnInit {

  student!: Student;
  allCourses: Course[] = [];
  coreCourses: Course[] = [];
  electiveCourses: Course[] = [];
  facultyHours: number = 0;
  isDarkMode = false;


  @Output() calculatedHoursEvent = new EventEmitter<number>();

  constructor(private authService: AuthService, private darkModeService: DarkModeService) {}

  ngOnInit(): void {
    this.isDarkMode = this.darkModeService.isDarkMode(); // Check dark mode state

    this.authService.studentObservable.subscribe((newStudent) => {
      if (newStudent) {
        this.student = newStudent;
      }
    });

    this.authService.fetchFacultyCoreCourses().subscribe((coreCourses) => {
      this.coreCourses = coreCourses.map((course) => ({
        ...course,
        grade: course.grade || 'none'
      }));
    });

    this.authService.fetchFacultyElectiveCourses().subscribe((electiveCourses) => {
      this.electiveCourses = electiveCourses.map((course) => ({
        ...course,
        grade: course.grade || 'none'
      }));
    });
  }

  canTakeCourse(course: Course): boolean {
    if (!course.prerequest) return true;
    const preRequestCourse = this.allCourses.find((c) => c.code === course.prerequest);
    return preRequestCourse?.grade !== 'none' && preRequestCourse?.grade !== 'F';
  }

  calculateFacultyHours(): number {
    return [...this.coreCourses, ...this.electiveCourses]
      .filter((course) => course.grade !== 'none' && course.grade !== 'F')
      .reduce((total, course) => total + (parseFloat(course.hours) || 0), 0); 
  }

  submitCourses(): void {
    const updatedCourses: UpdateCourse[] = [...this.coreCourses, ...this.electiveCourses].map((course) => ({
      code: course.code,
      grade: course.grade || 'none',
      hours: parseFloat(course.hours),
    }));

    this.authService.updateCourses(updatedCourses).subscribe(() => {
      this.facultyHours = this.calculateFacultyHours();  
      this.calculatedHoursEvent.emit(this.facultyHours); 
    });
  }
}
