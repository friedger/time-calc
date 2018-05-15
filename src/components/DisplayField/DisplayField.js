import React from 'react'
import PropTypes from 'prop-types';

const DisplayField = ({value, label}) => {
  return (
    <div className='mdl-textfield mdl-textfield--floating-label is-dirty'>
      <input className='mdl-textfield__input' readOnly='true' type='text' value={value} />
      <label className='mdl-textfield__label'>{label}</label>
    </div>
  )
}

DisplayField.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export default DisplayField
