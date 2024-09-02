import { Injectable } from '@angular/core';
import { AxiosService } from './axios.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private axiosService: AxiosService) {}

  async getProtectedData(): Promise<any> {
    const axiosInstance = this.axiosService.getAxiosInstance();
    const response = await axiosInstance.get('/protected');
    return response.data;
  }
}
