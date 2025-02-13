import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "./component/navbar/navbar.component";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptor/auth-interceptor.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    ReactiveFormsModule,
    CommonModule, NavbarComponent],

    providers: [
      { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'userform';

  constructor(private router: Router) {}

  //  Hide navbar on the login page
  shouldShowNavbar(): boolean {
    return this.router.url !== '/';  // Hide navbar on "/login" route
  }

  shouldShowForm(): boolean {
    return this.router.url !== '/form';  // Hide navbar on "/form" route
  }
}
