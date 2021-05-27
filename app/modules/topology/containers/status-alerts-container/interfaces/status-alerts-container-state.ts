import FilterGeneratorResult from '../../../../../../../../client/nxComponents/components/laFilterGeneratorWidget/filterResults/filterGeneratorResult';

export default interface StatusAlertsContainerState {
  updateCallback: Date;
  filters: FilterGeneratorResult[];
  historical: boolean;
}
