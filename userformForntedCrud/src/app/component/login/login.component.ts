import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  
  constructor(
    private authService: AuthService,
    private fb: FormBuilder, 
    private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

 

  submit() {
    this.authService.login(this.loginForm.value).subscribe(
      (response: any) => {
        console.log('Generated JWT Token:', response.jwtToken);
        alert('Login Successful! Token received.');
        localStorage.setItem('JWT', response.jwtToken);
        localStorage.getItem('JWT');
        this.router.navigateByUrl('/dashboard');
      },
      (error) => {
        console.error('Login error:', error);
        alert('Login failed. Please check your credentials.');
      }
    );


  }
  
  


}