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
      caption: 'Lexi: Your intelligent assistant, always ready to help.',
      image: 'chatbot.jpg',
      link: '/'
    },
    {
      name: 'My Courses',
      caption: 'Your Path to Knowledge Starts Here.',
      image: 'about.jpg',
      link: '/progress-tracker'
    },
    {
      name: 'Transcript',
      caption: 'A Snapshot of Your Achievements.',
      image: 't.jpg',
      link: '/learning-resources'
    },
    {
      name: 'Interactive Roadmap',
      caption: 'Track Your Progress and Stay on Course with Our Interactive Roadmap.',
      image: 'v.jpg',
      link: '/learning-resources'
    },
    {
      name: 'Search For Internships',
      caption: 'Explore Opportunities, Gain Experience, and Build Your Future.',
      image: 'i.webp',
      link: '/learning-resources'
    },
    {
      name: 'Stress Managment',
      caption: 'Your Guide to Finding Calm in the Chaos.',
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
