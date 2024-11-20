import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Student } from '../../shared/interfaces/Student';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-page',
  templateUrl: './student-page.component.html',
  styleUrl: './student-page.component.css'
})
export class StudentPageComponent implements OnInit{

  student!: Student;
  features = [
    {
      name: 'Ai tutor',
      caption: 'Get personalized tutoring sessions powered by AI.',
      image: 'aa.webp',
      link: '/'
    },

    {
      name: 'Progress Tracker',
      caption: 'Track your learning journey with detailed analytics.',
      image: '2.jpg',
      link: '/progress-tracke',
    },


    {
      name: 'Learning Resources',
      caption: 'Access a library of curated educational resources.',
      image: 'aa.webp',
      link: '/learning-resources',
    },

    {
      name: 'Learning Resources',
      caption: 'Access a library of curated educational resources.',
      image: 'aa.webp',
      link: '/learning-resources',
    },

  ];
  

  constructor(private authService: AuthService, private router: Router) {

    this.authService.studentObservable.subscribe((newStudent) => {
      if (newStudent) { 
        this.student = newStudent; 
      } 
    });
  }

  ngOnInit(): void {
  }

  navigateTo(link: string){
    this.router.navigate([link]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
   
  }



}
