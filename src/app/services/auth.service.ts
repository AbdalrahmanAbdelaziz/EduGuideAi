import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { ADMIN_REGISTER_URL, FORGET_PASSWORD_URL, GET_AI_CORE_COURSE_URL, GET_AI_ELECTIVE_COURSE_URL, GET_CS_CORE_COURSE_URL, GET_CS_ELECTIVE_COURSE_URL, GET_F_CORE_COURSE_URL, GET_F_ELECTIVE_COURSE_URL, GET_G_CORE_COURSE_URL, GET_G_ELECTIVE_COURSE_URL, GET_IS_CORE_COURSE_URL, GET_IS_ELECTIVE_COURSE_URL, GET_IT_CORE_COURSE_URL, GET_IT_ELECTIVE_COURSE_URL, LOGIN_URL, RESET_PASSWORD_URL, STUDENT_REGISTER_URL, UPDATE_DEPARTMENT_COURSES_URL, UPDATE_FACULTY_COURSES_URL, UPDATE_GENERAL_COURSES_URL } from "../shared/constants/urls";

import { UserLogin } from "../shared/interfaces/UserLogin";
import { Student } from "../shared/interfaces/Student";
import { Admin } from "../shared/interfaces/Admin";
import { Course } from '../shared/interfaces/Course';
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
    

    public studentObservable: Observable<Student | null>;
    public adminObservable: Observable<Admin | null>;

    constructor(private http: HttpClient, private toastrService: ToastrService) {
        this.studentObservable = this.studentSubject.asObservable();
        this.adminObservable = this.adminSubject.asObservable();
    }

    login(userLogin: UserLogin): Observable<any> {
      console.log('Attempting login with data:', userLogin);
    
      return this.http.post<any>(LOGIN_URL, userLogin).pipe(
        tap({
          next: (response) => {
            console.log('Login successful:', response);
    
            if (response.data === 'Student') {
              const student = response as Student;
              console.log('Student login detected:', student);
              this.setStudentToLocalStorage(student);
              this.studentSubject.next(student);
              this.toastrService.success(`Welcome ${student.firstName}!`);
            } else if (response.data === 'Admin') {
              const admin = response as Admin;
              console.log('Admin login detected:', admin);
              this.setAdminToLocalStorage(admin);
              this.adminSubject.next(admin);
              this.toastrService.success(`Welcome ${admin.firstName}!`);
            } else {
              console.warn('Unknown user role:', response.role);
            }
          },
          error: (errorResponse) => {
            console.error('Login failed:', errorResponse);
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
        return this.http.post<any>(FORGET_PASSWORD_URL, { email }, { responseType: 'text' as 'json' }).pipe(
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
      
    
      resetPassword(payload: ResetPassword): Observable<void> {
        return this.http.post<void>(RESET_PASSWORD_URL, payload).pipe(
          tap({
            next: () => this.toastrService.success('Password has been reset successfully.'),
            error: (error) => {
              console.error('Reset password error:', error);
              this.toastrService.error('Failed to reset password. Please try again.');
            }
          })
        );
      }
      
    


      register(studentRegister: Student): Observable<Student> {
        console.log('Attempting registration for student:', studentRegister);
      
        return this.http.post<Student>(STUDENT_REGISTER_URL, studentRegister).pipe(
          tap({
            next: (student) => {
              console.log('Student registered successfully:', student);
              this.setStudentToLocalStorage(student);
              this.studentSubject.next(student);
              this.toastrService.success('Registration Successful');
            },
            error: (errorResponse) => {
              console.error('Registration failed:', errorResponse);
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


  fetchGeneralCoreCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(GET_G_CORE_COURSE_URL).pipe(
      tap({
        next: () => console.log('Courses fetched successfully'),
        error: () => this.toastrService.error('Failed to fetch courses'),
      })
    );
  }

  fetchGeneralElectiveCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(GET_G_ELECTIVE_COURSE_URL).pipe(
      tap({
        next: () => console.log('Courses fetched successfully'),
        error: () => this.toastrService.error('Failed to fetch courses'),
      })
    );
  }

  fetchFacultyCoreCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(GET_F_CORE_COURSE_URL).pipe(
      tap({
        next: () => console.log('Courses fetched successfully'),
        error: () => this.toastrService.error('Failed to fetch courses'),
      })
    );
  }

  fetchFacultyElectiveCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(GET_F_ELECTIVE_COURSE_URL).pipe(
      tap({
        next: () => console.log('Courses fetched successfully'),
        error: () => this.toastrService.error('Failed to fetch courses'),
      })
    );
  }




  private fetchCourses(url: string, courseType: string): Observable<Course[]> {
    return this.http.get<Course[]>(url).pipe(
      tap({
        next: () => console.log(`Fetched ${courseType} courses successfully.`),
        error: () => this.toastrService.error(`Failed to fetch ${courseType} courses`),
      })
    );
  }

  fetchCSCoreCourses(): Observable<Course[]> {
    return this.fetchCourses(GET_CS_CORE_COURSE_URL, 'CS Core');
  }

  fetchCSElectiveCourses(): Observable<Course[]> {
    return this.fetchCourses(GET_CS_ELECTIVE_COURSE_URL, 'CS Elective');
  }

  fetchISCoreCourses(): Observable<Course[]> {
    return this.fetchCourses(GET_IS_CORE_COURSE_URL, 'IS Core');
  }

  fetchISElectiveCourses(): Observable<Course[]> {
    return this.fetchCourses(GET_IS_ELECTIVE_COURSE_URL, 'IS Elective');
  }

  fetchITCoreCourses(): Observable<Course[]> {
    return this.fetchCourses(GET_IT_CORE_COURSE_URL, 'IT Core');
  }

  fetchITElectiveCourses(): Observable<Course[]> {
    return this.fetchCourses(GET_IT_ELECTIVE_COURSE_URL, 'IT Elective');
  }

  fetchAICoreCourses(): Observable<Course[]> {
    return this.fetchCourses(GET_AI_CORE_COURSE_URL, 'AI Core');
  }

  fetchAIElectiveCourses(): Observable<Course[]> {
    return this.fetchCourses(GET_AI_ELECTIVE_COURSE_URL, 'AI Elective');
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





  


