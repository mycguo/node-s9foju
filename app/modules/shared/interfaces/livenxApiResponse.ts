/**
 * LivenxApiResponse
 *
 * @author Ryne Okimoto
 * @description Base properties for a LiveNX REST API response
 */
export interface LivenxApiResponse {
  meta: {
    href: string,
    http: {
      method: string,
      statusCode: number,
      statusReason: string
    }
  };
}
