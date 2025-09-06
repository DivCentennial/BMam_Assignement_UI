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
import { CommonModule } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

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
  joiningDate: Date | null;
  salary: number;
  avatar?: string;
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
    MatIconModule
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

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmployeeProfileDialogComponent>,
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
      joiningDate: [null, [Validators.required]],
      salary: [0, [Validators.required, Validators.min(1)]]
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
        joiningDate: this.data.joiningDate,
        salary: this.data.salary
      });

      if (this.data.avatar) {
        this.imagePreview = this.data.avatar;
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSave(): void {
    if (this.personalForm.valid && this.professionalForm.valid) {
      const employeeData: Employee = {
        ...this.personalForm.value,
        ...this.professionalForm.value,
        avatar: this.imagePreview
      };

      if (this.isEditMode && this.data?.id) {
        employeeData.id = this.data.id;
      }

      this.dialogRef.close(employeeData);
    } else {
      this.markFormGroupTouched(this.personalForm);
      this.markFormGroupTouched(this.professionalForm);
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
    if (this.selectedTab < 1) {
      this.selectedTab++;
    }
  }

  previousTab(): void {
    if (this.selectedTab > 0) {
      this.selectedTab--;
    }
  }
}