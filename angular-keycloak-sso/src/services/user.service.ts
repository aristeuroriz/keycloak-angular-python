import { Injectable } from '@angular/core';
import { AxiosService } from './axios.service';
import { Observable } from 'rxjs';

export interface IUser {
  // sub: string;
  // email_verified: boolean;
  name: string; // Nome completo
  preferred_username: string; // Matricula
  given_name: string; // Nome
  family_name: string; // Sobrenome
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly axiosInstance;
  current_user$ = this.currentUser;

  constructor(private readonly axiosService: AxiosService) {
    this.axiosInstance = this.axiosService.getAxiosInstance();
  }

  currentUser(): Observable<IUser> {
    return new Observable((observer) => {
      this.axiosInstance
        .get('/current_user')
        .then((res) => {
          observer.next(res.data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
