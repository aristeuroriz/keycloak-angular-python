import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  async fetchData() {
    try {
      const data = await this.apiService.getProtectedData();
      console.log('Dados protegidos:', data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
