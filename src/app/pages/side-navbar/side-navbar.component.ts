import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Student } from '../../shared/interfaces/Student';
import { BASE_URL } from '../../shared/constants/urls';
import { DarkModeService } from '../../services/dark-mode.service';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css']
})
export class SideNavbarComponent implements OnInit {
  student!: Student;
  BASE_URL = BASE_URL;
  isCollapsed = true; 
  isDarkMode = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private darkModeService: DarkModeService
  ) {
    this.authService.studentObservable.subscribe((newStudent) => {
      if (newStudent) {
        this.student = newStudent;
      }
    });
  }

  ngOnInit(): void {
    const savedState = localStorage.getItem('sidebarCollapsed');
    this.isCollapsed = savedState ? JSON.parse(savedState) : true; // Default to true if no saved state

    this.isDarkMode = localStorage.getItem('theme') === 'dark';

    this.authService.studentObservable.subscribe((newUser) => {
      if (newUser) {
        this.student = newUser;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  
    const body = document.body;
    if (this.isDarkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  
    // Ensure icons update
    setTimeout(() => {
      document.querySelectorAll('.side-navbar-link i').forEach(icon => {
        (icon as HTMLElement).style.color = this.isDarkMode ? 'black' : 'white'; // ✅ Cast to HTMLElement
      });
    }, 100);
  }
}
