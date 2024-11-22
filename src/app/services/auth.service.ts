import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { ADMIN_REGISTER_URL, FORGET_PASSWORD_URL, GET_DEPARTMENT_COURSES_URL, GET_COURSE_URL, LOGIN_URL, RESET_PASSWORD_URL, STUDENT_REGISTER_URL, UPDATE_DEPARTMENT_COURSES_URL, UPDATE_FACULTY_COURSES_URL, UPDATE_GENERAL_COURSES_URL } from "../shared/constants/urls";

import { UserLogin } from "../shared/interfaces/UserLogin";
import { Student } from "../shared/interfaces/Student";
import { Admin } from "../shared/interfaces/Admin";
import { Course } from '../shared/interfaces/Course';
import { UpdateCourse } from "../shared/interfaces/UpdateCourse";



const STUDENT_KEY = 'Student';
const ADMIN_KEY = 'Admin';  

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private studentSubject = new BehaviorSubject<Student | null>(this.getStudentFromLocalStorage());
    private adminSubject = new BehaviorSubject<Admin | null>(this.getAdminFromLocalStorage());
    

    public studentObservable: Observable<Student | null>;
    public adminObservable: Observable<Admin | null>;

    constructor(private http: HttpClient, private toastrService: ToastrService) {
        this.studentObservable = this.studentSubject.asObservable();
        this.adminObservable = this.adminSubject.asObservable();
    }

    login(userLogin: UserLogin): Observable<any> {
        return this.http.post<any>(LOGIN_URL, userLogin).pipe(
            tap({
                next: (response) => {
                    if(response.role === 'Student') {
                        const student = response as Student;
                        this.setStudentToLocalStorage(student);
                        this.studentSubject.next(student);
                        this.toastrService.success(`Welcome ${student.firstName}!`);
                    } 
                    else if(response.role === 'Admin') {
                        const admin = response as Admin;
                        this.setAdminToLocalStorage(admin);
                        this.adminSubject.next(admin);
                        this.toastrService.success(`Welcome ${admin.firstName}!`);
                    }
                },
                error: (errorResponse) => {
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

    private setStudentToLocalStorage(student: Student) {
        localStorage.setItem(STUDENT_KEY, JSON.stringify(student));
    }

    private getStudentFromLocalStorage(): Student | null {
        const studentJson = localStorage.getItem(STUDENT_KEY);
        return studentJson ? JSON.parse(studentJson) as Student : null;
    }

    private setAdminToLocalStorage(admin: Admin) { 
        localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
    }

    private getAdminFromLocalStorage(): Admin | null {
        const adminJson = localStorage.getItem(ADMIN_KEY);
        return adminJson ? JSON.parse(adminJson) as Admin : null;
    }


    forgetPassword(email: string): Observable<any> {
        return this.http.post<any>(FORGET_PASSWORD_URL, { email }).pipe(
          tap({
            next: () => {
              this.toastrService.success('Password reset link has been sent to your email.');
            },
            error: () => {
              this.toastrService.error('Failed to send reset link. Check your email and try again.');
            }
          })
        );
      }
    
      resetPassword(email: string, newPassword: string, confirmPassword: string): Observable<any> {
        return this.http.post<any>(RESET_PASSWORD_URL, { email, password: newPassword, confirm: confirmPassword });
      }
    


   register(studentRegister: Student): Observable<Student> {
    return this.http.post<Student>(STUDENT_REGISTER_URL, studentRegister).pipe(
        tap({
            next: (student) => {
                this.setStudentToLocalStorage(student);
                this.studentSubject.next(student);
                this.toastrService.success('Registration Successful');
            },
            error: (errorResponse) => {
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
          this.toastrService.success( 'Registration Successful');
        },
        error: (errorResponse) => {
          this.toastrService.error('Registration Failed');
        }
      })
    );
  }


  fetchCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(GET_COURSE_URL).pipe(
      tap({
        next: () => console.log('Courses fetched successfully'),
        error: () => this.toastrService.error('Failed to fetch courses'),
      })
    );
  }


  fetchDepartmentCourses(department: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${GET_DEPARTMENT_COURSES_URL}/${department}`).pipe(
        tap({
            error: (error) => {
                this.toastrService.error(`Failed to fetch ${department} courses`);
            }
        })
    );
}



  

  updateGeneralCourses(updatedCourses: UpdateCourse[]): Observable<any> {
    return this.http.put<any>(UPDATE_GENERAL_COURSES_URL, updatedCourses).pipe(
        tap({
            next: () => {
                this.toastrService.success('Courses updated successfully');
            },
            error: (error) => {
                this.toastrService.error('Failed to update courses');
            }
        })
    );
}

updateFacultyCourses(updatedCourses: UpdateCourse[]): Observable<any> {
    return this.http.put<any>(UPDATE_FACULTY_COURSES_URL, updatedCourses).pipe(
        tap({
            next: () => {
                this.toastrService.success('Faculty Courses updated successfully');
            },
            error: (error) => {
                this.toastrService.error('Failed to update Faculty Courses');
            }
        })
    );
}

// Update department courses for the student
updateDepartmentCourses(updatedCourses: UpdateCourse[]): Observable<any> {
    return this.http.put<any>(UPDATE_DEPARTMENT_COURSES_URL, updatedCourses).pipe(
        tap({
            next: () => {
                this.toastrService.success('Department Courses updated successfully');
            },
            error: (error) => {
                this.toastrService.error('Failed to update Department Courses');
            }
        })
    );
}



  


  }





  


