export interface EmailConfiguration {
  appMailerConfig: {
    senderAddress: {
      address: string;
      name: string;
    },
    smtpSettings: {
      hostName: string;
      port: number;
      security: string;
      username: string;
    }
  };
}
