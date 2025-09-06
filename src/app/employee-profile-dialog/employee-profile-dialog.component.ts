// employee-profile-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

export interface ProfileDocument {
  name: string;
  url: string;
  type: string;
  size: number;
  uploadDate: Date;
}

export interface Employee {
  id?: number;
  name: string;
  gender: string;
  dob: Date | null;
  age: number;
  address: string;
  contactNumber: string;
  email: string;
  designation: string;
  department: string;
  qualification: string;
  experience: number;
  skills: string;
  avatar?: string;
  profileDocument?: ProfileDocument;
}

@Component({
  selector: 'app-employee-profile-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './employee-profile-dialog.component.html',
  styleUrls: ['./employee-profile-dialog.component.css']
})
export class EmployeeProfileDialogComponent implements OnInit {
  personalForm!: FormGroup;
  professionalForm!: FormGroup;
  selectedTab = 0;
  imagePreview: string | null = null;
  isEditMode = false;
  
  // Document handling properties
  profileDocument: ProfileDocument | null = null;
  selectedDocumentName: string | null = null;
  selectedDocumentFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmployeeProfileDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Employee | null
  ) {
    this.isEditMode = !!data;
    this.initializeForms();
    
    if (this.data) {
      this.populateFormData();
    }
  }

  ngOnInit(): void {}

  initializeForms(): void {
    this.personalForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['', [Validators.required]],
      dob: [null, [Validators.required]],
      age: [{ value: '', disabled: true }],
      address: ['', [Validators.required, Validators.minLength(10)]],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.professionalForm = this.fb.group({
      designation: ['', [Validators.required, Validators.minLength(2)]],
      department: ['', [Validators.required, Validators.minLength(2)]],
      qualification: ['', [Validators.required, Validators.minLength(2)]],
      experience: [0, [Validators.required, Validators.min(0)]],
      skills: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  populateFormData(): void {
    if (this.data) {
      this.personalForm.patchValue({
        name: this.data.name,
        gender: this.data.gender,
        dob: this.data.dob,
        age: this.data.age,
        address: this.data.address,
        contactNumber: this.data.contactNumber,
        email: this.data.email
      });

      this.professionalForm.patchValue({
        designation: this.data.designation,
        department: this.data.department,
        qualification: this.data.qualification,
        experience: this.data.experience,
        skills: this.data.skills
      });

      if (this.data.avatar) {
        this.imagePreview = this.data.avatar;
      }

      if (this.data.profileDocument) {
        this.profileDocument = this.data.profileDocument;
      }
    }
  }

  onDOBChange(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      const age = this.calculateAge(event.value);
      this.personalForm.get('age')?.setValue(age);
    }
  }

  calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  onAvatarSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.snackBar.open('Please select a valid image file', 'Close', {
          duration: 3000
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('Image size should be less than 5MB', 'Close', {
          duration: 3000
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeAvatar(): void {
    this.imagePreview = null;
  }

  onDocumentSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(file.type)) {
        this.snackBar.open('Please select a PDF or Word document', 'Close', {
          duration: 3000
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.snackBar.open('Document size should be less than 10MB', 'Close', {
          duration: 3000
        });
        return;
      }

      this.selectedDocumentFile = file;
      this.selectedDocumentName = file.name;
    }
  }

  removeSelectedDocument(): void {
    this.selectedDocumentFile = null;
    this.selectedDocumentName = null;
  }

  // New method to download the currently selected document (before saving)
  downloadSelectedDocument(): void {
    if (this.selectedDocumentFile) {
      try {
        const url = URL.createObjectURL(this.selectedDocumentFile);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.selectedDocumentFile.name;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.snackBar.open('Document downloaded successfully', 'Close', {
          duration: 2000
        });
      } catch (error) {
        console.error('Download failed:', error);
        this.snackBar.open('Download failed. Please try again.', 'Close', {
          duration: 3000
        });
      }
    }
  }

  // New method to preview the selected document
  previewSelectedDocument(): void {
    if (this.selectedDocumentFile) {
      const url = URL.createObjectURL(this.selectedDocumentFile);
      window.open(url, '_blank');
      this.snackBar.open('Document opened in new tab', 'Close', {
        duration: 2000
      });
    }
  }

  // Demo method to simulate edit mode for testing
  simulateEditMode(): void {
    // Create a mock document for demonstration
    this.profileDocument = {
      name: 'Sample_Resume.pdf',
      url: 'data:application/pdf;base64,JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwKL0xlbmd0aCA0MTAK',
      type: 'application/pdf',
      size: 1024 * 50, // 50KB
      uploadDate: new Date()
    };
    
    this.snackBar.open('Demo: Now showing edit mode with existing document', 'Close', {
      duration: 3000
    });
  }

  downloadDocument(): void {
    if (this.profileDocument) {
      // In a real application, you would implement actual download logic
      // For now, we'll simulate it
      const link = document.createElement('a');
      link.href = this.profileDocument.url;
      link.download = this.profileDocument.name;
      link.click();
      
      this.snackBar.open('Document download started', 'Close', {
        duration: 2000
      });
    }
  }

  deleteDocument(): void {
    if (confirm('Are you sure you want to delete this document?')) {
      this.profileDocument = null;
      this.snackBar.open('Document deleted successfully', 'Close', {
        duration: 2000
      });
    }
  }

  onSave(): void {
    // Mark all fields as touched to show validation errors
    this.markFormGroupTouched(this.personalForm);
    this.markFormGroupTouched(this.professionalForm);

    if (this.personalForm.valid && this.professionalForm.valid) {
      const employeeData: Employee = {
        ...this.personalForm.value,
        ...this.professionalForm.value,
        avatar: this.imagePreview
      };

      // Handle document upload
      if (this.selectedDocumentFile) {
        // In a real application, you would upload the file to a server
        // For now, we'll create a mock ProfileDocument
        const profileDocument: ProfileDocument = {
          name: this.selectedDocumentFile.name,
          url: URL.createObjectURL(this.selectedDocumentFile), // This is for demo purposes
          type: this.selectedDocumentFile.type,
          size: this.selectedDocumentFile.size,
          uploadDate: new Date()
        };
        employeeData.profileDocument = profileDocument;
      } else if (this.profileDocument) {
        // Keep existing document if no new one is selected
        employeeData.profileDocument = this.profileDocument;
      }

      if (this.isEditMode && this.data?.id) {
        employeeData.id = this.data.id;
      }

      // If no new document is selected, proceed with normal save
      this.dialogRef.close(employeeData);
    } else {
      // Show error message for invalid forms
      this.snackBar.open('Please fill all required fields correctly', 'Close', {
        duration: 3000
      });
      
      // Navigate to first tab with errors
      if (!this.personalForm.valid) {
        this.selectedTab = 0;
      } else if (!this.professionalForm.valid) {
        this.selectedTab = 1;
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  nextTab(): void {
    // Validate current tab before moving to next
    if (this.selectedTab === 0) {
      this.markFormGroupTouched(this.personalForm);
      if (this.personalForm.valid) {
        this.selectedTab = 1;
      } else {
        this.snackBar.open('Please fill all required fields in Personal tab', 'Close', {
          duration: 3000
        });
      }
    }
  }

  previousTab(): void {
    if (this.selectedTab > 0) {
      this.selectedTab--;
    }
  }
}