import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from './services/language.service'; // Import our new service
import { NavbarComponent } from './components/navbar/navbar.component';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ThemeService } from './services/theme.service';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent,TranslateModule, CardModule, InputTextModule, ToastModule], // We removed TranslateModule & ButtonModule (moved to Navbar)
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  
  // Inject the LanguageService and ThemeService
  constructor(private languageService: LanguageService, private themeService: ThemeService) {}

  ngOnInit() {
    // Just initialize the language logic via the service.
    // No hardcoded DOM manipulation here anymore!
    this.languageService.initLanguage();
    this.themeService.initTheme();
  }
}