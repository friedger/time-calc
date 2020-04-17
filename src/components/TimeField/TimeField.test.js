import React from 'react';
import TimeField from './TimeField';
import { shallow, mount, render } from 'enzyme';
import 'jest-enzyme';
import Moment from 'moment';
import { setTimeout } from 'timers';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import moment from 'moment';

describe('Component - TimeField', () => {
  const update = jest.fn();

  const validValue = { value: '12:12', onChange: update };
  const invalidValue = { value: 'bar', onChange: update };

  it('can render a full time picker', () => {
    const component = shallow(<TimeField input={validValue} label="foo" />);

    expect(component.html()).toMatchSnapshot();
  });

  it('renders a timer for picking current time if wanted', () => {
    const component = mount(<TimeField formValue={validValue} timer select="date" />);

    expect(component.find('button')).toIncludeText('timer');
  });

  xdescribe('Form Handling', () => {
    it('set the form value from props', () => {
      const component = shallow(<TimeField formValue={validValue} select="date" />).dive();

      expect(component.find('input')).toHaveValue('bar');
    });

    xit('is always dirty', () => {
      const component = mount(<TimeField formValue={validValue} select="date" />);

      expect(component.find('div')).toHaveClassName('is-dirty');
    });

    it('is marked invalid in case of errors', () => {
      let mounted = mount(<TimeField formValue={invalidValue} select="date" />);
      expect(mounted.find('div').first()).toHaveClassName('is-invalid');

      mounted = mount(
        <TimeField formValue={{ errorList: [], value: undefined, update: update }} select="date" />
      );
      expect(mounted.find('div').first()).not.toHaveClassName('is-invalid');

      mounted.setProps({
        formValue: { errorList: [{ foo: 'bar' }], value: undefined, update: update },
      });
      expect(mounted.find('div').first()).toHaveClassName('is-invalid');
    });

    it('updates the value on value change', () => {
      const e = { target: { value: 'foo' } };

      const component = shallow(<TimeField formValue={validValue} select="date" />).dive();

      component.find('input').simulate('change', e);
      expect(update).toBeCalledWith('foo');
      expect(component.state('dialog').time).toBeInstanceOf(Moment);
    });

    it('updates the value in case of timer click', () => {
      const e = { target: { value: 'foo' } };
      const component = mount(<TimeField formValue={validValue} timer select="date" />);

      component.find('button').simulate('click', e);
      expect(update).toBeCalledWith('foo');
    });
  });

  it('creates a datepicker', () => {
    const component = shallow(<TimeField formValue={validValue} select="date" />).dive();

    expect(component).toHaveState('dialog');
  });

  xit('opens the datepicker onfocus', () => {
    const component = shallow(<TimeField formValue={validValue} select="date" />).dive();

    component.find('input').simulate('focus');
  });
});
