import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Course } from '../../shared/interfaces/Course';
import { Student } from '../../shared/interfaces/Student';
import { UpdateCourse } from '../../shared/interfaces/UpdateCourse';

@Component({
  selector: 'app-my-general',
  templateUrl: './my-general.component.html',
  styleUrls: ['./my-general.component.css']
})
export class MyGeneralComponent implements OnInit {
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

    this.authService.fetchGeneralCoreCourses().subscribe((courses: Course[]) => {
      this.coreCourses = courses.filter(course => course.type === 'g_core');
    });

    this.authService.fetchGeneralElectiveCourses().subscribe((courses: Course[]) => {
      this.electiveCourses = courses.filter(course => course.type === 'g_elective');
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
      .reduce((total, course) => total + (parseFloat(course.hours) || 0), 0); // Convert hours to a number
  }

  submitCourses(): void {
    const updatedCourses: UpdateCourse[] = this.allCourses.map((course) => ({
      code: course.code,
      grade: course.grade || 'none',
    }));

    // Remove the studentId from the payload if it's not expected
    this.authService.updateGeneralCourses(updatedCourses).subscribe(() => {
      const calculatedHours = this.calculateTotalHours();
      this.calculatedHoursEvent.emit(calculatedHours); // Emit the total hours
    });
  }
}
