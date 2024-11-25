import { Component, OnInit } from '@angular/core';
import { Student } from '../../shared/interfaces/Student';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-transcript',
  templateUrl: './transcript.component.html',
  styleUrl: './transcript.component.css'
})
export class TranscriptComponent implements OnInit{

  student!: Student | null;

  constructor(private authservice: AuthService){}

  ngOnInit(): void {
    this.authservice.studentObservable.subscribe((student) => {
      this.student = student;
    })
      
  }


  getCumulativeGrade(): string {
    const gpa = this.student?.gpa;
    if(gpa !== undefined) {
      if( gpa >= 3.4 ){
        return 'Excellent';
      }

      else if( gpa >= 2.8 ){
        return 'Very Good';
      }

      else if( gpa >= 2.4 ){
        return 'Good';
      }

      else if( gpa >= 2 ){
        return 'Acceptable';
      }

      else if( gpa >= 1.4 ){
        return 'Weak';
      }

      else if( gpa < 1.4 ){
        return 'Very Weak';
      }
    }
    return 'N/A';
  }


}
