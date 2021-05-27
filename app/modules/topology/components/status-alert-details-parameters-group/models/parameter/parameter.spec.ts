import StringParameter from './parameter-type/string-parameter';

describe('Parameter', () => {
  it('should create an instance', () => {
    expect(new StringParameter(undefined, undefined)).toBeTruthy();
  });
});
