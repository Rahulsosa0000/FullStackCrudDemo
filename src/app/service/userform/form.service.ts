import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient,private router:Router) {}

  //  Token Get
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('JWT'); 
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Save User 
  // saveUser(user: any): Observable<any> {
  //   const token = localStorage.getItem('JWT');
  //   if (!token) {
  //     alert('Please log in first');
  //     this.router.navigate(['/']);
  //   }
  //   return this.http.post(`${this.baseUrl}/add`, user, { headers: this.getAuthHeaders() });
  // }
  

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`, { headers: this.getAuthHeaders() });
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  updateUser(id: number, userData: any): Observable<any> {
    console.log("Updating User with ID:", id); 
    return this.http.put(`${this.baseUrl}/update/${id}`, userData, { 
      headers: this.getAuthHeaders() 
    });
  }
  

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { 
      headers: this.getAuthHeaders(), 
      responseType: 'text' 
    });
  }
   
} 