// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {


//   private baseUrl = 'http://localhost:8080/auth';

//   constructor(private http: HttpClient) { }

 

//   login(credentials: {username:string;password:string}): Observable<any> {
//     return this.http.post(`${this.baseUrl}/login`, credentials,{responseType:'json'});
//   }

//   // login(credentials: { username: string; password: string }): Observable<string> {
//   //   return this.http.post(`${this.baseUrl}/login`, credentials, { responseType: 'text' });
//   // }

//   // This function would be used in other components to get the token from localStorage
//   getToken(): string | null {
//     return localStorage.getItem('JWT');
//   }
  
  
// }



import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth'; // Backend API Base URL

  constructor(private http: HttpClient) {}

  // ✅ Login API Call
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  // ✅ Save Tokens
  storeTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('JWT', accessToken);
    localStorage.setItem('REFRESH_TOKEN', refreshToken);
  }
  

  // ✅ Get Access Token
  getToken(): string | null {
    return localStorage.getItem('JWT');
  }

  // ✅ Get Refresh Token
  getRefreshToken(): string | null {
    return localStorage.getItem('REFRESH_TOKEN');
  }
  

  // ✅ Refresh Token API Call
  refreshAccessToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http.post(`${this.baseUrl}/refresh`, { refreshToken });
  }

  // ✅ Logout
  logout(): void {
    localStorage.removeItem('JWT');
    localStorage.removeItem('REFRESH_TOKEN');
  }
}
