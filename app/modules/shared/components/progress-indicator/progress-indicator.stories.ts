import { MatProgressBarModule } from '@angular/material/progress-bar';
import { moduleMetadata } from '@storybook/angular';
import { SharedModule } from '../../shared.module';

const baseMarkdown = require('./notes/base.notes.md');

export default {
  title: 'Shared/Progress Indicator',
  decorators: [
    moduleMetadata({ imports: [SharedModule, MatProgressBarModule] }),
  ],
};

export const Base = () => ({
  template: `
        <nx-card [headerTitle]="'Card Usage'" [footer]="footer">
          <ng-template #footer>
            <nx-progress-indicator></nx-progress-indicator>
          </ng-template>
        </nx-card>
      `,
});

Base.story = {
  parameters: { notes: { markdown: baseMarkdown } },
};
