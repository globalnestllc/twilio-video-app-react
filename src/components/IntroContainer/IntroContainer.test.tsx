import React from 'react';
import IntroContainer from './IntroContainer';
import { shallow } from 'enzyme';
import { useLocation } from 'react-router-dom';
import { useAppState } from '../../state';

jest.mock('react-router-dom', () => {
  return {
    useLocation: jest.fn(),
  };
});
jest.mock('../../state');

const mockUseLocation = useLocation as jest.Mock<any>;
const mockUseAppState = useAppState as jest.Mock<any>;

mockUseLocation.mockImplementation(() => ({ pathname: '/' }));
mockUseAppState.mockImplementation(() => ({ user: undefined }));

describe('the IntroContainer component', () => {
  it('should render children', () => {
    const wrapper = shallow(
      <IntroContainer>
        <span>Test Content</span>
      </IntroContainer>
    );

    expect(wrapper.find('span').text()).toBe('Test Content');
  });

  it('should render subcontent when provided', () => {
    const wrapper = shallow(
      <IntroContainer subContent={<h1>Test Sub Content</h1>}>
        <span>Test Content</span>
      </IntroContainer>
    );

    expect(wrapper.find('h1').text()).toBe('Test Sub Content');
  });
});
