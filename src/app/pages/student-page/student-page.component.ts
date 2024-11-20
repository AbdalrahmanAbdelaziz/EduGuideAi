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
      name: 'Ai tutor',
      caption: 'Get personalized tutoring sessions powered by AI.',
      image: 'chatbot.jpg',
      link: '/'
    },
    {
      name: 'Progress Tracker',
      caption: 'Track your learning journey with detailed analytics.',
      image: 'about.jpg',
      link: '/progress-tracker'
    },
    {
      name: 'Learning Resources',
      caption: 'Access a library of curated educational resources.',
      image: 't.jpg',
      link: '/learning-resources'
    },
    {
      name: 'Learning Resources',
      caption: 'Access a library of curated educational resources.',
      image: 'v.jpg',
      link: '/learning-resources'
    },
    {
      name: 'Learning Resources',
      caption: 'Access a library of curated educational resources.',
      image: 's.jpg',
      link: '/learning-resources'
    },
    {
      name: 'Learning Resources',
      caption: 'Access a library of curated educational resources.',
      image: 'i.webp',
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
