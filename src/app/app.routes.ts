import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { OfertasComponent } from './pages/ofertas/ofertas.component';  import { DetalleComponent } from './pages/detalle/detalle.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'ofertas', component: OfertasComponent },  
  { path: 'producto/:id', component: DetalleComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: '**', component: NotFoundComponent }
];
