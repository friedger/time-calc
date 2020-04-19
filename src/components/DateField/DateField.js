import React from 'react';
import PropTypes from 'prop-types';

import { KeyboardDatePicker, DatePicker } from '@material-ui/pickers';

import { TimeHelper } from '../../logic/helpers';

const DateField = ({ input, label, showPicker }) => {
  if (showPicker !== false) {
    return (
      <KeyboardDatePicker
        value={input.value ? TimeHelper.date(input.value) : null}
        onChange={date => input.onChange(TimeHelper.date(date))}
        label={label}
        format="MM/DD/YYYY"
        autoOk
        placeholder={TimeHelper.today()}
        fullWidth
        showTodayButton
        InputLabelProps={{
          shrink: true,
        }}
      />
    );
  } else {
    return (
      <DatePicker
        value={input.value ? TimeHelper.date(input.value) : null}
        onChange={date => input.onChange(TimeHelper.date(date))}
        label={label}
        format="MM/dd/yyyy"
        autoOk
        placeholder={TimeHelper.today()}
        fullWidth
        showTodayButton
        InputLabelProps={{
          shrink: true,
        }}
      />
    );
  }
};

DateField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  showPicker: PropTypes.bool,
};

export default DateField;
