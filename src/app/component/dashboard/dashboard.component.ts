import { Component, OnInit } from '@angular/core';
import { FormService } from '../../service/userform/form.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  users: any[] = [];
  userForm: FormGroup;
  selectedUser: any = null;
  filteredUsers: any[] = []; //  Filtered users list

  selectedFilter: string = ''; //  Dropdown filter type
  searchValue: string = ''; //  Search input value

  constructor(
    private fb: FormBuilder,
    private userService: FormService,
    // private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      userType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getUsers(); //  Fetch users from backend
  }

  getUsers() {
    this.userService.getAllUsers().subscribe((data: any) => {
      this.users = data;
      this.filteredUsers = [...this.users]; // Initialize filtered users
    });
  }

  editUser(user: any) {
    this.selectedUser = user;
    this.userForm.patchValue(user);
  }

  updateUser() {
    if (this.userForm.valid && this.selectedUser) {
      const updatedUser = this.userForm.value;
      updatedUser.id = this.selectedUser.id; // Ensure ID is included

      this.userService.updateUser(updatedUser.id, updatedUser).subscribe(() => {
        console.log("User updated successfully");
        this.getUsers();
        this.selectedUser = null;
        this.userForm.reset();
      });
    }
  }

  deleteUser(user: any) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(user.id).subscribe(() => {
        this.getUsers();
      });
    }
  }

  //  Apply Search
  applySearch() {
    if (!this.selectedFilter || !this.searchValue.trim()) {
      this.filteredUsers = [...this.users]; // Reset list
      return;
    }

    //  ID search backend 
    if (this.selectedFilter === 'id') {
      const id = Number(this.searchValue);
      if (isNaN(id)) {
        alert("Please enter a valid numeric ID!");
        return;
      }

      this.userService.getUserById(id).subscribe({
        next: (user) => {
          this.filteredUsers = user ? [user] : [];
        },
        error: () => {
          alert("User not found!");
          this.filteredUsers = [];
        }
      });
      return;
    }

    this.filteredUsers = this.users.filter(user => {
      const fieldValue = user[this.selectedFilter]?.toString().toLowerCase();
      return fieldValue && fieldValue.includes(this.searchValue.toLowerCase()); // 🔥 Search anywhere in string
    });
  }

  // 🔄 Reset Search
  resetSearch() {
    this.selectedFilter = '';
    this.searchValue = '';
    this.filteredUsers = [...this.users];
  }

  resetForm() {
    this.selectedUser = null;
    this.userForm.reset();
  }
}
