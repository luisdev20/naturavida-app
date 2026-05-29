import { Component, OnInit, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { ProductoService } from '../../core/services/producto.service';
import { AuthService } from '../../core/services/auth.service';
import { Producto } from '../../core/models/producto.model';
import { ItemCarrito } from '../../core/models/carrito.model';
import { Usuario } from '../../core/models/usuario.model';

import { environment } from '../../../environments/environment';

export type Vista = 'overview' | 'productos' | 'carritos';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  private productoService = inject(ProductoService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  private apiBase = environment.apiUrl;

 
  adminNombre = '';

 
  vistaActual: Vista = 'overview';

 
  cargandoMetricas = true;
  totalProductos = 0;
  totalUsuarios = 0;
  totalItemsCarrito = 0;
  valorInventario = 0;
  productoMasCaro: Producto | null = null;
  productoMasBarato: Producto | null = null;
  carritoMasGrande: { usuarioId: number; total: number } | null = null;
  distribucionCategorias: { nombre: string; cantidad: number; porcentaje: number }[] = [];

 
  productos: Producto[] = [];
  cargandoProductos = true;
  mostrarFormulario = false;
  editando = false;
  form: Producto = this.productoVacio();
  toast = { visible: false, mensaje: '', tipo: 'ok' };

  categorias = ['capilar', 'piel', 'insumos'] as const;
  marcas = ['BioNatur', 'AlmaVerde', 'TerraVital'] as const;

 
  todosItemsCarrito: ItemCarrito[] = [];
  cargandoCarritos = true;
  carritosAgrupados: { usuarioId: number; items: ItemCarrito[]; total: number }[] = [];

 

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }
    const user = this.authService.currentUser();
    this.adminNombre = user?.nombre ?? 'Administrador';
    this.cargarDatos();
  }

  navegar(vista: Vista): void {
    this.vistaActual = vista;
    if (vista === 'productos' && this.productos.length === 0) this.cargarProductos();
    if (vista === 'carritos' && this.todosItemsCarrito.length === 0) this.cargarCarritos();
  }

 

  cargarDatos(): void {
    this.cargandoMetricas = true;
    forkJoin({
      productos: this.http.get<Producto[]>(`${this.apiBase}/productos`),
      usuarios: this.http.get<Usuario[]>(`${this.apiBase}/usuarios`),
      carrito: this.http.get<ItemCarrito[]>(`${this.apiBase}/carrito`)
    }).subscribe({
      next: ({ productos, usuarios, carrito }) => {
        this.zone.run(() => {
          this.calcularMetricas(productos, usuarios, carrito);
          this.productos = productos;
          this.cargandoProductos = false;
          this.cargandoMetricas = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.cargandoMetricas = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  calcularMetricas(productos: Producto[], usuarios: Usuario[], carrito: ItemCarrito[]): void {
    this.totalProductos = productos.length;
    this.totalUsuarios = usuarios.length;
    this.totalItemsCarrito = carrito.reduce((s, i) => s + i.cantidad, 0);
    this.valorInventario = productos.reduce((s, p) => s + p.precio, 0);

    if (productos.length > 0) {
      this.productoMasCaro = productos.reduce((a, b) => b.precio > a.precio ? b : a);
      this.productoMasBarato = productos.reduce((a, b) => b.precio < a.precio ? b : a);
    }

   
    const cats: Record<string, number> = {};
    productos.forEach(p => cats[p.categoria] = (cats[p.categoria] ?? 0) + 1);
    this.distribucionCategorias = Object.entries(cats).map(([nombre, cantidad]) => ({
      nombre,
      cantidad,
      porcentaje: Math.round((cantidad / productos.length) * 100)
    }));

   
    const porUsuario: Record<number, number> = {};
    carrito.forEach(i => porUsuario[i.usuarioId] = (porUsuario[i.usuarioId] ?? 0) + i.cantidad);
    const entradas = Object.entries(porUsuario);
    if (entradas.length > 0) {
      const [uid, total] = entradas.reduce((a, b) => +b[1] > +a[1] ? b : a);
      this.carritoMasGrande = { usuarioId: +uid, total: +total };
    }
  }

  cargarProductos(): void {
    this.cargandoProductos = true;
    this.productoService.getProductos().subscribe({
      next: p => this.zone.run(() => {
        this.productos = p;
        this.cargandoProductos = false;
        this.cdr.detectChanges();
      })
    });
  }

  cargarCarritos(): void {
    this.cargandoCarritos = true;
    this.http.get<ItemCarrito[]>(`${this.apiBase}/carrito`).subscribe({
      next: items => this.zone.run(() => {
        this.todosItemsCarrito = items;
        const mapa: Record<number, ItemCarrito[]> = {};
        items.forEach(i => {
          if (!mapa[i.usuarioId]) mapa[i.usuarioId] = [];
          mapa[i.usuarioId].push(i);
        });
        this.carritosAgrupados = Object.entries(mapa).map(([uid, items]) => ({
          usuarioId: +uid,
          items,
          total: items.reduce((s, i) => s + i.precio * i.cantidad, 0)
        }));
        this.cargandoCarritos = false;
        this.cdr.detectChanges();
      }),
      error: () => this.zone.run(() => {
        this.cargandoCarritos = false;
        this.cdr.detectChanges();
      })
    });
  }

 

  productoVacio(): Producto {
    return { nombre: '', detalle: '', precio: 0, categoria: 'capilar', marca: 'BioNatur', imagen: '', descripcion: '', modoUso: '', ingredientes: '' };
  }

  abrirNuevo(): void {
    this.form = this.productoVacio();
    this.editando = false;
    this.mostrarFormulario = true;
  }

  editarProducto(p: Producto): void {
    this.form = { ...p };
    this.editando = true;
    this.mostrarFormulario = true;
  }

  guardar(): void {
    if (!this.form.nombre || !this.form.precio) {
      this.mostrarToast('Completa los campos obligatorios.', 'error');
      return;
    }
    const accion = this.editando && this.form.id
      ? this.productoService.updateProducto(this.form.id, this.form)
      : this.productoService.addProducto(this.form);

    accion.subscribe({
      next: () => {
        this.mostrarToast(this.editando ? 'Producto actualizado' : 'Producto agregado', 'ok');
        this.cancelar();
        this.cargarProductos();
      },
      error: () => this.mostrarToast('Error al guardar.', 'error')
    });
  }

  eliminar(p: Producto): void {
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    this.productoService.deleteProducto(p.id!).subscribe({
      next: () => {
        this.mostrarToast('Producto eliminado', 'ok');
        this.cargarProductos();
      }
    });
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.form = this.productoVacio();
  }

  mostrarToast(mensaje: string, tipo: 'ok' | 'error'): void {
    this.toast = { visible: true, mensaje, tipo };
    setTimeout(() => this.toast = { visible: false, mensaje: '', tipo: 'ok' }, 2800);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
