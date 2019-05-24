import mockAxios from 'jest-mock-axios';
import "reflect-metadata";
import { ContentService } from './ContentService';

afterEach(() => {
  mockAxios.reset();
});

it('loadHeader()', () => {
  let catchFn = jest.fn(), thenFn = jest.fn();
  let contentService = new ContentService();
  contentService.loadHeader().then(thenFn).catch(catchFn);
  expect(mockAxios.get).toHaveBeenCalledWith('/api/v1/headline/content?location=us&locale=en_US&contentLocGrpId=0');
  let response = { "locale": "locale", "title": "title", "content": "content" };
  mockAxios.mockResponse({data: response});
  expect(thenFn).toHaveBeenCalledWith(response);
  expect(catchFn).not.toHaveBeenCalled();
}); 