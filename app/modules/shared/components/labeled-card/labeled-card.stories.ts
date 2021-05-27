import { moduleMetadata } from '@storybook/angular';
import { LabeledCardComponent } from './labeled-card.component';
import { CardComponent } from '../card/card.component';

export default {
  title: 'Shared/Labeled Card',

  decorators: [
    moduleMetadata({
      declarations: [CardComponent, LabeledCardComponent],
    }),
  ],
};

export const Default = () => ({
  props: {},
  component: LabeledCardComponent,
  template: `
      <nx-labeled-card
        [body]="body"
        [title]="'This is the title'"
      >
      </nx-labeled-card>
      <ng-template #body>
        <div>Body content</div>
      </ng-template>
    `,
});

Default.story = {
  name: 'default',
};
