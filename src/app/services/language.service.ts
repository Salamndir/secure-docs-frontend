import { Injectable, Inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root' // Singleton: Available everywhere in the app
})
export class LanguageService {
  
  // Signal to track current language (Better than standard variables for reactivity)
  // Initially 'en'
  currentLang = signal<string>('en');

  constructor(
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * 1. Initialization Method
   * Called once by AppComponent to set up the language on startup.
   */
  initLanguage() {
    // Check LocalStorage or default to 'en'
    const savedLang = localStorage.getItem('lang') || 'en';
    this.setLanguage(savedLang);
  }

  /**
   * 2. Toggle Method
   * Used by buttons to switch between Ar/En
   */
  toggleLanguage() {
    const newLang = this.currentLang() === 'en' ? 'ar' : 'en';
    this.setLanguage(newLang);
  }

  /**
   * 3. Core Logic (Private or Public)
   * Handles translation service, LocalStorage, and HTML direction.
   */
  setLanguage(lang: string) {
    // A. Update Signal state
    this.currentLang.set(lang);

    // B. Trigger TranslateService
    this.translate.use(lang);

    // C. Save to LocalStorage
    localStorage.setItem('lang', lang);

    // D. Handle DOM Direction (RTL / LTR)
    const htmlTag = this.document.getElementsByTagName('html')[0];
    if (lang === 'ar') {
      htmlTag.setAttribute('dir', 'rtl');
      htmlTag.setAttribute('lang', 'ar');
    } else {
      htmlTag.setAttribute('dir', 'ltr');
      htmlTag.setAttribute('lang', 'en');
    }
  }
}