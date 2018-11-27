import React from 'react'
import ConnectedTimeset, {StyledTimeset} from './Timeset'
import 'jest-enzyme'
import { shallowWithStore, shallowWithState } from 'enzyme-redux'
import { shallow, mount } from 'enzyme'
import { createMockStore } from 'redux-test-utils'
import {Provider} from 'react-redux'

describe('Component - Timeset', () => {
  const date = {start: '12:00', break: '00:30', end: '14:30', duration: '02:00', date: '12/12/2012'}

  it('renders a date set', () => {
    const component = shallow(<StyledTimeset time={date} onEditTime={jest.fn()} />)

    expect(component.html()).toMatchSnapshot()
  })

  it('triggers the edit callback', () => {
    const cb = jest.fn()
    const component = shallow(<StyledTimeset time={date}  onEditTime={cb} />)

    expect(component.html()).toMatchSnapshot()
    component.find('button[aria-label="Edit"]').simulate('click')

    expect(cb).toHaveBeenCalledWith({})
  })

  it('triggers the delete callback', () => {
    const cb = jest.fn()
    const component = shallow(<StyledTimeset time={date} onEditTime={jest.fn()} toggleDialog={cb} />)

    expect(component.html()).toMatchSnapshot()
    component.find('button[aria-label="Delete"]').simulate('click')

    expect(cb).toHaveBeenCalledWith({})
  })
})
