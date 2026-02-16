import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    TranslateModule, 
    ButtonModule, 
    CardModule, 
    DividerModule
  ],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {

  constructor(private router: Router, private keycloak: KeycloakService) {}

  async login() {
    // نتحقق إذا كان مسجلاً للدخول مسبقاً
    const isLoggedIn = await this.keycloak.isLoggedIn();
    if (isLoggedIn) {
      this.router.navigate(['/workspace']);
    } else {
      // توجيه لصفحة الكيكلوك
      // نستخدم login() مباشرة هنا لضمان فتح صفحة الكيكلوك
      this.keycloak.login({
        redirectUri: window.location.origin + '/workspace'
      });
    }
  }

  goToGithub() {
    // استبدل هذا الرابط برابط مشروعك الحقيقي
    window.open('https://github.com/Salamndir/', '_blank');
  }
}