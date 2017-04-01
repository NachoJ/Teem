import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoreComponent } from './core.component';

import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { NavBarComponent } from './nav-bar/nav-bar.component';

import { CoreService } from './core.service';


@NgModule({
        imports: [
                CommonModule,
                RouterModule,
                MaterialModule.forRoot(),
                FlexLayoutModule
        ],
        declarations: [
                CoreComponent,
                NavBarComponent,
        ],
        exports: [

        ],
        providers: [
                CoreService
        ]
})
export class CoreModule { }
