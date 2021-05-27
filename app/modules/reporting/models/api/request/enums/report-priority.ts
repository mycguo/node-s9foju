// https://liveaction.atlassian.net/wiki/spaces/LA/pages/1016791860/Multilevel+Queue+Prioritization
export enum ReportPriority {
  P1 = 'P1', // reports that are in memory (check w/ BE, probably not used on FE)
  P2 = 'P2', // Entity Pages (fastlane)
  P3 = 'P3', // Dashboards, Leaf Entity Page, Topology Report Popups (fastlane)
  P4 = 'P4'  // report, stories
}

