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
}
