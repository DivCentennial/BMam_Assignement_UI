import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LogoutboxComponent } from './logoutbox/logoutbox.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'BMam_Assignement_UI';
  loggedIn = false;

  constructor(private router: Router, private dialog: MatDialog) {}

  setLoggedIn(value: boolean) {
    this.loggedIn = value;
  }

  onActivate(event: any) {
    if (event.constructor.name === 'LoginComponent') {
      this.setLoggedIn(false);
    } else {
      this.setLoggedIn(true);
    }
  }

 logout() {
  this.dialog.open(LogoutboxComponent, {
    width: '400px',
    // You can set minWidth or maxWidth if needed
    // Centering ensured by default, but here is the explicit config:
    disableClose: true, // Optional: Force a decision, disables closing by clicking outside
    // panelClass: 'logout-dialog-center' // Only needed for custom styling
  }).afterClosed().subscribe(result => {
    if (result) {
      this.loggedIn = false;
      this.router.navigate(['/']);
    }
  });
}

}
