import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

//   canActivate(): boolean {
//     const token = localStorage.getItem('JWT');
//     console.log('AuthGuard: JWT Token:', token);

//     if (token && !this.isTokenExpired(token)) {
//       console.log('AuthGuard: Access granted');
//       return true;
//     } else {
//       console.log('AuthGuard: Invalid/Expired token. Redirecting...');
//       this.router.navigate(['']);  // Redirect to login
//       return false;
//     }
//   }

//   // Function to check JWT expiration
//   private isTokenExpired(token: string): boolean {
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1])); // Decode payload
//       const expiry = payload.exp * 1000;  // Convert to milliseconds
//       return expiry < Date.now();  // Check if token is expired
//     } catch (e) {
//       console.error('AuthGuard: Error decoding token', e);
//       return true;  // Consider invalid if decoding fails
//     }
//   }
// }

canActivate(): boolean {
  const token = localStorage.getItem('JWT');
  if (!token) {
    console.log('AuthGuard: No token found. Redirecting to login...');
    this.router.navigate(['']);
    return false;
  }

  if (this.isTokenExpired(token)) {
    console.log('AuthGuard: Token expired. Redirecting to login...');
    localStorage.removeItem('JWT');  
    console.debug("JWT Removed:", localStorage.getItem('JWT')); 
    this.router.navigate(['']);
    return false;
  }

  console.log('AuthGuard: Token valid. Access granted.');
  return true;
}

private isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode payload
    const expiry = payload.exp * 1000;  // Convert to milliseconds    
    return expiry < Date.now();  // Check if token is expired
  } catch (e) {
    console.error('AuthGuard: Error decoding token', e);
    return true;  // Consider invalid if decoding fails
  }
}
}