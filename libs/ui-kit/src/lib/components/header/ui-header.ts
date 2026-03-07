import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

/**
 * Header Component
 *
 * Usage:
 * <ui-header>
 *   <ng-container slot="start">Logo</ng-container>
 *   <ng-container slot="center">Nav</ng-container>
 *   <ng-container slot="end">Actions</ng-container>
 * </ui-header>
 */
@Component({
  selector: 'ui-header',
  template: `
    <div class="ui-header-start">
      <ng-content select="[slot=start]" />
    </div>
    <div class="ui-header-center">
      <ng-content select="[slot=center]" />
    </div>
    <div class="ui-header-end">
      <ng-content select="[slot=end]" />
    </div>
  `,
  host: {
    class: 'ui-header',
    role: 'banner',
  },
  styleUrl: './ui-header.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiHeader {}
