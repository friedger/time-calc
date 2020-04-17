import React from 'react';
import DateField from './DateField';
import { shallow } from 'enzyme';
import 'jest-enzyme';

import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import moment from 'moment';
import { TimeHelper } from '../../logic/helpers';
import { IconButton } from '@material-ui/core';

describe('Component - Datefield', () => {
  const update = jest.fn();

  const validValue = { value: '05/25/2018', onChange: update };
  const invalidValue = { value: '05/32/2018', onChange: update };

  it('renders correctly', () => {
    const component = shallow(
      <MuiPickersUtilsProvider utils={MomentUtils} moment={moment}>
        <DateField input={validValue} label="foo" />
      </MuiPickersUtilsProvider>
    );

    expect(component.html().replace(TimeHelper.today(), 'TODAY')).toMatchSnapshot();
  });

  it('can hide the picker', () => {
    const component = shallow(
      <MuiPickersUtilsProvider utils={MomentUtils} moment={moment}>
        <DateField showPicker={false} input={validValue} label="foo" />
      </MuiPickersUtilsProvider>
    );

    expect(component.html().replace(TimeHelper.today(), 'TODAY')).toMatchSnapshot();
  });

  it('can render a default value', () => {
    const component = shallow(
      <MuiPickersUtilsProvider utils={MomentUtils} moment={moment}>
        <DateField showPicker={false} input={{ onChange: update }} label="foo" />
      </MuiPickersUtilsProvider>
    );

    expect(component.html().replace(TimeHelper.today(), 'TODAY')).toMatchSnapshot();
  });

  it('opens the datepicker on adornment click', () => {
    const component = shallow(
      <MuiPickersUtilsProvider utils={MomentUtils} moment={moment}>
        <DateField input={validValue} label="foo" />
      </MuiPickersUtilsProvider>
    );

    component.find(IconButton).simulate('click');

    // expect(component.html().replace(TimeHelper.today(), "TODAY")).toMatchSnapshot();
  });

  xdescribe('Form Handling', () => {
    it('set the form value from props', () => {
      const component = shallow(<DateField formValue={validValue} select="date" />).dive();

      expect(component.find('input')).toHaveValue('bar');
    });

    xit('is always dirty', () => {
      const component = mount(<DateField formValue={validValue} select="date" />);

      component.update();
      expect(component.find('div')).toHaveClassName('is-dirty');
    });

    it('is marked invalid in case of errors', () => {
      let mounted = mount(<DateField formValue={invalidValue} select="date" />);
      expect(mounted.find('div').first()).toHaveClassName('is-invalid');

      mounted = mount(
        <DateField formValue={{ errorList: [], value: undefined, update: update }} select="date" />
      );
      expect(mounted.find('div').first()).not.toHaveClassName('is-invalid');

      mounted.setProps({
        formValue: {
          errorList: [{ foo: 'bar' }],
          value: undefined,
          update: update,
        },
      });
      expect(mounted.find('div').first()).toHaveClassName('is-invalid');
    });

    it('invokes the form.update on value change', () => {
      const e = { target: { value: 'foo' } };

      const component = shallow(<DateField formValue={validValue} select="date" />).dive();

      component.find('input').simulate('change', e);
      expect(update).toBeCalledWith('foo');
      expect(component.state('dialog').time).toBeInstanceOf(Moment);
    });
  });
});
