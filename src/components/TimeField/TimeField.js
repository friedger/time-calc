import React from 'react';
import PropTypes from 'prop-types';

import { KeyboardTimePicker } from '@material-ui/pickers';
import TimerIcon from '@material-ui/icons/Timer';
import { TimeHelper } from '../../logic/helpers';

/* if (keyboard) { localInputProps[${adornmentPosition}Adornment] = ( <InputAdornment position={adornmentPosition} {...InputAdornmentProps} disabled={disabled}> <IconButton onClick={this.openPicker}> <Icon> {keyboardIcon} </Icon> </IconButton> </InputAdornment> ); } */

const TimeField = ({ input, label, showPicker, disabled, defaultValue }) => (
  <KeyboardTimePicker
    value={input && input.value ? TimeHelper.time(input.value) : null}
    onChange={date => input.onChange(TimeHelper.time(date))}
    label={label}
    format="HH:ss"
    autoOk
    placeholder={defaultValue || TimeHelper.now()}
    fullWidth
    todayLabel="Now"
    keyboardIcon={<TimerIcon />}
    ampm={false}
    InputAdornmentProps={{
      style: {
        display: showPicker === false ? 'none' : 'flex',
      },
    }}
    disabled={disabled}
    invalidDateMessage="Invalid Time"
    showTodayButton
    // tabIndexIconButton="-1"
    InputLabelProps={{
      shrink: true,
    }}
  />
);

TimeField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  showPicker: PropTypes.bool,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.any,
};

export default TimeField;
