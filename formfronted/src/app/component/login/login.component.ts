import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,  // ✅ Add this for standalone component support
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder, 
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.loginForm.invalid) {
      alert('Please fill in all fields!');
      return;
    }

    this.authService.login(this.loginForm.value).subscribe(
      (response: any) => {
        console.log('Login Response:', response); // ✅ Debugging API response

        if (response.jwtToken && response.refreshToken) {
          localStorage.setItem('JWT', response.jwtToken);
          localStorage.setItem('REFRESH_TOKEN', response.refreshToken);

          console.log('Stored Access Token:', localStorage.getItem('JWT')); // ✅ Debugging
          console.log('Stored Refresh Token:', localStorage.getItem('REFRESH_TOKEN')); // ✅ Debugging

          alert('Login Successful! Redirecting...');
          this.router.navigateByUrl('/dashboard');
        } else {
          alert('Login failed. Invalid response from server.');
        }
      },
      (error) => {
        console.error('Login error:', error);
        alert('Login failed. Please check your credentials.');
      }
    );
  }
}
