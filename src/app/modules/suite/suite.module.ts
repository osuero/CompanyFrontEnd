import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SuiteComponent } from './suite.component';
import { SuiteListComponent } from './list/list.component';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { MatTabsModule } from '@angular/material/tabs';
import { SuiteRoutes } from './suite.routing';

@NgModule({
  declarations: [
    SuiteListComponent
  ],
  imports: [
    RouterModule.forChild(SuiteRoutes),
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatTooltipModule,
    FuseFindByKeyPipeModule,
    SharedModule,
    MatTabsModule
  ]
  
})
export class SuiteModule { 


  
}
