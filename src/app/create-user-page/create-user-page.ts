import { Component, inject, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Users } from '../core/user.model';
import { UserService } from '../core/user-service';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-user-page',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './create-user-page.html',
  styleUrl: './create-user-page.scss',
})
export class CreateUserPage implements OnInit {
  username: string = '';
  password: string = '';

  register!: Users;

  private fb = inject(FormBuilder);
  private svc = inject(UserService);

  private snackBar = inject(MatSnackBar);

  createUserForm!: FormGroup;

  ngOnInit() {
    this.createForm();
  }

  createUser() {
    if (this.createUserForm.invalid) {
      console.error('Form is invalid');
      return;
    }
    this.username = this.createUserForm.value.username;
    this.password = this.createUserForm.value.password;
    this.register = {
      username: this.username,
      password: this.password,
    };

    const sub = this.svc.Register(this.register).subscribe({
      next: (response: any) => {
        console.log('User created successfully:', response);
        this.snackBar.open('✅ Data saved successfully!', 'Close', {
          duration: 3000, // 3 seconds
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.createUserForm.reset();
      },
      error: (error: any) => {
        console.error('Error creating user:', error);
        this.snackBar.open('❌ Failed to save data', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      complete: () => {
        // Unsubscribe after completion
        sub.unsubscribe();
      },
    });
  }
  createForm() {
    this.createUserForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
}
