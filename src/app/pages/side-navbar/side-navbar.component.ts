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
    // Restore sidebar state
    const savedState = localStorage.getItem('sidebarCollapsed');
    this.isCollapsed = savedState ? JSON.parse(savedState) : true;

    // Restore theme mode
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // ✅ Ensure icons get the correct color on page load
    this.updateIconColors();

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
  
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // ✅ Ensure icons update immediately
    this.updateIconColors();
  }

  // ✅ Function to update icon colors based on theme
  private updateIconColors(): void {
    setTimeout(() => {
      document.querySelectorAll('.side-navbar-link i').forEach(icon => {
        (icon as HTMLElement).style.color = this.isDarkMode ? 'black' : 'white';
      });
    }, 100);
  }
}
