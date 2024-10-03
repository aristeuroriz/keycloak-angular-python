import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IUser, UserService } from '../services/user.service';
import { AxiosService } from '../services/axios.service';
import { AxiosInstance } from 'axios';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  currentUser$: IUser | null = null;
  axiosInstance: AxiosInstance;
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly axiosService: AxiosService
  ) {
    this.axiosInstance = this.axiosService.getAxiosInstance();
  }

  ngOnInit(): void {
    this.fetchCurrentUser();
  }

  fetchCurrentUser() {
    this.userService.currentUser().subscribe((user) => {
      this.currentUser$ = user;
      console.log('Usuário atual:', this.currentUser$);
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
