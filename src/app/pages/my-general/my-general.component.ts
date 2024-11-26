import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Course } from '../../shared/interfaces/Course';
import { Student } from '../../shared/interfaces/Student';
import { UpdateCourse } from '../../shared/interfaces/UpdateCourse';
import { trigger, transition, style, animate } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-general',
  templateUrl: './my-general.component.html',
  styleUrls: ['./my-general.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(30px)', opacity: 0 }),
        animate('0.5s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class MyGeneralComponent implements OnInit {
  student!: Student | null;
  coreCourses: Course[] = [];
  electiveCourses: Course[] = [];
  totalHours: number = 0;

  @Output() calculatedHoursEvent = new EventEmitter<number>();

  constructor(private authService: AuthService, private toastrService: ToastrService) {}

  ngOnInit(): void {
    // Fetch student data
    this.authService.studentObservable.subscribe((student) => {
      this.student = student;
    });

    // Fetch general core courses
    this.authService.fetchGeneralCoreCourses().subscribe({
      next: (coreCourses) => {
        if (Array.isArray(coreCourses)) {
          this.coreCourses = coreCourses.map((course) => ({
            ...course,
            grade: course.grade || 'none'
          }));
        }
      },
      error: (err) => {
        console.error('Error fetching core courses:', err);
        this.toastrService.error('Failed to load core courses.');
      }
    });


    this.authService.fetchGeneralElectiveCourses().subscribe({
      next: (electiveCourses) => {
        if (Array.isArray(electiveCourses)) {
          this.electiveCourses = electiveCourses.map((course) => ({
            ...course,
            grade: course.grade || 'none'
          }));
        }
      },
      error: (err) => {
        console.error('Error fetching core courses:', err);
        this.toastrService.error('Failed to load core courses.');
      }
    });


    

    // Fetch general elective courses
    // this.authService.fetchGeneralElectiveCourses().subscribe((electiveCourses) => {
    //   this.electiveCourses = electiveCourses.map((course) => ({
    //     ...course,
    //     grade: course.grade || 'none'
    //   }));
    // });
  }

  canTakeCourse(course: Course): boolean {
    if (!course.prerequest) return true;
    const preRequestCourse = [...this.coreCourses, ...this.electiveCourses].find((c) => c.code === course.prerequest);
    return preRequestCourse?.grade !== 'none' && preRequestCourse?.grade !== 'F';
  }

  calculateTotalHours(): number {
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
      this.totalHours = this.calculateTotalHours();
      this.calculatedHoursEvent.emit(this.totalHours);
    });
  }
}
