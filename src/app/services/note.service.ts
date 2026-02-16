import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NoteResponse, NoteRequest } from '../models/note.model';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  // Get the API URL from environment file (e.g., https://salem-dev.online/api)
  private apiUrl = `${environment.apiUrl}/notes`;

  constructor(private http: HttpClient) { }

  /**
   * 1. GET ALL NOTES
   * Method: GET /api/notes
   */
  getNotes(): Observable<NoteResponse[]> {
    return this.http.get<NoteResponse  []>(this.apiUrl);
  }

  /**
   * 2. CREATE NOTE (Multipart)
   * Method: POST /api/notes
   * Requires: FormData with 'data' (JSON) and optional 'file' (Image)
   */
  createNote(noteData: NoteRequest, file?: File): Observable<NoteResponse> {
    const formData = this.prepareFormData(noteData, file);
    return this.http.post<NoteResponse>(this.apiUrl, formData);
  }

  /**
   * 3. UPDATE NOTE (Multipart)
   * Method: PUT /api/notes/{id}
   */
  updateNote(id: number, noteData: NoteRequest, file?: File): Observable<NoteResponse> {
    const formData = this.prepareFormData(noteData, file);
    return this.http.put<NoteResponse>(`${this.apiUrl}/${id}`, formData);
  }

  /**
   * 4. DELETE NOTE
   * Method: DELETE /api/notes/{id}
   */
  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // =================================================================
  // HELPER METHOD: Prepare FormData
  // =================================================================
  // This helper converts the JSON object and File into a FormData object
  // that Spring Boot's @RequestPart expects.
  private prepareFormData(noteData: NoteRequest, file?: File): FormData {
    const formData = new FormData();

    // 1. Append the JSON part as a Blob with application/json type
    // This is crucial! Spring needs to know this part is JSON to map it to NoteRequest DTO.
    formData.append(
      'data', 
      new Blob([JSON.stringify(noteData)], { type: 'application/json' })
    );

    // 2. Append the File part (if exists)
    if (file) {
      formData.append('file', file);
    }

    return formData;
  }
}