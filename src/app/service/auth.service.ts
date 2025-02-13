import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth'; // Backend API Base URL

  constructor(private http: HttpClient) {}

  // Login API Call
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  //  Save Tokens
  storeTokens(accessToken: string, refreshToken: string) {
    console.log('Saving Tokens:', accessToken, refreshToken); // Debugging
    localStorage.setItem('JWT', accessToken);
    localStorage.setItem('REFRESH_TOKEN', refreshToken);
  }

  //  Get Access Token
  getToken(): string | null {
    return localStorage.getItem('JWT');
  }

  //  Get Refresh Token
  getRefreshToken(): string | null {
    return localStorage.getItem('REFRESH_TOKEN');
  }

  // Refresh Token API Call
  refreshAccessToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    console.log('Sending Refresh Token:', refreshToken); // Debugging
    return this.http.post(`${this.baseUrl}/refresh`, { refreshToken }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  //  Logout
  logout(): void {
    console.log('Logging Out & Clearing Tokens');
    localStorage.removeItem('JWT');
    localStorage.removeItem('REFRESH_TOKEN');
  }
}