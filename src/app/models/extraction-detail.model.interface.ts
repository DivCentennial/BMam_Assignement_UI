// Employee interface matching your backend API response
export interface EmployeePersonal {
  employeeId: number;
  fullName: string;
  gender: string;
  dob: string; // Format: "1990-05-15T00:00:00"
  age: number;
  address: string;
  contactNo: string;
  email: string;
  profileImageUrl: string | null;
  // Add these fields from EmployeeProfessional
  designation?: string;
  department?: string;
  qualification?: string;
  experience?: number; // Backend returns decimal, but we'll use number
  skill?: string;
  uploadDocURL?: string;
}
export interface EmployeeProfessional {
  employeeId: number;
  designation: string;
  department: string;
  qualification: string;
  experience: number;
  skills: string;
  UploadDocUrl: string;
}

