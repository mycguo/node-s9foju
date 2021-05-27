export interface PasswordPolicy {
  passwordLifetime: number;
  passwordChangeRestrictionPeriod: number;
  maxStoredPreviousPasswords: number;
}
