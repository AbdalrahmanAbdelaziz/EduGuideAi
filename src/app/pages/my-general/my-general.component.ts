import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Course } from '../../shared/interfaces/Course';
import { Student } from '../../shared/interfaces/Student';
import { UpdateCourse } from '../../shared/interfaces/UpdateCourse';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-my-general',
  templateUrl: './my-general.component.html',
  styleUrls: ['./my-general.component.css'],
})
export class MyGeneralComponent implements OnInit {
  student!: Student | null;
  allCourses: Course[] = [];
  coreCourses: Course[] = [];
  electiveCourses: Course[] = [];
  selectedCourses: Course[] = [];

  @Output() calculatedHoursEvent = new EventEmitter<number>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.studentObservable.subscribe((student) => {
      this.student = student;
    });

    this.authService.fetchGeneralCoreCourses().subscribe((coreCourses) => {
      this.coreCourses = coreCourses;
    });

    this.authService.fetchGeneralElectiveCourses().subscribe((electiveCourses) => {
      this.electiveCourses = electiveCourses;
    });
  }

  canTakeCourse(course: Course): boolean {
    if (!course.prerequest) return true;
    const preRequestCourse = this.allCourses.find((c) => c.code === course.prerequest);
    return preRequestCourse?.grade !== 'none' && preRequestCourse?.grade !== 'F';
  }

  calculateTotalHours(): number {
    return this.selectedCourses.reduce((total, course) => total + +course.hours, 0);
  }

  submitCourses(): void {
    const updatedCourses: UpdateCourse[] = this.selectedCourses.map((course) => ({
      code: course.code,
      grade: course.grade || 'none',
    }));

    this.authService.updateGeneralCourses(updatedCourses).subscribe(() => {
      const totalHours = this.calculateTotalHours();
      this.calculatedHoursEvent.emit(totalHours);
    });
  }
}
