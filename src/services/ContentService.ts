import { Injectable } from 'react.di';
import axios from 'axios';

export class HeaderContent {
  constructor(public locale: string, public title: string, public content: string) {}
}

@Injectable
export class ContentService {

  public loadHeader(): Promise<any> {
    return axios.get('/api/v1/headline/content?location=us&locale=en_US&contentLocGrpId=0')
      .then(response => new HeaderContent(response.data.locale, response.data.title, response.data.content));
      // TODO mockAxios does not call thenFn with this:
      // .catch(error => new HeaderContent('', 'HTTP request failed', '<pre>' + JSON.stringify(error, null, 2) + '</pre>'));
  }

}
