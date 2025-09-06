import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logoutbox',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './logoutbox.component.html',
  styleUrl: './logoutbox.component.css'
})
export class LogoutboxComponent {
  constructor(public dialogRef: MatDialogRef<LogoutboxComponent>) {}

  no(): void {
    this.dialogRef.close(false);
  }
  yes(): void {
    this.dialogRef.close(true);
  }
}
