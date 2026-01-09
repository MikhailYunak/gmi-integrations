import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'gmi-root',
  template: `
    welcom
    <router-outlet></router-outlet>
  `,
})
export class App {}
