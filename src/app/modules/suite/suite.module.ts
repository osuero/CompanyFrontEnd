import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SuiteComponent } from './suite.component';

const suiteRoutes: Route[] = [
  {
      path     : '',
      component: SuiteComponent
  }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(suiteRoutes)
  ]
})
export class SuiteModule { }
