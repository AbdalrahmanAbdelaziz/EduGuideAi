import { Component, OnInit } from '@angular/core';
import { Student } from '../../shared/interfaces/Student';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  student!: Student;
  newPassword!: string;
  confirmPassword!: string;
  profilePicFile!: File;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService
  ) {
    this.authService.studentObservable.subscribe((newStudent) => {
      if (newStudent) {
        this.student = newStudent;
        console.log('Student data loaded:', this.student); // Debug log
      }
    });
  }

  ngOnInit(): void {}

  onProfilePicChange(event: any) {
    try {
      const file = event.target.files[0];
      if (file) {
        this.profilePicFile = file;

        const reader = new FileReader();
        reader.onload = () => {
          this.student.profilePic = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
      }
    } catch (error) {
      this.toastrService.error('Failed to load profile picture', 'Error');
    }
  }

  updateProfile() {
    try {
      if (this.newPassword !== this.confirmPassword) {
        console.error('Password mismatch:', {
          newPassword: this.newPassword,
          confirmPassword: this.confirmPassword
        }); // Error log
        this.toastrService.error('Passwords do not match', 'Error');
        return;
      }

      const updateStudent: Student = {
        ...this.student,
        password: this.newPassword
      };

      this.authService.updateProfile(updateStudent, this.profilePicFile).subscribe(
        (response) => {
          this.toastrService.success('Profile updated successfully', 'Success');
        },
        (error) => {
          this.toastrService.error('Failed to update profile', 'Error');
        }
      );
    } catch (error) {
      this.toastrService.error('Unexpected error occurred', 'Error');
    }
  }
}
