import { Component, OnInit, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../core/services/producto.service';
import { CarritoService } from '../../core/services/carrito.service';
import { Producto } from '../../core/models/producto.model';

@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.css']
})
export class OfertasComponent implements OnInit {
  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  productosOferta: (Producto & { descuento: number; precioOriginal: number })[] = [];
  cargando = true;
  fechaActual = new Date();

  calcularPrecioConDescuento(precio: number, descuento: number): number {
    return precio - (precio * descuento / 100);
  }

  ngOnInit(): void {
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.zone.run(() => {
          this.productosOferta = productos
            .filter((_, index) => index % 3 === 0 || index % 5 === 0)
            .map(p => ({
              ...p,
              descuento: Math.floor(Math.random() * (40 - 10 + 1) + 10),
              precioOriginal: p.precio
            }));
          this.cargando = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.cargando = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  agregarAlCarrito(producto: Producto, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.carritoService.agregarItem(producto).subscribe();
  }
}