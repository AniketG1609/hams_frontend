import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  fullName = '';
  email = '';
  phone = '';
  role = '';
  specialization = '';
  license = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirm = false;

  get passwordMismatch() {
    return this.password && this.confirmPassword && this.password !== this.confirmPassword;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirm() {
    this.showConfirm = !this.showConfirm;
  }

  onRoleChange() {
    if (this.role !== 'doctor') {
      this.specialization = '';
      this.license = '';
    }
  }

  onRegister() {
    if (this.passwordMismatch) {
      alert('Passwords do not match!');
      return;
    }
    alert(`✅ Registration Successful!\nYour ${this.role} account has been created.`);
  }
}
