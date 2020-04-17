import React from 'react';
import ConnectedForm, { Form } from './Form';
import { TimeField } from '../TimeField/TimeField';
import DateField from '../DateField/DateField';
import 'jest-enzyme';
import { shallowWithStore, shallowWithState } from 'enzyme-redux';
import { createMockStore } from 'redux-test-utils';
import { shallow, mount, render } from 'enzyme';
import Moment from 'moment';

describe('Component - Form', () => {
  const dispatch = jest.fn();
  const save = jest.fn();
  const calculate = jest.fn();

  it('renders every field', () => {
    const defaultValue = { errorList: [], update: jest.fn() };
    const component = mount(
      <Form save={save} edit={undefined} calculate={calculate} formValue={defaultValue} />
    );

    expect(component.containsMatchingElement(<DateField id="date" label="Day" />)).toBeTruthy();
    expect(
      component.containsMatchingElement(<TimeField id="start" label="Start Time" />)
    ).toBeTruthy();
    expect(component.containsMatchingElement(<TimeField id="end" label="End Time" />)).toBeTruthy();
    expect(component.containsMatchingElement(<TimeField id="break" label="Break" />)).toBeTruthy();
    expect(
      component.containsMatchingElement(<TimeField id="duration" label="Duration" disabled />)
    ).toBeTruthy();
  });

  it('triggers calculation in case of valid form', () => {
    const defaultValue = { errorList: [], update: jest.fn() };
    const component = mount(
      <Form save={save} edit={undefined} calculate={calculate} formValue={defaultValue} />
    );
    const time = { target: { value: '12:00' } };

    component.find('#start').simulate('change', time);
    component.find('#end').simulate('change', time);
    // component.find('#date').simulate('change', date) //TODO mh onChange doesnt fire?

    expect(calculate).toBeCalled();
    expect(calculate.mock.calls[0][0].value).toMatchObject({
      start: '12:00',
      end: '12:00',
      date: new Moment().format('L'),
    });
  });

  describe('form submit handling', () => {
    it('has no save button for new timesets', () => {
      const expectedState = {
        form: {
          value: {},
        },
      };
      const component = mount(
        <ConnectedForm dispatch={dispatch} store={createMockStore(expectedState)} />
      );

      expect(component.find('button').length).toBe(2); // 2 for time-pickers
    });

    it('has an add button for calculated timesets', () => {
      const expectedState = {
        form: {
          current: {
            duration: '02:00',
          },
        },
      };
      const component = mount(
        <ConnectedForm dispatch={dispatch} store={createMockStore(expectedState)} />
      );

      expect(component.find('button').last()).toIncludeText('add');
      // component.find('button').last().simulate('click');
      // expect(dispatch).toBeCalledWith({});
    });

    it('has a save button for existing timesets', () => {
      const expectedState = {
        form: {
          edit: 1,
          current: {
            duration: '02:00',
          },
        },
      };
      const component = mount(
        <ConnectedForm dispatch={dispatch} store={createMockStore(expectedState)} />
      );

      expect(component.find('button').last()).toIncludeText('save');
      // component.find('button').last().simulate('click');
      // expect(save).toBeCalledWith({});
    });
  });
});
