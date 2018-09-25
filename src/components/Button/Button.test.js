import React from 'react'
import Button from './Button'
import { shallow } from 'enzyme'
import 'jest-enzyme'

describe('Component - Button', () => {
  it('adds the classes from props.classes to the button', () => {
    const component = shallow(<Button classes='foo' />)

    expect(component.html()).toMatchSnapshot()
  })

  it('adds the mdl-icon from props.icon', () => {
    const component = shallow(<Button icon='add' />)

    expect(component.html()).toMatchSnapshot()
  })

  it('sets the type from props.type', () => {
    const component = shallow(<Button type='reset' />)

    expect(component.html()).toMatchSnapshot()
  })

  it('doenst attach a onclick handler if props.type is passed', () => {
    const cb = jest.fn()
    const component = shallow(<Button type='reset' />)

    component.simulate('click')
    expect(cb).not.toHaveBeenCalled()
  })

  it('renders a disabled button if there is no callback defined via props.invoke', () => {
    const component = shallow(<Button />)

    expect(component.html()).toMatchSnapshot()
  })

  it('binds the onClick handler', () => {
    const cb = jest.fn()
    const component = shallow(<Button invoke={cb} context={1337} />)

    component.simulate('click')
    expect(cb).toBeCalledWith(1337)
  })
})
