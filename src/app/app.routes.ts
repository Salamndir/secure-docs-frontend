import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoteListComponent } from './components/note-list/note-list.component';
import { WelcomeComponent } from './components/welcome/welcome.component'; 

export const routes: Routes = [
  // الصفحة الافتراضية: ترحيب (مفتوحة)
  { 
    path: '', 
    component: WelcomeComponent 
  },
  
  // صفحة النظام: محمية (تطلب دخول)
  { 
    path: 'workspace', 
    component: NoteListComponent, 
    canActivate: [AuthGuard]
  },
  
 
  { path: '**', redirectTo: '' } 
];