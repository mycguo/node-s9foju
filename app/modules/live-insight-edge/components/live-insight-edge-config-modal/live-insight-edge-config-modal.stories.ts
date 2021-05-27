import { moduleMetadata } from '@storybook/angular';
import { LiveInsightEdgeConfigModalComponent } from './live-insight-edge-config-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { Component } from '@angular/core';
import { action } from '@storybook/addon-actions';
import { timeout } from 'rxjs/operators';
import AnalyticsPlatformModel from '../../../integrations/components/analytics-platform/analytics-platform.model';
import { IntegrationsModule } from '../../../integrations/integrations.module';

@Component({
  selector: 'nx-live-insight-edge-config-modal-mock-container',
  template: `
    <nx-live-insight-edge-config-modal
      [configData]="state.configData"
      [configSubmitIsLoading]="state.submitIsLoading"
      (cancelConfigModalClick)="handleCancelConfigModalClick()"
      (submitConfigClick)="handleSubmitConfigClick($event)"
    ></nx-live-insight-edge-config-modal>
  `,
})
class LiveInsightEdgeConfigModalMockContainer {
  private state = {
    submitIsLoading: false,
    configData: <AnalyticsPlatformModel>{
      hostname: '10.0.0.0',
      port: 54343,
    },
  };

  handleCancelConfigModalClick() {
    action('cancel click');
  }

  handleSubmitConfigClick(liveInsightEdgeConfig) {
    action(`submit click ${JSON.stringify(liveInsightEdgeConfig)}`);
    this.state.submitIsLoading = true;
    setTimeout(() => {
      this.state.submitIsLoading = false;
    }, 4000);
  }
}

export default {
  title: 'LiveInsightEdge/LiveInsightEdgeConfigModalComponent',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule, IntegrationsModule],
      declarations: [LiveInsightEdgeConfigModalComponent],
    }),
  ],
};

export const Default = () => ({
  component: LiveInsightEdgeConfigModalComponent,
});

Default.story = {
  name: 'default',
};
