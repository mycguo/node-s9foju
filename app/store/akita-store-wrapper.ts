import DetailedError from '../modules/shared/components/loading/detailed-error';

export default interface AkitaStoreWrapper {
  loading: boolean;
  error?: DetailedError;
}
