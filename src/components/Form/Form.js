import React from 'react'
import {Fieldset, createValue} from 'react-forms'
import TimeField from '../TimeField/TimeField'
import DisplayField from '../DisplayField/DisplayField'
import DateField from '../DateField/DateField'
import { connect } from 'react-redux'
import {fetchCalculation, save, resetCalculation} from '../../logic/actions/actions'
import Button from './../Button/Button'
import Moment from 'moment'
import autoBind from 'react-autobind'
import PropTypes from 'prop-types';

import './Form.css'

export const SCHEMA = {
  type: 'object',
  required: [
    'start'
  ],
  properties: {
    start: {type: 'string', pattern: /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/},
    end: {type: 'string', pattern: /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/},
    break: {type: 'string', pattern: /^$|(^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9])$/},
    date: {type: 'string', pattern: /^.*$/}
  }
}

export class Form extends React.PureComponent {
  static propTypes = {
    save: PropTypes.func.isRequired,
    calculate: PropTypes.func.isRequired,
    edit: PropTypes.number,
    value: PropTypes.object.isRequired
  }

  static defaultProps = {
    value: {}
  }

  constructor (props) {
    super(props)

    autoBind(this)

    const formValue = this.createForm({date: Moment().format('L')})

    this.state = {formValue}
  }

  createForm (data) {
    return createValue({
      value: data,
      onChange: this.onChange,
      schema: SCHEMA
    })
  }
  onChange (formValue) {
    if (formValue._errorList.length === 0) {
      this.props.calculate(formValue)
    } else {
      this.setState({formValue})
    }
  }

  componentWillReceiveProps (props) {
    const formValue = this.createForm(props.value)
    this.setState({formValue})
  }

  render () {
    return (
      <Fieldset formValue={this.state.formValue} className='mdl-grid' id='form'>
        <div className='mdl-cell mdl-cell--2-col mdl-cell--4-col-tablet mdl-cell--6-col-phone'>
          <TimeField select='start' label='Start Time' />
        </div>
        <div className='mdl-cell mdl-cell--2-col mdl-cell--4-col-tablet mdl-cell--6-col-phone'>
          <TimeField select='end' label='End Time' />
        </div>
        <div className='mdl-cell mdl-cell--2-col mdl-cell--4-col-tablet mdl-cell--6-col-phone'>
          <TimeField select='break' label='Break' timer={false} />
        </div>
        <div className='mdl-cell mdl-cell--2-col mdl-cell--4-col-tablet mdl-cell--6-col-phone'>
          <DateField select='date' label='Day' />
        </div>
        <div className='mdl-cell mdl-cell--2-col mdl-cell--4-col-tablet mdl-cell--6-col-phone'>
          <DisplayField label='Duration' value={(this.props.value && this.props.value.duration) || ''} />
        </div>
        <div className='mdl-cell mdl-cell--2-col mdl-cell mdl-cell--4-col-tablet mdl-cell mdl-cell--6-col-phone'>
          {(this.props.value && this.props.value.duration) &&
            <Button invoke={this.props.save} context={this} icon={this.props.edit ? 'save' : 'add'} classes='mdl-button--raised mdl-js-ripple-effect mdl-button--accent' />
          }
        </div>
      </Fieldset>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    value: state.form.current,
    edit: state.form.edit
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    calculate: (formValue) => dispatch(fetchCalculation(formValue)),

    save: (component) => {
      if (component.props.value) {
        let time = component.props.value

        if (!time.break) {
          time.break = '00:00'
        }

        dispatch(save(time, component.props.edit))
        dispatch(resetCalculation())
      }
    }
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form)
