import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  }
  ,
  {
    path: 'sales',
    loadChildren: () => import('./sales/sales.module').then( m => m.SalesPageModule)
  },
  {
    path: 'biaya',
    loadChildren: () => import('./biaya/biaya.module').then( m => m.BiayaPageModule)
  },
  {
    path: 'biaya-add',
    loadChildren: () => import('./biaya-add/biaya-add.module').then( m => m.BiayaAddPageModule)
  },
  {
    path: 'biaya-edit',
    loadChildren: () => import('./biaya-edit/biaya-edit.module').then( m => m.BiayaEditPageModule)
  },
  {
    path: 'sales-cust-add',
    loadChildren: () => import('./sales-cust-add/sales-cust-add.module').then( m => m.SalesCustAddPageModule)
  },
  {
    path: 'sales-cust-edit',
    loadChildren: () => import('./sales-cust-edit/sales-cust-edit.module').then( m => m.SalesCustEditPageModule)
  },
  {
    path: 'sales-edit',
    loadChildren: () => import('./sales-edit/sales-edit.module').then( m => m.SalesEditPageModule)
  },
  {
    path: 'side-menu',
    loadChildren: () => import('./side-menu/side-menu.module').then( m => m.SideMenuPageModule)
  },
  {
    path: 'sales-history',
    loadChildren: () => import('./sales-history/sales-history.module').then( m => m.SalesHistoryPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'start',
    loadChildren: () => import('./start/start.module').then( m => m.StartPageModule)
  },
  {
    path: 'finish',
    loadChildren: () => import('./finish/finish.module').then( m => m.FinishPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
