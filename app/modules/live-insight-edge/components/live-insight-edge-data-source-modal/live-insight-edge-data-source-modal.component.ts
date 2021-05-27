import {FormGroup, FormBuilder} from '@angular/forms';
import {Tag} from './../../../../services/tags/models/tag';
import {Component, OnDestroy} from '@angular/core';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {Observable, combineLatest, forkJoin} from 'rxjs';
import {map, take} from 'rxjs/operators';
import DetailedError from 'src/app/modules/shared/components/loading/detailed-error';
import {ServiceProvidersService} from 'src/app/services/service-providers/service-providers.service';
import {TagsService} from 'src/app/services/tags/tags.service';
import {RadioGroup} from 'src/app/modules/shared/components/form/radio-group/radio-group';
import {RadioOption} from 'src/app/modules/shared/components/form/radio-group/radio-option';
import {AnalyticsDataSourceService} from '../../services/analytics-data-source/analytics-data-source.service';
import AnalyticsDataSourceState from '../../services/analytics-data-source/analytics-data-source.state';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogComponent} from 'src/app/modules/shared/components/dialog/dialog.component';
import {HttpErrorResponse} from '@angular/common/http';
import ChipsInputMultiselectModel from 'src/app/modules/shared/components/form/chips-input/chips-input-multiselect/models/chips-input-multiselect.model';
import ChipMultiselect from 'src/app/modules/shared/components/form/chips-input/chips-input-multiselect/models/chip-multiselect';

@UntilDestroy()
@Component({
  selector: 'nx-live-insight-edge-data-source-modal',
  templateUrl: './live-insight-edge-data-source-modal.component.html',
  styleUrls: ['./live-insight-edge-data-source-modal.component.less']
})
export class LiveInsightEdgeDataSourceModalComponent extends DialogComponent<null> implements OnDestroy {

  readonly INTERFACES_KEY = 'interfaces';
  readonly INTERFACE_TAGS_KEY = 'interfaceTags';
  readonly SERVICE_PROVIDER_KEY = 'serviceProvider';

  private readonly INTERFACES_GROUP_VALUES = ['wan', 'wanAndXcon'];

  isLoading$: Observable<boolean>;
  error$: Observable<DetailedError>;
  formGroup: FormGroup;
  radioGroupModel: RadioGroup;
  interfaceTagsModel: ChipsInputMultiselectModel;
  serviceProviderModel: ChipsInputMultiselectModel;

  constructor(
    private tagsService: TagsService,
    private serviceProvidersService: ServiceProvidersService,
    private dataSourceService: AnalyticsDataSourceService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogComponent<null>>
    ) {
    super(null, dialogRef);

    this.formGroup = this.fb.group({
      [this.INTERFACES_KEY]: this.INTERFACES_GROUP_VALUES[0],
      [this.INTERFACE_TAGS_KEY]: null,
      [this.SERVICE_PROVIDER_KEY]: null
    });

    this.initModels();
    this.initObservables();
  }

  ngOnDestroy(): void {}

  get interfacesControl() {
    return this.formGroup.get(this.INTERFACES_KEY);
  }

  get interfaceTagsControl() {
    return this.formGroup.get(this.INTERFACE_TAGS_KEY);
  }

  get serviceProviderControl() {
    return this.formGroup.get(this.SERVICE_PROVIDER_KEY);
  }

  private initModels(): void {
    this.radioGroupModel = new RadioGroup([
      new RadioOption(this.INTERFACES_GROUP_VALUES[0], 'WAN'),
      new RadioOption(this.INTERFACES_GROUP_VALUES[1], 'WAN and XCon')],
      'Interfaces');

    this.interfaceTagsModel = new ChipsInputMultiselectModel({
      label: 'Interface tags',
      placeholder: 'Select interface tag',
      options: []
    });

    this.serviceProviderModel = new ChipsInputMultiselectModel({
      label: 'Service provider tags',
      placeholder: 'Select service provider tag',
      options: []
    });
  }

  private initObservables(): void {

    this.isLoading$ = combineLatest([
      this.serviceProvidersService.selectLoading(),
      this.tagsService.selectLoading(),
      this.dataSourceService.selectLoading()
    ]).pipe(
      untilDestroyed(this),
      map((loading: boolean[]) => loading.includes(true)));

    this.error$ = combineLatest([
      this.serviceProvidersService.selectError(),
      this.tagsService.selectError(),
      this.dataSourceService.selectError()
    ]).pipe(
      untilDestroyed(this),
      map((errors: DetailedError[]): DetailedError => errors.find((e: DetailedError) => e !== null) || null)
    );

    this.tagsService.selectAll()
      .pipe(
        untilDestroyed(this),
        map((tags: Tag[]) => tags.map(tag => new ChipMultiselect({name: tag.tagName})))
      )
      .subscribe((options: ChipMultiselect[]) => this.interfaceTagsModel.options = options);

    this.serviceProvidersService.selectAll()
      .pipe(
        untilDestroyed(this),
        map((providers: {id: string, name: string}[]) => providers.map(provider => {
            return new ChipMultiselect({id: provider.id, name: provider.name});
          })
        )
      )
      .subscribe((options: ChipMultiselect[]) => this.serviceProviderModel.options = options);

    this.dataSourceService.selectState()
      .pipe(untilDestroyed(this))
      .subscribe((state: AnalyticsDataSourceState) => {
        this.interfacesControl.setValue(
          state.xcon ? this.INTERFACES_GROUP_VALUES[1] : this.INTERFACES_GROUP_VALUES[0]
        );
        this.interfaceTagsControl.setValue(state.interfaceTags || []);
        this.serviceProviderControl.setValue(state.serviceProviders || []);
      });

    forkJoin([
      this.tagsService.getTags(),
      this.serviceProvidersService.getServiceProviders(),
      this.dataSourceService.getAnalyticsDataSource()
    ]).pipe(untilDestroyed(this)).subscribe();
  }

  onSubmit(): void {
    this.dataSourceService.setAnalyticsDataSource(<AnalyticsDataSourceState>{
      wan: true,
      xcon: this.interfacesControl.value === this.INTERFACES_GROUP_VALUES[1],
      interfaceTags: this.interfaceTagsControl.value,
      serviceProviders: this.serviceProviderControl.value
    })
    .pipe(take(1))
    .subscribe(
      (data: AnalyticsDataSourceState) => this.close(data),
      (error: HttpErrorResponse) => this.close(error)
    );
  }

}
