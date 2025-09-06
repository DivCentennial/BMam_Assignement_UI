// document.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DocumentUploadResponse {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'your-api-base-url'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  /**
   * Upload document to server
   */
  uploadDocument(file: File): Observable<DocumentUploadResponse> {
    const formData = new FormData();
    formData.append('document', file);
    
    return this.http.post<DocumentUploadResponse>(`${this.apiUrl}/documents/upload`, formData);
  }

  /**
   * Download document from server
   */
  downloadDocument(documentId: string, fileName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/documents/${documentId}/download`, {
      responseType: 'blob'
    });
  }

  /**
   * Delete document from server
   */
  deleteDocument(documentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/documents/${documentId}`);
  }

  /**
   * Download file from blob data
   */
  downloadFromBlob(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Download file from base64 data URL
   */
  downloadFromDataUrl(dataUrl: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Validate file type and size
   */
  validateFile(file: File, allowedTypes: string[], maxSize: number): { valid: boolean; error?: string } {
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      return {
        valid: false,
        error: `File size exceeds limit. Maximum size: ${maxSizeMB}MB`
      };
    }

    return { valid: true };
  }

  /**
   * Convert file to base64
   */
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Get file icon based on file type
   */
  getFileIcon(fileType: string): string {
    if (fileType.includes('pdf')) {
      return 'picture_as_pdf';
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return 'description';
    } else if (fileType.includes('image')) {
      return 'image';
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return 'grid_on';
    } else if (fileType.includes('powerpoint') || fileType.includes('presentation')) {
      return 'slideshow';
    } else {
      return 'insert_drive_file';
    }
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}