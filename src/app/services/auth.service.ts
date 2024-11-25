import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, map, Observable, tap } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import {
    ADMIN_REGISTER_URL,
    FORGET_PASSWORD_URL,
    GET_AI_CORE_COURSE_URL,
    GET_AI_ELECTIVE_COURSE_URL,
    GET_CS_CORE_COURSE_URL,
    GET_CS_ELECTIVE_COURSE_URL,
    GET_F_CORE_COURSE_URL,
    GET_F_ELECTIVE_COURSE_URL,
    GET_G_CORE_COURSE_URL,
    GET_G_ELECTIVE_COURSE_URL,
    GET_IS_CORE_COURSE_URL,
    GET_IS_ELECTIVE_COURSE_URL,
    GET_IT_CORE_COURSE_URL,
    GET_IT_ELECTIVE_COURSE_URL,
    LOGIN_URL,
    RESET_PASSWORD_URL,
    STUDENT_REGISTER_URL,
    UPDATE_DEPARTMENT_COURSES_URL,
    UPDATE_FACULTY_COURSES_URL,
    UPDATE_GENERAL_COURSES_URL
} from "../shared/constants/urls";

import { UserLogin } from "../shared/interfaces/UserLogin";
import { Student } from "../shared/interfaces/Student";
import { Admin } from "../shared/interfaces/Admin";
import { Course } from "../shared/interfaces/Course";
import { UpdateCourse } from "../shared/interfaces/UpdateCourse";
import { ResetPassword } from "../shared/interfaces/ResetPassword";

