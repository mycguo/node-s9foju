import { TextDrillDownComponent } from './text-drill-down.component';

export default {
  title: 'Shared/Text Drill Down',
};

export const Base = () => {
  return {
    component: TextDrillDownComponent,
    props: {
      text: 'Peek',
      link: '/',
    },
    moduleMetadata: {
      declarations: [TextDrillDownComponent],
    },
  };
};
