import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Student } from '../../shared/interfaces/Student';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-page',
  templateUrl: './student-page.component.html',
  styleUrls: ['./student-page.component.css']
})
export class StudentPageComponent implements OnInit {
  student!: Student;
  features = [
    {
      name: 'Talk To Lexi',
      caption: 'Lexi: Your intelligent assistant, always here to help.',
      image: 'chatbot.jpg',
      link: '/'
    },
    {
      name: 'My Courses',
      caption: 'Your path to knowledge begins right here with us.',
      image: 'about.jpg',
      link: '/progress-tracker'
    },
    {
      name: 'Transcript',
      caption: 'A snapshot of your progress and great achievements.',
      image: 't.jpg',
      link: '/learning-resources'
    },
    {
      name: 'Interactive Roadmap',
      caption: 'Monitor your progress and stay on track effortlessly.',
      image: 'v.jpg',
      link: '/learning-resources'
    },
    {
      name: 'Search For Internships',
      caption: 'Explore new opportunities, gain experience, and build.',
      image: 'i.webp',
      link: '/learning-resources'
    },
    {
      name: 'Stress Managment',
      caption: 'Your guide to finding peace amidst the chaos.',
      image: 'st.jpg',
      link: '/learning-resources'
    },

  ];

  constructor(private authService: AuthService, private router: Router) {
    this.authService.studentObservable.subscribe((newStudent) => {
      if (newStudent) {
        this.student = newStudent;
      }
    });
  }

  ngOnInit(): void {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(link: string) {
    this.router.navigate([link]);
  }
}
