import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CarritoService } from '../../core/services/carrito.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private carritoService = inject(CarritoService);
  private router = inject(Router);

  email = '';
  password = '';
  error = '';
  cargando = false;

  login(): void {
    if (!this.email || !this.password) {
      this.error = 'Completa todos los campos.';
      return;
    }
    this.cargando = true;
    this.error = '';
    this.authService.login(this.email, this.password).subscribe({
      next: users => {
        this.cargando = false;
        if (users.length === 0) {
          this.error = 'Correo o contraseña incorrectos.';
          return;
        }
        const user = users[0];
        const destino = user.rol === 'admin' ? ['/admin'] : ['/'];
        if (user.id) {
          this.carritoService.sincronizarCarrito(user.id).subscribe({
            next: () => this.router.navigate(destino),
            error: () => this.router.navigate(destino)
          });
        } else {
          this.router.navigate(destino);
        }
      },
      error: () => {
        this.cargando = false;
        this.error = 'Error de conexión. ¿Está json-server corriendo?';
      }
    });
  }
}
