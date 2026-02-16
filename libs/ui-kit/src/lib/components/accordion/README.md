# Accordion

The accordion component allows the user to show and hide sections of related content.

## Import

```ts
import { UiAccordion, UiAccordionBody, UiAccordionHeader, UiAccordionItem } from '@gmi-integrations/ui-kit';
```

## Basic Usage

```html
<ui-accordion [multi]="true" [enableAnimations]="false">
    @for (item of items; track item; let index = $index) {
        <ui-accordion-item #accordionItem="uiAccordionItem">
            <ui-accordion-header [index]="index" [expanded]="accordionItem.expanded" (click)="accordionItem.toggle()">
                {{ item }}
            </ui-accordion-header>
            <ui-accordion-body [index]="index">
                Lorem ipsum dolor, sit amet, consectetur adipisicing elit. Perferendis excepturi incidunt ipsum
                deleniti labore, tempore non nam doloribus blanditiis veritatis illo autem iure aliquid ullam
                rem tenetur deserunt velit culpa?
            </ui-accordion-body>
        </ui-accordion-item>
    }
</ui-accordion>
```

## API

### UiAccordion

Selector: `ui-accordion`

| Input | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `multi` | `boolean` | No | `false` | Whether multiple accordion items can be open at the same time. |
| `enableAnimations` | `boolean` | No | `true` | Whether to enable expansion animations. |

### UiAccordionItem

Selector: `ui-accordion-item`

| Property | Type | Description |
| --- | --- | --- |
| `expanded` | `boolean` | Whether the accordion item is expanded. |

| Method | Description |
| --- | --- |
| `toggle()` | Toggles the expanded state of the accordion item. |
| `open()` | Opens the accordion item. |
| `close()` | Closes the accordion item. |

### UiAccordionHeader

Selector: `ui-accordion-header`

| Input | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `expanded` | `boolean` | Yes | - | Whether the associated accordion item is expanded. |
| `index` | `number` | Yes | - | The index of the accordion item. Used for ARIA attributes. |

### UiAccordionBody

Selector: `ui-accordion-body`

| Input | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `index` | `number` | Yes | - | The index of the accordion item. Used for ARIA attributes. |
