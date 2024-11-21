import { Component, OnInit } from '@angular/core';
import { Student } from '../../shared/interfaces/Student';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.css'
})
export class MyCoursesComponent implements OnInit{
  student!: Student;


  constructor(){}

  ngOnInit(): void {
  }

}
