import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { ADMIN_REGISTER_URL, FORGET_PASSWORD_URL, LOGIN_URL, RESET_PASSWORD_URL, STUDENT_REGISTER_URL } from "../shared/constants/urls";

import { UserLogin } from "../shared/interfaces/UserLogin";
import { Student } from "../shared/interfaces/Student";
import { Admin } from "../shared/interfaces/Admin";

const STUDENT_KEY = 'Student';
const ADMIN_KEY = 'Admin';  

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private studentSubject = new BehaviorSubject<Student | null>(this.getStudentFromLocalStorage());
    private adminSubject = new BehaviorSubject<Admin | null>(this.getAdminFromLocalStorage());

    public userObservable: Observable<Student | null>;
    public adminObservable: Observable<Admin | null>;

    constructor(private http: HttpClient, private toastrService: ToastrService) {
        this.userObservable = this.studentSubject.asObservable();
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
                        this.toastrService.success(`Welcome ${student.firstName}!`, 'Login Successful');
                    } else if(response.role === 'Admin') {
                        const admin = response as Admin;
                        this.setAdminToLocalStorage(admin);
                        this.adminSubject.next(admin);
                        this.toastrService.success(`Welcome ${admin.firstName}!`, 'Login Successful');
                    }
                },
                error: (errorResponse) => {
                    this.toastrService.error(errorResponse.error, 'Login Failed');
                }
            })
        );
    }

    logout() {
        this.studentSubject.next(null);
        this.adminSubject.next(null);
        localStorage.removeItem(STUDENT_KEY);
        localStorage.removeItem(ADMIN_KEY);
        window.location.reload();
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
    return this.http.post<any>(FORGET_PASSWORD_URL, {email}).pipe(
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


   resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(RESET_PASSWORD_URL, {token, newPassword}).pipe(
        tap({
            next: () => {
                this.toastrService.success('Password has been reset successfully.');
            },

            error: () => {
                this.toastrService.error('Password reset failed. Please try again.');
            }
        })
    );
   }


   register(studentRegister: Student): Observable<Student> {
    return this.http.post<Student>(STUDENT_REGISTER_URL, studentRegister).pipe(
        tap({
            next: (student) => {
                this.setStudentToLocalStorage(student);
                this.studentSubject.next(student);
                this.toastrService.success(`Welcome ${student.firstName}!`, 'Registration Successful');
            },
            error: (errorResponse) => {
                this.toastrService.error(errorResponse.error, 'Registration Failed');
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
          this.toastrService.success(`Welcome ${admin.firstName}!`, 'Registration Successful');
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Registration Failed');
        }
      })
    );
  }

}
