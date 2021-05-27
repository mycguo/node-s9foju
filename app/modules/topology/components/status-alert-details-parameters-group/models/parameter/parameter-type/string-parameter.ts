import Parameter from '../parameter';

export default class StringParameter implements Parameter<string> {
  constructor(public key: string,
              public value: string) {
  }
}
