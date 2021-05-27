export default interface LogosConfiguration {
  limit: number;
  fileSize: number; // in bytes
  fileTypes: string[];
  ratio: {
    width: number,
    height: number
  };
}
