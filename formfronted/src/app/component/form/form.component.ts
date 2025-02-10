import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormService } from '../../service/userform/form.service';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {

  form: FormGroup;
  zipFileError: string = '';
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder, 
    private formService: FormService,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      userType: ['', Validators.required]
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.name.endsWith('.zip')) {
        this.selectedFile = file;
        this.zipFileError = '';
      } else {
        this.selectedFile = null;
        this.zipFileError = 'Only .zip files are allowed';
      }
    }
  }

  // submit() {
  //   if (this.form.valid) {
  //     this.formService.saveUser(this.form.value).subscribe({
  //       next: (response) => {
  //         console.log('User added successfully:', response);
  //         alert('User added successfully!');
  //         this.form.reset();
  //         this.router.navigate(['/dashboard']); // Dashboard pe redirect karna
  //       },
  //       error: (error) => {
  //         console.error('Error adding user:', error);
  //         alert('Error adding user. Please try again.');
  //       }
  //     });
  //   } else {
  //     this.form.markAllAsTouched();
  //     alert('Please fill all required fields.');
  //   }
  // }

  
  

//   submit() {
//     if (!this.form.valid) {
//       this.form.markAllAsTouched();
//       alert('Please fill all required fields.');
//       return;
//     }

//     if (!this.selectedFile) {
//       alert('Please upload a ZIP file.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('name', this.form.get('name')?.value);
//     formData.append('email', this.form.get('email')?.value);
//     formData.append('password', this.form.get('password')?.value);
//     formData.append('phone', this.form.get('phone')?.value);
//     formData.append('dob', this.form.get('dob')?.value);
//     formData.append('gender', this.form.get('gender')?.value);
//     formData.append('address', this.form.get('address')?.value);
//     formData.append('userType', this.form.get('userType')?.value);
//     formData.append('file', this.selectedFile);

//     this.http.post('http://localhost:8080/api/files/upload', formData, { responseType: 'text' })
//       .subscribe({
//         next: (response) => {
//           console.log('Form and file uploaded successfully:', response);
//           alert('Form and ZIP file uploaded successfully!');
//           this.form.reset();
//           this.selectedFile = null;
//           this.router.navigate(['/dashboard']);
//         },
//         error: (error) => {
//           console.error('Error submitting form and file:', error);
//           alert('Error submitting form and file. Please try again.');
//         }
//       });
//   }
// }

submit() {
  if (!this.form.valid) {
    this.form.markAllAsTouched();
    alert('Please fill all required fields.');
    return;
  }

  if (!this.selectedFile) {
    alert('Please upload a ZIP file.');
    return;
  }

  const formData = new FormData();
  formData.append('name', this.form.get('name')?.value);
  formData.append('email', this.form.get('email')?.value);
  formData.append('password', this.form.get('password')?.value);
  formData.append('phone', this.form.get('phone')?.value);
  formData.append('dob', this.form.get('dob')?.value);
  formData.append('gender', this.form.get('gender')?.value);
  formData.append('address', this.form.get('address')?.value);
  formData.append('userType', this.form.get('userType')?.value);
  formData.append('file', this.selectedFile); // Send ZIP file

  this.http.post('http://localhost:8080/api/files/upload', formData, { responseType: 'text' })
    .subscribe({
      next: (response) => {
        console.log('Form and file uploaded successfully:', response);
        alert('Form and ZIP file uploaded successfully!');
        this.form.reset();
        this.selectedFile = null;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error submitting form and file:', error);
        alert('Error submitting form and file. Please try again.');
      }
    });
}
}
