import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  email = '';
  password = '';
  showPassword = false;

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    alert('🎉 Login Successful!\nRedirecting to dashboard...');
    // TODO: call backend, handle JWT, redirect by role
  }
}
