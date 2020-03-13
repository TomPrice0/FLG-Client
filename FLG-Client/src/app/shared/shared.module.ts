import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { HighlightPipe } from './highlight.pipe';
import { UniquePipe } from './unique.pipe';
import { FooterComponent } from './footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TagInputModule,
  ],
  declarations: [
    HighlightPipe,
    UniquePipe,
    FooterComponent
  ],
  exports: [
    TagInputModule,
    CommonModule,
    HighlightPipe,
    FormsModule,
    UniquePipe,
    FooterComponent,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
