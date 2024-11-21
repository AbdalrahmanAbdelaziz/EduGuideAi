import { Component, OnInit } from '@angular/core';
import { Student } from '../../shared/interfaces/Student';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-general',
  templateUrl: './my-general.component.html',
  styleUrls: ['./my-general.component.css']
})
export class MyGeneralComponent implements OnInit{

  student!: Student;
  grades: string[] = ['None','A', 'A+', 'B', 'B+', 'C', 'C+', 'D', 'D+', 'F'];

  coursesTable1 = [
    { code: ' HU 111', name: ' English-1', hours: 2, preRequest: 'None', grade: 'None' },
    { code: ' HU 112', name: 'English-2', hours: 2, preRequest: 'HU 111', grade: 'None' },
    { code: 'HU 313', name: 'Human Rights', hours: 2, preRequest: 'None', grade: 'None' },
  ];

  coursesTable2 = [
    { code: 'HU 121', name: ' Fundamentals of Economics', hours: 3, preRequest: 'None', grade: 'None' },
    { code: 'HU 213', name: ' English-3', hours: 3, preRequest: 'HU 112', grade: 'None' },
    { code: 'HU 323', name: ' Fundamentals of Accounting', hours: 3, preRequest: 'None', grade: 'None' },
    { code: 'HU 331', name: 'Communication & Negotiation Skills', hours: 3, preRequest: 'None', grade: 'None' },
    { code: 'HU 332', name: ' Creative Thinking', hours: 3, preRequest: 'None', grade: 'None' },
    { code: 'HU 333', name: ' Mass Communication', hours: 3, preRequest: 'None', grade: 'None' },
    { code: 'HU 334', name: ' Professional Ethics', hours: 3, preRequest: 'None', grade: 'None' },
  ];

  constructor(private authService: AuthService, private router: Router) {
    this.authService.studentObservable.subscribe((newStudent) => {
      if (newStudent) {
        this.student = newStudent;
      }
    });
  }

  ngOnInit(): void {
    // Initialization logic if needed
  }
}
