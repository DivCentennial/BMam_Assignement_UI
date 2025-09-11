// mainpage.component.ts
import { Component, ViewChild, AfterViewInit, OnInit, ElementRef } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeProfileDialogComponent, Employee } from '../employee-profile-dialog/employee-profile-dialog.component';
import { EmployeeService } from '../services/employee.service';
import { EmployeePersonal } from '../models/extraction-detail.model.interface';

// Updated interface to match the new dialog interface
interface TableEmployee {
  id?: number;
  name: string;
  designation: string;
  department: string;
  contact: string;
  email: string;
  gender?: string;
  dob?: Date | null;
  age?: number;
  address?: string;
  contactNumber?: string;
  qualification?: string;
  experience?: number;
  skills?: string;
  avatar?: string;
}

@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatTableModule, 
    MatIconModule, 
    MatInputModule, 
    MatFormFieldModule,
    MatButtonModule,
    MatSortModule, 
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.css'
})
export class MainpageComponent implements AfterViewInit, OnInit {
  searchText = '';
  
  displayedColumns: string[] = ['name', 'designation', 'department', 'contact', 'email', 'edit'];
  
  employees: TableEmployee[] = [
    { 
      id: 1,
      name: 'ASASAS', 
      designation: 'DDDD', 
      department: 'ADAD', 
      contact: '1234567890', 
      email: 'sre@gmail.com',
      contactNumber: '1234567890',
      qualification: 'B.Tech',
      experience: 2,
      skills: 'JavaScript, Angular'
    },
    { 
      id: 2,
      name: 'Arun T', 
      designation: 'Database Architect', 
      department: 'Database', 
      contact: '3434534', 
      email: 'arun.t@mariapps.com',
      contactNumber: '3434534',
      qualification: 'M.Tech',
      experience: 8,
      skills: 'SQL, Oracle, MongoDB'
    },
    { 
      id: 3,
      name: 'Dijin', 
      designation: 'Technical Architect', 
      department: 'IT', 
      contact: '9089783643', 
      email: 'dijin.augustine@mariapps.com',
      contactNumber: '9089783643',
      qualification: 'B.E',
      experience: 10,
      skills: 'System Architecture, Cloud Computing, AWS'
    },
    { 
      id: 4,
      name: 'Ezhaisavallaban', 
      designation: 'Assistant Technical Manager', 
      department: 'Development', 
      contact: '344546456', 
      email: 'Ezhaisavallaban@mariapps.com',
      contactNumber: '344546456',
      qualification: 'MCA',
      experience: 6,
      skills: 'Java, Spring Boot, Microservices'
    },
    { 
      id: 5,
      name: 'Joseph Alex', 
      designation: 'Developer', 
      department: 'Development', 
      contact: '6000050000', 
      email: 'joseph.alex@mariapps.com',
      contactNumber: '6000050000',
      qualification: 'B.Tech',
      experience: 3,
      skills: 'React, Node.js, Python'
    },
    { 
      id: 6,
      name: 'Sreyas', 
      designation: 'Technical Manager', 
      department: 'IT', 
      contact: '9999999990', 
      email: 'sreyas.narayanan@mariapps.com',
      contactNumber: '9999999990',
      qualification: 'B.Tech',
      experience: 12,
      skills: 'Team Management, DevOps, Kubernetes'
    }
  ];
  
