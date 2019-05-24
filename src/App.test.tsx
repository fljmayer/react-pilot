import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import App, { HeaderContent } from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('gets header content', () => {
  const wrapper = shallow(<App />);
  // https://stackoverflow.com/questions/41196561/how-to-unit-test-a-method-of-react-component
  // Had problems with console output: https://github.com/facebook/create-react-app/issues/1368
  expect(wrapper.instance().contentService).toBeDefined;
  expect(wrapper.state().headerContent.content).toBe('Loading...');
  // TODO Is there a better way for mocking?
  wrapper.instance().contentService = {
    loadHeader: () => { return Promise.resolve(new HeaderContent('locale', 'title', 'content')); }
  };
  let promise: Promise<HeaderContent> = wrapper.instance().componentDidMount();
  expect.assertions(2);  // TODO Not sure where the second assertion comes from.
  return promise.then(header => {
    expect(wrapper.state().headerContent.content).toBe('content');
  });
});
