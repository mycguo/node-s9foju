interface ReportResponseMeta {
 href: string;
 http: {method: string, statusCode: number, statusReason: string};
 queryParameters?: Array<any>;
}

export default ReportResponseMeta;