const STUDENT_KEY = 'Student';
const ADMIN_KEY = 'Admin';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private studentSubject = new BehaviorSubject<Student | null>(this.getStudentFromLocalStorage());
    private adminSubject = new BehaviorSubject<Admin | null>(this.getAdminFromLocalStorage());
    private coursesSubject = new BehaviorSubject<Course[]>([]);

    public studentObservable = this.studentSubject.asObservable();
    public adminObservable = this.adminSubject.asObservable();
    public coursesObservable = this.coursesSubject.asObservable();

    constructor(private http: HttpClient, private toastrService: ToastrService) {}

    login(userLogin: UserLogin): Observable<any> {
        return this.http.post<any>(LOGIN_URL, userLogin).pipe(
            tap({
                next: (response) => {
                    if (response.data.role === 'Student') {
                        const student = response.data as Student;
                        this.setStudentToLocalStorage(student);
                        this.studentSubject.next(student);
                        this.toastrService.success(`Welcome ${student.firstName}!`);
                    } else if (response.data.role === 'Admin') {
                        const admin = response.data as Admin;
                        this.setAdminToLocalStorage(admin);
                        this.adminSubject.next(admin);
                        this.toastrService.success(`Welcome ${admin.firstName}!`);
                    }
                },
                error: () => {
                    this.toastrService.error('Login Failed');
                }
            })
        );
    }

    logout() {
        this.studentSubject.next(null);
        this.adminSubject.next(null);
        localStorage.removeItem(STUDENT_KEY);
        localStorage.removeItem(ADMIN_KEY);
    }

    registerStudent(studentRegister: Student): Observable<Student> {
        return this.http.post<Student>(STUDENT_REGISTER_URL, studentRegister).pipe(
            tap({
                next: (student) => {
                    this.setStudentToLocalStorage(student);
                    this.studentSubject.next(student);
                    this.toastrService.success('Registration Successful');
                },
                error: () => {
                    this.toastrService.error('Registration Failed');
                }
            })
        );
    }

    registerAdmin(adminRegister: Admin): Observable<Admin> {
        return this.http.post<Admin>(ADMIN_REGISTER_URL, adminRegister).pipe(
            tap({
                next: (admin) => {
                    this.setAdminToLocalStorage(admin);
                    this.adminSubject.next(admin);
                    this.toastrService.success('Registration Successful');
                },
                error: () => {
                    this.toastrService.error('Registration Failed');
                }
            })
        );
    }

    forgetPassword(email: string): Observable<any> {
        return this.http.post<any>(FORGET_PASSWORD_URL, { email }).pipe(
            tap({
                next: () => this.toastrService.success('Password reset link sent!'),
                error: () => this.toastrService.error('Failed to send reset link.')
            })
        );
    }

    resetPassword(payload: ResetPassword): Observable<void> {
        return this.http.post<void>(RESET_PASSWORD_URL, payload).pipe(
            tap({
                next: () => this.toastrService.success('Password reset successfully.'),
                error: () => this.toastrService.error('Failed to reset password.')
            })
        );
    }

    fetchCourses(url: string): Observable<Course[]> {
        return this.http.get<{ data: Course[] }>(url).pipe(
            map((response) => response.data),
            tap({
                next: (courses) => {
                    this.coursesSubject.next(courses);
                    // this.toastrService.success('Courses loaded successfully.');
                },
                error: () => {
                    // this.toastrService.error('Failed to load courses.');
                }
            })
        );
    }

    fetchGeneralCoreCourses(): Observable<Course[]> {
        return this.fetchCourses(GET_G_CORE_COURSE_URL);
    }

    fetchGeneralElectiveCourses(): Observable<Course[]> {
        return this.fetchCourses(GET_G_ELECTIVE_COURSE_URL);
    }

    fetchFacultyCoreCourses(): Observable<Course[]> {
        return this.fetchCourses(GET_F_CORE_COURSE_URL);
    }

    fetchFacultyElectiveCourses(): Observable<Course[]> {
        return this.fetchCourses(GET_F_ELECTIVE_COURSE_URL);
    }

  



    fetchCoreCourses(coreType: string): Observable<Course[]> {
        let url: string;
    
        switch (coreType) {
          case 'CS Core':
            url = GET_CS_CORE_COURSE_URL;
            break;
          case 'IS Core':
            url = GET_IS_CORE_COURSE_URL;
            break;
          case 'AI Core':
            url = GET_AI_CORE_COURSE_URL;
            break;
          case 'IT Core':
            url = GET_IT_CORE_COURSE_URL;
            break;
          default:
            throw new Error('Unknown core course type');
        }
    
        return this.http.get<{ data: Course[] }>(url).pipe(
          map((response) => response.data),
          tap({
            // next: (courses) => this.toastrService.success('Core courses loaded successfully.'),
            // error: () => this.toastrService.error('Failed to load core courses.'),
          })
        );
      }
    
      fetchElectiveCourses(electiveType: string): Observable<Course[]> {
        let url: string;
    
        switch (electiveType) {
          case 'CS Elective':
            url = GET_CS_ELECTIVE_COURSE_URL;
            break;
          case 'IS Elective':
            url = GET_IS_ELECTIVE_COURSE_URL;
            break;
          case 'AI Elective':
            url = GET_AI_ELECTIVE_COURSE_URL;
            break;
          case 'IT Elective':
            url = GET_IT_ELECTIVE_COURSE_URL;
            break;
          default:
            throw new Error('Unknown elective course type');
        }
    
        return this.http.get<{ data: Course[] }>(url).pipe(
          map((response) => response.data),
          tap({
            // next: (courses) => this.toastrService.success('Elective courses loaded successfully.'),
            // error: () => this.toastrService.error('Failed to load elective courses.'),
          })
        );
      }




    updateCourses(url: string, updatedCourses: UpdateCourse[]): Observable<any> {
        return this.http.put<any>(url, updatedCourses).pipe(
            tap({
                next: () => this.toastrService.success('Courses updated successfully.'),
                error: () => this.toastrService.error('Failed to update courses.')
            })
        );
    }

    updateGeneralCourses(updatedCourses: UpdateCourse[]): Observable<any> {
        return this.updateCourses(UPDATE_GENERAL_COURSES_URL, updatedCourses);
    }

    updateFacultyCourses(updatedCourses: UpdateCourse[]): Observable<any> {
        return this.updateCourses(UPDATE_FACULTY_COURSES_URL, updatedCourses);
    }

    updateDepartmentCourses(updatedCourses: UpdateCourse[]): Observable<any> {
        return this.updateCourses(UPDATE_DEPARTMENT_COURSES_URL, updatedCourses);
    }

    

    private setStudentToLocalStorage(student: Student) {
        localStorage.setItem(STUDENT_KEY, JSON.stringify(student));
    }

    private getStudentFromLocalStorage(): Student | null {
        const studentJson = localStorage.getItem(STUDENT_KEY);
        return studentJson ? JSON.parse(studentJson) : null;
    }

    private setAdminToLocalStorage(admin: Admin) {
        localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
    }

    private getAdminFromLocalStorage(): Admin | null {
        const adminJson = localStorage.getItem(ADMIN_KEY);
        return adminJson ? JSON.parse(adminJson) : null;
    }
}
