
export default class NxResponseUtil {
  static parseErrorMessage(message: {error?: { userMessage: string, message: string }, message: string}): string {
    if (message.error && (message.error.userMessage || message.error.message)) {
      return message.error.userMessage || message.error.message;
    }
    return message.message;
  }
}

