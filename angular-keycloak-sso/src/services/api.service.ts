import { Injectable } from '@angular/core';
import { AxiosService } from './axios.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private readonly axiosService: AxiosService) {}

  async getProtectedData(): Promise<any> {
    const axiosInstance = this.axiosService.getAxiosInstance();
    const response = await axiosInstance.get('/v1/indices');
    return response.data;
  }
}
