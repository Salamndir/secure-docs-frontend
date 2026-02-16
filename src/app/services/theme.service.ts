import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  activeTheme: string = 'lara-light-blue';

  constructor(@Inject(DOCUMENT) private document: Document) {}

  
  initTheme() {
    const savedTheme = localStorage.getItem('user-theme') || 'lara-light-blue';
    this.switchTheme(savedTheme);
  }

 
  switchTheme(theme: string) {
    let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;

    if (themeLink) {
      themeLink.href = `assets/themes/${theme}/theme.css`;
    }

    localStorage.setItem('user-theme', theme);
    
    this.activeTheme = theme;
  }
}