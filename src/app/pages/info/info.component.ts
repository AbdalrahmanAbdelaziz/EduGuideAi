import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Scroll event listener
    this.scrollEvent();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrollEvent();
  }

  scrollEvent(): void {
    const sections = document.querySelectorAll('.section');
    sections.forEach((section) => {
      const position = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (position < windowHeight * 0.8) {
        section.classList.add('visible');
      }
    });
  }
}
