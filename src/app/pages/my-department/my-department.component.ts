import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Student } from '../../shared/interfaces/Student';
import { Course } from '../../shared/interfaces/Course';
import { UpdateCourse } from '../../shared/interfaces/UpdateCourse';

@Component({
  selector: 'app-my-department',
  templateUrl: './my-department.component.html',
  styleUrls: ['./my-department.component.css']
})
export class MyDepartmentComponent implements OnInit {
  student!: Student;
  coreCourses: Course[] = [];
  electiveCourses: Course[] = [];
  selectedDepartment: string | null = null;
  departmentHours: number = 0;

  @Output() calculatedHoursEvent = new EventEmitter<number>();

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.studentObservable.subscribe((newStudent) => {
      if (newStudent) {
        this.student = newStudent;
      }
    });
  }

  // Department selection handler
  onDepartmentChange(event: any): void {
    this.selectedDepartment = event.target.value;
    this.fetchDepartmentCourses();
  }

  // Fetch department-specific courses based on selected department
  fetchDepartmentCourses(): void {
    if (!this.selectedDepartment) return;

    // Fetch courses for the selected department using the CourseService
    switch (this.selectedDepartment) {
      case 'CS':
        this.fetchCoursesByType('CS Core', 'CS Elective');
        break;
      case 'IS':
        this.fetchCoursesByType('IS Core', 'IS Elective');
        break;
      case 'AI':
        this.fetchCoursesByType('AI Core', 'AI Elective');
        break;
      case 'IT':
        this.fetchCoursesByType('IT Core', 'IT Elective');
        break;
      default:
        console.error('Invalid department selected');
        return;
    }
  }

  private fetchCoursesByType(coreType: string, electiveType: string): void {
    this.authService.fetchCSCoreCourses().subscribe({
      next: (coreCourses) => {
        this.coreCourses = coreCourses.filter((course) => course.type === coreType);
      },
      error: () => {
        console.error(`Failed to fetch ${coreType} courses`);
      },
    });

    this.authService.fetchCSElectiveCourses().subscribe({
      next: (electiveCourses) => {
        this.electiveCourses = electiveCourses.filter((course) => course.type === electiveType);
      },
      error: () => {
        console.error(`Failed to fetch ${electiveType} courses`);
      },
    });
  }

  // Check if the student can take the course based on prerequisites
  canTakeCourse(course: Course): boolean {
    if (!course.preRequest) return true;
    const preRequestCourse = this.coreCourses.concat(this.electiveCourses).find((c) => c.code === course.preRequest);
    return preRequestCourse?.grade !== 'none' && preRequestCourse?.grade !== 'F';
  }

  // Calculate total hours for the selected department courses
  calculateDepartmentHours(): number {
    return [...this.coreCourses, ...this.electiveCourses]
      .filter((course) => course.grade !== 'none')
      .reduce((total, course) => total + course.hours, 0);
  }

  // Submit selected courses and grades
  submitCourses(): void {
    const updatedCourses: UpdateCourse[] = [...this.coreCourses, ...this.electiveCourses].map((course) => ({
      code: course.code,
      grade: course.grade || 'none',
    }));

    this.authService.updateGeneralCourses(updatedCourses).subscribe(() => {
      const departmentHours = this.calculateDepartmentHours();
      this.calculatedHoursEvent.emit(departmentHours); // Emit the total hours
    });
  }
}
