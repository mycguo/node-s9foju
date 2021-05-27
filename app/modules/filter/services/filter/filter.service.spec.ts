import { TestBed } from '@angular/core/testing';

import { FilterService } from './filter.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerTestingModule } from '../../../logger/logger-testing/logger-testing.module';
import LaFilterSupportEnums from '../../../../../../../project_typings/enums/laFilterSupportEnums';
import { FilterEntity } from '../../interfaces/filter-entity';
import { FilterValue } from '../../interfaces/filter-value';
import { FilterColumnValues } from '../../interfaces/filter-column-values';
import { FilterColumn } from '../../interfaces/filter-column';

describe('FilterService', () => {
  let service: FilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ]
    });
    service = TestBed.inject(FilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('buildFlexSearchString', () => {
    it('should return valid flex string', () => {
      const filterAndStrings: { filter: FilterValue, string: string }[] = [
        // invalid filters
        {
          filter: null,
          string: ''
        },
        {
          filter: void 0,
          string: ''
        },
        {
          filter: {},
          string: ''
        },
        {
          filter: {
            [<LaFilterSupportEnums>'fakeId']: ['FakeId']
          },
          string: ''
        },
        // valid filters
        {
          filter: {
            [LaFilterSupportEnums.SITE]: ['Site1']
          },
          string: 'site = "Site1"'
        },
        {
          filter: {
            [LaFilterSupportEnums.SITE]: ['Site1', 'Site2'],
            [LaFilterSupportEnums.DEVICE]: ['Device1']
          },
          string: '(site = "Site1" | site = "Site2") & device = "Device1"'
        },
      {
        filter: {
          [LaFilterSupportEnums.DEVICE_INTERFACE_GROUP]: ['Device1___Interface1']
        },
        string: '((device = "Device1" & interface = "Interface1"))'
      },
        {
          filter: {
            [LaFilterSupportEnums.INTERFACE_TYPE]: ['wan', 'xcon']
          },
          string: '(wan | xcon)'
        },
        {
          filter: {
            [LaFilterSupportEnums.TIME_WINDOW]: ['enable'],
            [LaFilterSupportEnums.SITE]: ['Site1']
          },
          string: 'site = "Site1"'
        },
        // valid filter which not resolves to flex string
        {
          filter: {
            [LaFilterSupportEnums.TIME_WINDOW]: ['enable']
          },
          string: ''
        },
        // filters with operators
        {
          filter: {
            [LaFilterSupportEnums.SLA_CLASS]: ['slaClass1']
          },
          string: 'bfd.slaClass = "slaClass1"'
        },
        {
          filter: {
            [LaFilterSupportEnums.SLA_CLASS]: ['=___slaClass1']
          },
          string: 'bfd.slaClass = "slaClass1"'
        },
        {
          filter: {
            [LaFilterSupportEnums.SLA_CLASS]: ['!=___slaClass1']
          },
          string: 'bfd.slaClass != "slaClass1"'
        },
        {
          filter: {
            [LaFilterSupportEnums.SLA_CLASS]: ['=___slaClass1', '=___slaClass2']
          },
          string: '(bfd.slaClass = "slaClass1" | bfd.slaClass = "slaClass2")'
        },
        {
          filter: {
            [LaFilterSupportEnums.SLA_CLASS]: ['!=___slaClass1', '!=___slaClass2']
          },
          string: '(bfd.slaClass != "slaClass1" & bfd.slaClass != "slaClass2")'
        }
      ];
      filterAndStrings.forEach(entry => {
        const flexString = service.buildFlexSearchString(entry.filter);
        expect(flexString).toEqual(entry.string);
      });
    });
  });

  describe('buildFilterValueFromSearchString', () => {
    it('should return valid FilterValues', () => {
      const stringAndFilters: {string: string, filter: FilterValue}[] = [
        {
          string: 'site="Berlin"',
          filter: {
            site: ['Berlin']
          }
        },
        {
          string: 'flow.ip.site.src="Berlin"',
          filter: {
            'flow.ip.site.src': ['=___Berlin']
          }
        },
        {
          string: 'flow.ip.site.src!="Berlin"',
          filter: {
            'flow.ip.site.src': ['!=___Berlin']
          }
        },
        {
          string: 'site="Berlin"&(device="C3850-A-15"|device="C3850-A-14"|device=ISR-4331-A-19.liveaction.com)&wan="wan"&((device = "livewire" & interface = "eth3") | (device = "LondonEdge" & interface = "ge0/5"))',
          filter: {
            'site': ['Berlin'],
            'device': [
              'C3850-A-15',
              'C3850-A-14',
              'ISR-4331-A-19.liveaction.com'],
            'interfaceType': ['wan'],
            'interfaceAndDevice': [
              'livewire___eth3',
              'LondonEdge___ge0/5'
            ]
          }
        },
        {
          string: 'bfd.slaClass="SlaClass1"',
          filter: {
            'bfd.slaClass': ['=___SlaClass1']
          }
        },
        {
          string: 'bfd.slaClass != "SlaClass1"',
          filter: {
            'bfd.slaClass': ['!=___SlaClass1']
          }
        },
        {
          string: '(bfd.slaClass != "SlaClass1" & bfd.slaClass != "SlaClass2")',
          filter: {
            'bfd.slaClass': ['!=___SlaClass1', '!=___SlaClass2']
          }
        },
        // invalid filters
        {
          string: '',
          filter: {}
        },
        {
          string: 'site=',
          filter: {}
        }
      ];
      stringAndFilters.forEach(entry => {
        const filter = service.buildFilterValueFromSearchString(entry.string);
        expect(filter).toEqual(jasmine.objectContaining(entry.filter));
      });
    });
  });

  describe('getConcatenationOperator', () => {
    it('should return valid operator', () => {
      expect(FilterService.getConcatenationOperator('=')).toEqual(' | ');
      expect(FilterService.getConcatenationOperator('!=')).toEqual(' & ');
    });
  });

  describe('filterSelectedOptions', () => {
    it('should return filtered options', () => {
      const selectedItem: FilterEntity = {
        id: LaFilterSupportEnums.SITE,
        name: 'Site',
        children: [
          {id: 'Berlin', name: 'Berlin'}
        ]
      };
      const options: FilterColumnValues[] = [
        {id: 'Berlin', name: 'Berlin'},
        {id: 'Amsterdam', name: 'Amsterdam'},
        {id: 'London', name: 'London'}
      ];
      const returnValues: FilterColumnValues[] = [
        {id: 'Amsterdam', name: 'Amsterdam'},
        {id: 'London', name: 'London'}
      ];
      expect(service.filterSelectedOptions(selectedItem, options)).toEqual(returnValues);
      expect(service.filterSelectedOptions(selectedItem, options, 'lon')).toEqual([{id: 'London', name: 'London'}]);
      expect(service.filterSelectedOptions(selectedItem, options, 'asdfg')).toEqual([]);
    });
  });

  describe('filterSelectedColumns', () => {
    it('should return filtered columns', () => {
      const items: FilterEntity[] = [
        { id: LaFilterSupportEnums.SITE, name: 'Site' },
        { id: LaFilterSupportEnums.DEVICE, name: 'Device' },
        { id: LaFilterSupportEnums.SLA_CLASS, name: 'Sla Class' }

      ];
      const columns: FilterColumn[] = [
        { id: LaFilterSupportEnums.SITE, name: 'Site' },
        { id: LaFilterSupportEnums.TAG, name: 'Tag' },
        { id: LaFilterSupportEnums.FLEX_STRING, name: 'Flex String' }
      ];
      const returnValues: FilterColumnValues[] = [
        { id: LaFilterSupportEnums.TAG, name: 'Tag', color: undefined },
        { id: LaFilterSupportEnums.FLEX_STRING, name: 'Flex String', disabled: true, color: undefined }
      ];
      expect(service.filterSelectedColumns(items, columns)).toEqual(returnValues);
      expect(service.filterSelectedColumns(items, columns, 'tag'))
        .toEqual([{ id: LaFilterSupportEnums.TAG, name: 'Tag', color: undefined }]);
      expect(service.filterSelectedColumns(items, columns, 'asdfg')).toEqual([]);
    });
  });

  describe('buildFilterValueFromFilterEntity', () => {
    it('should return valid FilterValue', () => {
      const entity: FilterEntity[] = [
        {
          id: LaFilterSupportEnums.SITE,
          name: 'Site',
          children: [
            {id: 'Berlin', name: 'Berlin'},
            {id: 'London', name: 'London'}
          ]
        },
        {
          id: LaFilterSupportEnums.SLA_CLASS,
          name: 'Sla Class',
          selectedOperator: '!=',
          children: [
            {
              id: '!=___SlaClass',
              name: 'SlaClass'
            }
          ]
        }
      ];
      const filterValue: FilterValue = {
        [LaFilterSupportEnums.SITE]: ['Berlin', 'London'],
        [LaFilterSupportEnums.SLA_CLASS]: ['!=___SlaClass']
      };
      expect(service.buildFilterValueFromFilterEntity(entity)).toEqual(filterValue);
    });
  });

  describe('operatorLookupFn', () => {
    it('should return filter values', (done) => {
      const values = ['!=___SlaClass1', '=___SlaClass2', 'SlaClass3'];
      service.operatorLookupFn(values)
        .subscribe(value => {
          expect(value).toEqual([
            {id: '!=___SlaClass1', name: 'SlaClass1'},
            {id: '=___SlaClass2', name: 'SlaClass2'},
            {id: 'SlaClass3', name: 'SlaClass3'},
          ]);
          done();
        });
    });
  });

});
