// mainpage.component.ts
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
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

// Updated interface to match dialog interface
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
  joiningDate?: Date | null;
  salary?: number;
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
      contactNumber: '1234567890'
    },
    { 
      id: 2,
      name: 'Arun T', 
      designation: 'Database Architect', 
      department: 'Database', 
      contact: '3434534', 
      email: 'arun.t@mariapps.com',
      contactNumber: '3434534'
    },
    { 
      id: 3,
      name: 'Dijin', 
      designation: 'Technical Architect', 
      department: 'IT', 
      contact: '9089783643', 
      email: 'dijin.augustine@mariapps.com',
      contactNumber: '9089783643'
    },
    { 
      id: 4,
      name: 'Ezhaisavallaban', 
      designation: 'Assistant Technical Manager', 
      department: 'Development', 
      contact: '344546456', 
      email: 'Ezhaisavallaban@mariapps.com',
      contactNumber: '344546456'
    },
    { 
      id: 5,
      name: 'Joseph Alex', 
      designation: 'Developer', 
      department: 'Development', 
      contact: '6000050000', 
      email: 'joseph.alex@mariapps.com',
      contactNumber: '6000050000'
    },
    { 
      id: 6,
      name: 'Sreyas', 
      designation: 'Technical Manager', 
      department: 'IT', 
      contact: '9999999990', 
      email: 'sreyas.narayanan@mariapps.com',
      contactNumber: '9999999990'
    }
  ];
  
  dataSource = new MatTableDataSource<TableEmployee>(this.employees);
  
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    // Set up the filter predicate for search functionality
    this.dataSource.filterPredicate = (data: TableEmployee, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return data.name.toLowerCase().includes(searchTerm) ||
             data.designation.toLowerCase().includes(searchTerm) ||
             data.department.toLowerCase().includes(searchTerm) ||
             data.contact.toLowerCase().includes(searchTerm) ||
             data.email.toLowerCase().includes(searchTerm);
    };
  }

  ngOnInit() {
    // Set up real-time search
    this.setupSearch();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  setupSearch() {
    // You can implement real-time search here if needed
    // For now, we'll use the applyFilter method
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
        // Generate new ID
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
          joiningDate: result.joiningDate,
          salary: result.salary,
          avatar: result.avatar
        };

        // Add to employees array
        this.employees.push(newEmployee);
        
        // Refresh the data source
        this.dataSource.data = [...this.employees];
        
        // Show success message
        this.snackBar.open('Employee added successfully!', 'Close', { 
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }
    });
  }

  editEmployee(employee: TableEmployee) {
    // Convert TableEmployee to Employee format for the dialog
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
      joiningDate: employee.joiningDate || null,
      salary: employee.salary || 0,
      avatar: employee.avatar
    };

    const dialogRef = this.dialog.open(EmployeeProfileDialogComponent, {
      width: '700px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: true,
      data: employeeData // pass employee data for edit mode
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Find and update the employee
        const index = this.employees.findIndex(e => e.id === employee.id);
        if (index > -1) {
          // Update the employee data
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
            joiningDate: result.joiningDate,
            salary: result.salary,
            avatar: result.avatar
          };

          this.employees[index] = updatedEmployee;
          
          // Refresh the data source
          this.dataSource.data = [...this.employees];
          
          // Show success message
          this.snackBar.open('Employee updated successfully!', 'Close', { 
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        }
      }
    });
  }

  // Method to handle search filtering
  applyFilter() {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  deleteEmployee(emp: TableEmployee) {
    if (confirm(`Are you sure you want to delete '${emp.name}'?`)) {
      const index = this.employees.indexOf(emp);
      if (index > -1) {
        this.employees.splice(index, 1);
        this.dataSource.data = [...this.employees]; // Refresh dataSource
        this.snackBar.open('Employee deleted successfully.', 'Close', { 
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }
    }
  }
}