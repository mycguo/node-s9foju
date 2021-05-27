import {Application} from './application';
import {ApplicationGroupResponse} from './application-group-response';

export default class ApplicationGroup implements ApplicationGroupResponse {
  id: string;
  name: string;
  applications: Array<Application>;
  applicationsString: string;

  constructor(
    {
      id,
      name,
      applications
    }: {
      id: string,
      name: string,
      applications: Array<Application>
    }
  ) {
    this.id = id;
    this.name = name;
    this.applications = applications;
    this.applicationsString = this.applicationsToString;
  }

  get applicationsToString(): string {
    return this.applications?.map(application => application.name).join(', ');
  }

}