  dataSource = new MatTableDataSource<TableEmployee>(this.employees);
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public readonly employeeService: EmployeeService
  ) {
    // Set up the filter predicate for search functionality
    this.dataSource.filterPredicate = (data: TableEmployee, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return data.name.toLowerCase().includes(searchTerm) ||
             data.designation.toLowerCase().includes(searchTerm) ||
             data.department.toLowerCase().includes(searchTerm) ||
             data.contact.toLowerCase().includes(searchTerm) ||
             data.email.toLowerCase().includes(searchTerm) ||
             (data.qualification?.toLowerCase().includes(searchTerm) || false) ||
             (data.skills?.toLowerCase().includes(searchTerm) || false);
    };
  }

  ngOnInit() {
    // Set up real-time search
    this.setupSearch();
    // Load employee data from backend
    this.loadData();
  }

  public loadData(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data: EmployeePersonal[]) => {
        console.log('Employee data loaded:', data);
        // Convert backend data to table format
        this.employees = data.map((emp: EmployeePersonal) => ({
          id: emp.employeeId,
          name: emp.fullName,
          designation: emp.designation || '', // Now from backend
          department: emp.department || '', // Now from backend
          contact: emp.contactNo,
          email: emp.email || '',
          gender: emp.gender,
          dob: emp.dob ? new Date(emp.dob) : null,
          age: emp.age,
          address: emp.address,
          contactNumber: emp.contactNo,
          qualification: emp.qualification || '',
          experience: emp.experience,
          skills: emp.skill || '',
          avatar: emp.profileImageUrl || undefined
        }));
        
        // Update the data source
        this.dataSource.data = [...this.employees];
        
        // Show success message
        this.snackBar.open(`Loaded ${this.employees.length} employees from server`, 'Close', {
          duration: 2000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Failed to load employee data:', error);
        this.snackBar.open('Failed to load employees from server. Using local data.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        // Keep existing local data if backend fails
        this.dataSource.data = [...this.employees];
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  setupSearch() {
    // You can implement real-time search here if needed
    // For now, we'll use the applyFilter method
  }

  // Export employees to CSV
  exportToCSV() {
    if (this.employees.length === 0) {
      this.snackBar.open('No data to export!', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    // Define CSV headers
    const csvHeaders = [
      'ID',
      'Name',
      'Gender',
      'Date of Birth',
      'Age',
      'Address',
      'Contact Number',
      'Email',
      'Designation',
      'Department',
      'Qualification',
      'Experience',
      'Skills'
    ];

    // Convert employee data to CSV format
    const csvData = this.employees.map(emp => [
      emp.id || '',
      emp.name || '',
      emp.gender || '',
      emp.dob ? this.formatDate(emp.dob) : '',
      emp.age || '',
      emp.address || '',
      emp.contactNumber || emp.contact || '',
      emp.email || '',
      emp.designation || '',
      emp.department || '',
      emp.qualification || '',
      emp.experience || '',
      emp.skills || ''
    ]);

    // Combine headers with data
    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `employees_${this.getCurrentDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.snackBar.open('Employee data exported successfully!', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  // Trigger file input for CSV import
  importFromCSV() {
    this.fileInput.nativeElement.click();
  }

  // Handle file selection and import
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.parseCSV(e.target.result);
      };
      reader.readAsText(file);
    } else {
      this.snackBar.open('Please select a valid CSV file!', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
    // Reset file input
    event.target.value = '';
  }

  // Parse CSV content and import employees
  private parseCSV(csvContent: string) {
    try {
      const lines = csvContent.split('\n').filter(line => line.trim() !== '');
      if (lines.length < 2) {
        this.snackBar.open('CSV file is empty or invalid!', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      // Skip header row
      const dataLines = lines.slice(1);
      let importedCount = 0;
      let errorCount = 0;

      dataLines.forEach((line, index) => {
        try {
          const columns = this.parseCSVLine(line);
          if (columns.length >= 13) {
            // Generate new ID
            const newId = Math.max(...this.employees.map(e => e.id || 0)) + 1;
            
            const newEmployee: TableEmployee = {
              id: newId,
              name: columns[1] || '',
              gender: columns[2] || '',
              dob: columns[3] ? this.parseDate(columns[3]) : null,
              age: columns[4] ? parseInt(columns[4]) : undefined,
              address: columns[5] || '',
              contactNumber: columns[6] || '',
              contact: columns[6] || '',
              email: columns[7] || '',
              designation: columns[8] || '',
              department: columns[9] || '',
              qualification: columns[10] || '',
              experience: columns[11] ? parseInt(columns[11]) : undefined,
              skills: columns[12] || ''
            };

            // Basic validation
            if (newEmployee.name && newEmployee.email) {
              // Check if employee with same email already exists
              const existingEmployee = this.employees.find(emp => 
                emp.email.toLowerCase() === newEmployee.email.toLowerCase()
              );
              
              if (!existingEmployee) {
                this.employees.push(newEmployee);
                importedCount++;
              } else {
                errorCount++;
              }
            } else {
              errorCount++;
            }
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      });

      // Refresh the data source
      this.dataSource.data = [...this.employees];

      // Show import results
      if (importedCount > 0) {
        this.snackBar.open(
          `Successfully imported ${importedCount} employee(s)${errorCount > 0 ? `, ${errorCount} failed` : ''}!`, 
          'Close', 
          {
            duration: 5000,
            panelClass: ['success-snackbar']
          }
        );
      } else {
        this.snackBar.open('No new employees were imported!', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    } catch (error) {
      this.snackBar.open('Error parsing CSV file!', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  // Parse CSV line handling quoted fields
  private parseCSVLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  // Helper function to format date for CSV
  private formatDate(date: Date): string {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }

  // Helper function to parse date from CSV
  private parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }

  // Helper function to get current date string for filename
  private getCurrentDateString(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  addEmployee() {
    const dialogRef = this.dialog.open(EmployeeProfileDialogComponent, {
      width: '700px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: true,
      data: null // null means add mode
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Prepare data for API call - All data in Personal object (as per EmployeePersonalEntity structure)
        const personalData = {
          EmployeeId: 0, // Will be set by the backend
          FullName: result.name || '',
          Gender: this.convertGenderToChar(result.gender),
          DOB: result.dob ? new Date(result.dob).toISOString() : new Date().toISOString(),
          Age: result.age || null,
          Address: result.address || '',
          ContactNo: result.contactNumber || '',
          Email: result.email || '',
          ProfileImageUrl: result.avatar || '',
          // Professional fields (as per EmployeePersonalEntity structure)
          Designation: result.designation || '',
          Department: result.department || '',
          Qualification: result.qualification || '',
          Experience: result.experience ? parseFloat(result.experience.toString()) : null,
          Skill: result.skills || '',
          UploadDocURL: '' // Required field - provide empty string instead of null
        };

        // Minimal professional data (required by API structure)
        const professionalData = {
          EmployeeId: 0, // Will be set by the backend
          Designation: result.designation || '',
          Department: result.department || '',
          Qualification: result.qualification || '',
          Experience: result.experience ? parseFloat(result.experience.toString()) : null,
          Skill: result.skills || ''
        };

        // Call the API to add the employee
        this.employeeService.addEmployee(
          this.sanitizeApiData(personalData), 
          this.sanitizeApiData(professionalData)
        ).subscribe({
          next: (response) => {
            // Generate new ID for local display (you might want to get this from the response)
            const newId = Math.max(...this.employees.map(e => e.id || 0)) + 1;
            
            // Convert Employee to TableEmployee format
            const newEmployee: TableEmployee = {
              id: newId,
              name: result.name,
              designation: result.designation,
              department: result.department,
              contact: result.contactNumber,
              email: result.email,
              contactNumber: result.contactNumber,
              gender: result.gender,
              dob: result.dob,
              age: result.age,
              address: result.address,
              qualification: result.qualification,
              experience: result.experience,
              skills: result.skills,
              avatar: result.avatar
            };

            // Add to employees array only after successful API call
            this.employees.push(newEmployee);
            
            // Refresh the data source
            this.dataSource.data = [...this.employees];
            
            // Show success message
            this.snackBar.open('Employee added successfully!', 'Close', { 
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            console.error('Error adding employee:', error);
            console.error('Error details:', error.error);
            console.error('Validation errors:', error.error?.errors);
            this.snackBar.open('Failed to add employee. Please try again.', 'Close', { 
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

 editEmployee(employee: TableEmployee) {
  const employeeData: Employee = {
    id: employee.id,
    name: employee.name,
    gender: employee.gender || '',
    dob: employee.dob || null,
    age: employee.age || 0,
    address: employee.address || '',
    contactNumber: employee.contactNumber || employee.contact,
    email: employee.email,
    designation: employee.designation,
    department: employee.department,
    qualification: employee.qualification || '',
    experience: employee.experience || 0,
    skills: employee.skills || '',
    avatar: employee.avatar
  };

  const dialogRef = this.dialog.open(EmployeeProfileDialogComponent, {
    width: '700px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    disableClose: true,
    data: employeeData
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Prepare data for API call - All data in Personal object (as per EmployeePersonalEntity structure)
      const personalData = {
        EmployeeId: employee.id,
        FullName: result.name || '',
        Gender: this.convertGenderToChar(result.gender),
        DOB: result.dob ? new Date(result.dob).toISOString() : new Date().toISOString(),
        Age: result.age || null,
        Address: result.address || '',
        ContactNo: result.contactNumber || '',
        Email: result.email || '',
        ProfileImageUrl: result.avatar || '',
        // Professional fields (as per EmployeePersonalEntity structure)
        Designation: result.designation || '',
        Department: result.department || '',
        Qualification: result.qualification || '',
        Experience: result.experience ? parseFloat(result.experience.toString()) : null,
        Skill: result.skills || '',
        UploadDocURL: '' // Required field - provide empty string instead of null
      };

      // Minimal professional data (required by API structure)
      const professionalData = {
        EmployeeId: employee.id,
        Designation: result.designation || '',
        Department: result.department || '',
        Qualification: result.qualification || '',
        Experience: result.experience ? parseFloat(result.experience.toString()) : null,
        Skill: result.skills || ''
      };

      // Call the API to update the employee
      this.employeeService.updateEmployee(
        employee.id!, 
        this.sanitizeApiData(personalData), 
        this.sanitizeApiData(professionalData)
      ).subscribe({
        next: (response) => {
          // Update local data only after successful API call
          const index = this.employees.findIndex(e => e.id === employee.id);
          if (index > -1) {
            const updatedEmployee: TableEmployee = {
              ...this.employees[index],
              name: result.name,
              designation: result.designation,
              department: result.department,
              contact: result.contactNumber,
              email: result.email,
              contactNumber: result.contactNumber,
              gender: result.gender,
              dob: result.dob,
              age: result.age,
              address: result.address,
              qualification: result.qualification,
              experience: result.experience,
              skills: result.skills,
              avatar: result.avatar
            };

            this.employees[index] = updatedEmployee;
            this.refreshData();
            this.snackBar.open('Employee updated successfully!', 'Close', { 
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          }
        },
        error: (error) => {
          console.error('Error updating employee:', error);
          console.error('Error details:', error.error);
          console.error('Validation errors:', error.error?.errors);
          this.snackBar.open('Failed to update employee. Please try again.', 'Close', { 
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  });
}

refreshData() {
  this.dataSource.data = [...this.employees];
}

  // Method to handle search filtering
  applyFilter() {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  // Helper method to convert gender string to char for backend
  private convertGenderToChar(gender: string): string {
    if (!gender) return 'M'; // Default to Male
    switch (gender.toLowerCase()) {
      case 'male':
        return 'M';
      case 'female':
        return 'F';
      case 'other':
        return 'O';
      default:
        return 'M'; // Default fallback
    }
  }

  // Helper method to ensure proper data types for API
  private sanitizeApiData(data: any): any {
    const sanitized = { ...data };
    
    // Ensure Gender is a single character
    if (sanitized.Gender && typeof sanitized.Gender === 'string' && sanitized.Gender.length > 1) {
      sanitized.Gender = this.convertGenderToChar(sanitized.Gender);
    }
    
    // Ensure Experience is a number or null
    if (sanitized.Experience !== null && sanitized.Experience !== undefined) {
      sanitized.Experience = parseFloat(sanitized.Experience.toString());
    }
    
    // Ensure Age is a number or null
    if (sanitized.Age !== null && sanitized.Age !== undefined) {
      sanitized.Age = parseInt(sanitized.Age.toString());
    }
    
    // Ensure UploadDocURL is not null (required field)
    if (sanitized.UploadDocURL === null || sanitized.UploadDocURL === undefined) {
      sanitized.UploadDocURL = '';
    }
    
    // Truncate string fields to prevent database truncation errors
    // Common database column size limits (adjust as needed)
    if (sanitized.FullName && sanitized.FullName.length > 100) {
      console.warn(`FullName truncated from ${sanitized.FullName.length} to 100 characters`);
      sanitized.FullName = sanitized.FullName.substring(0, 100);
    }
    if (sanitized.Address && sanitized.Address.length > 500) {
      console.warn(`Address truncated from ${sanitized.Address.length} to 500 characters`);
      sanitized.Address = sanitized.Address.substring(0, 500);
    }
    if (sanitized.Email && sanitized.Email.length > 100) {
      console.warn(`Email truncated from ${sanitized.Email.length} to 100 characters`);
      sanitized.Email = sanitized.Email.substring(0, 100);
    }
    if (sanitized.ContactNo && sanitized.ContactNo.length > 20) {
      console.warn(`ContactNo truncated from ${sanitized.ContactNo.length} to 20 characters`);
      sanitized.ContactNo = sanitized.ContactNo.substring(0, 20);
    }
    if (sanitized.Designation && sanitized.Designation.length > 100) {
      console.warn(`Designation truncated from ${sanitized.Designation.length} to 100 characters`);
      sanitized.Designation = sanitized.Designation.substring(0, 100);
    }
    if (sanitized.Department && sanitized.Department.length > 100) {
      console.warn(`Department truncated from ${sanitized.Department.length} to 100 characters`);
      sanitized.Department = sanitized.Department.substring(0, 100);
    }
    if (sanitized.Qualification && sanitized.Qualification.length > 200) {
      console.warn(`Qualification truncated from ${sanitized.Qualification.length} to 200 characters`);
      sanitized.Qualification = sanitized.Qualification.substring(0, 200);
    }
    if (sanitized.Skill && sanitized.Skill.length > 500) {
      console.warn(`Skill truncated from ${sanitized.Skill.length} to 500 characters`);
      sanitized.Skill = sanitized.Skill.substring(0, 500);
    }
    if (sanitized.ProfileImageUrl && sanitized.ProfileImageUrl.length > 500) {
      console.warn(`ProfileImageUrl truncated from ${sanitized.ProfileImageUrl.length} to 500 characters`);
      sanitized.ProfileImageUrl = sanitized.ProfileImageUrl.substring(0, 500);
    }
    if (sanitized.UploadDocURL && sanitized.UploadDocURL.length > 500) {
      console.warn(`UploadDocURL truncated from ${sanitized.UploadDocURL.length} to 500 characters`);
      sanitized.UploadDocURL = sanitized.UploadDocURL.substring(0, 500);
    }
    
    return sanitized;
  }

  deleteEmployee(emp: TableEmployee) {
    if (confirm(`Are you sure you want to delete '${emp.name}'?`)) {
      // Call the API to delete the employee
      this.employeeService.deleteEmployee(emp.id!).subscribe({
        next: (response) => {
          // Remove from local data only after successful API call
          const index = this.employees.indexOf(emp);
          if (index > -1) {
            this.employees.splice(index, 1);
            this.dataSource.data = [...this.employees]; // Refresh dataSource
            this.snackBar.open('Employee deleted successfully.', 'Close', { 
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          }
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          this.snackBar.open('Failed to delete employee. Please try again.', 'Close', { 
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}