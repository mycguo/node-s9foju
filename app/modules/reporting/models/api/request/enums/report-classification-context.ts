// https://liveaction.atlassian.net/wiki/spaces/LA/pages/1053523990/
// Report+REST+API+Structure+Updates#ReportRESTAPIStructureUpdates-ClassificationObject

enum ReportClassificationContext {
  DASHBOARD = 'DASHBOARD',
  WORKFLOW = 'WORKFLOW',
  REPORT = 'REPORT',
  ENTITY = 'ENTITY',
  TOPOLOGY = 'TOPOLOGY'
}

export default ReportClassificationContext;
