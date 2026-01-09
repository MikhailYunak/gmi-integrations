import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiKit } from '@gmi-integrations/ui-kit';

@Component({
  imports: [RouterModule, UiKit],
  selector: 'gmi-root',
  template: `
    <h1 class="text-3xl font-bold underline">Hello world!</h1>
    <ui-kit />
    <router-outlet></router-outlet>
  `,
})
export class App {}
