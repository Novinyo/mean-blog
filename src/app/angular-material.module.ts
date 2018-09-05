import { NgModule } from '@angular/core';

import { MatInputModule, MatCardModule,
    MatButtonModule, MatToolbarModule,
     MatPaginatorModule, MatExpansionModule, 
     MatProgressSpinnerModule, MatDialogModule } from '@angular/material';
@NgModule({
    exports: [
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatDialogModule
    ],
    declarations: [],
    providers: [],
})
export class AngularMaterialModule { }
