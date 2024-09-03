import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AxiosService {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  constructor(private keycloakService: KeycloakService) {
    // Cria uma instância Axios com configurações padrão
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:8080', // Defina a URL base da API
      timeout: 10000, // Timeout de 10 segundos
    });

    // Adicionar interceptores de requisição e resposta
    this.initializeRequestInterceptor();
    this.initializeResponseInterceptor();
  }

  // Método para configurar o interceptor de requisição
  private initializeRequestInterceptor(): void {
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // Obter um novo token ou substituir o token se houver alteração
        this.replaceToken();
        if (this.token) {
          config.headers['Authorization'] = `Bearer ${this.token}`; // Adicionar o token ao cabeçalho Authorization
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  // Método para configurar o interceptor de resposta
  private initializeResponseInterceptor(): void {
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error(
          'Erro na requisição à API:',
          error.response || error.message
        );
        return Promise.reject(error);
      }
    );
  }

  // Método para substituir o token do Keycloak quando houver alteração
  private replaceToken(): void {
    const token = sessionStorage.getItem('token');
    if (token != this.token || !this.token) {
      this.token = token;
    }
  }

  // Método para obter a instância configurada do Axios
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  // Método para obter o token do Keycloak
  getToken(): string | null {
    return this.token;
  }
}
