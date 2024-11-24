import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  sections: HTMLElement[] = [];

  constructor() {}

  ngOnInit(): void {
    // Collect all sections you want to animate
    this.sections = Array.from(document.querySelectorAll('.section'));
    this.checkSectionVisibility();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.checkSectionVisibility();
  }

  checkSectionVisibility(): void {
    const windowHeight = window.innerHeight;
    this.sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;

      if (sectionTop <= windowHeight * 0.75) {
        section.classList.add('show');
      } else {
        section.classList.remove('show');
      }
    });
  }
}
