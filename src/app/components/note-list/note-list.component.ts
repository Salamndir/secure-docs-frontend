import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../../services/note.service';
import { MessageService, ConfirmationService } from 'primeng/api';
// استيراد الترجمة
import { TranslateModule, TranslateService } from '@ngx-translate/core'; 

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextModule,
    InputTextareaModule,
    TranslateModule
  ],
  providers: [ConfirmationService], 
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnInit {

  notes: any[] = [];
  loading: boolean = true;
  
  displayViewDialog: boolean = false;
  selectedNoteView: any = null;

  displayFormDialog: boolean = false;
  currentRecord: any = { title: '', content: '' };
  selectedFile: File | null = null;

  constructor(
    private noteService: NoteService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.getAllNotes();
  }

  getAllNotes() {
    this.loading = true;
    this.noteService.getNotes().subscribe({
      next: (data) => {
        this.notes = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  viewNote(note: any) {
    this.selectedNoteView = note;
    this.displayViewDialog = true; 
  }

  openNew() {
    this.currentRecord = { title: '', content: '' };
    this.selectedFile = null;
    this.displayFormDialog = true;
  }

  openEdit(note: any) {
    this.currentRecord = { ...note }; 
    this.selectedFile = null;
    this.displayFormDialog = true;
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  saveRecord() {
    const recordData = {
      title: this.currentRecord.title,
      content: this.currentRecord.content
    };

    if (this.currentRecord.id) {
      // Update
      this.noteService.updateNote(this.currentRecord.id, recordData, this.selectedFile || undefined)
        .subscribe({
          next: (updatedRecord) => {
            const index = this.notes.findIndex(n => n.id === updatedRecord.id);
            if (index !== -1) this.notes[index] = updatedRecord;
            
            this.showSuccess(this.translate.instant('NOTES.TABLE.MESSAGES.UPDATE_SUCCESS'));
            this.displayFormDialog = false;
          }
        });
    } else {
      // Create
      this.noteService.createNote(recordData, this.selectedFile || undefined)
        .subscribe({
          next: (newRecord) => {
            this.notes.push(newRecord);
            this.showSuccess(this.translate.instant('NOTES.TABLE.MESSAGES.CREATE_SUCCESS'));
            this.displayFormDialog = false;
          }
        });
    }
  }

  deleteNote(id: number) {
    this.confirmationService.confirm({
      message: this.translate.instant('NOTES.TABLE.MESSAGES.DELETE_CONFIRM_MSG'),
      header: this.translate.instant('NOTES.TABLE.MESSAGES.DELETE_CONFIRM_TITLE'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translate.instant('YES') || 'Yes',
      rejectLabel: this.translate.instant('NO') || 'No',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      accept: () => {
        this.noteService.deleteNote(id).subscribe({
          next: () => {
            this.notes = this.notes.filter(n => n.id !== id);
            this.showSuccess(this.translate.instant('NOTES.TABLE.MESSAGES.DELETE_SUCCESS'));
          }
        });
      }
    });
  }

  private showSuccess(detail: string) {
    this.messageService.add({ 
      severity: 'success', 
      summary: this.translate.instant('NOTES.TABLE.MESSAGES.SUCCESS_TITLE'), 
      detail: detail 
    });
  }

  // ─── منطق الصور والملفات (تم الاسترجاع للمنطق القديم لضمان العرض) ───
  
// ... (داخل الكلاس NoteListComponent)

  // 1. فحص PDF (كما هو)
  isPdf(url: string | null): boolean {
    if (!url) return false;
    return url.toLowerCase().includes('.pdf');
  }

  // 2. فحص الصور (تعديل جذري: نفحص الامتداد بدقة)
  isImage(url: string | null): boolean {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.includes('.jpg') || 
           lower.includes('.jpeg') || 
           lower.includes('.png') || 
           lower.includes('.webp') || 
           lower.includes('.gif') ||
           lower.includes('.jfif') || 
           lower.includes('.svg');
  }

  // 3. دالة جديدة: أي ملف ليس صورة ولا PDF (مثل Excel, Txt, Zip)
  isOtherFile(url: string | null): boolean {
    if (!url) return false;
    return !this.isPdf(url) && !this.isImage(url);
  }

// ...
}