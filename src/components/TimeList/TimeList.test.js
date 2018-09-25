import React from 'react'
import ConnectedTimeList, {StyledTimeList} from './TimeList'
import 'jest-enzyme'
import { shallowWithState, shallowWithStore} from 'enzyme-redux'
import { shallow, mount } from 'enzyme'
import { createMockStore } from 'redux-test-utils'
import {Provider} from 'react-redux'

describe('Component - TimeList', () => {
  const download = jest.fn()
  const clear = jest.fn()
  const load = jest.fn()
  const toggleDialog = jest.fn()

  const times = [{duration: '02:00'}, {duration: '02:00'}]

  it('renders time rows', () => {
    const component = shallowWithStore(<StyledTimeList times={times} load={jest.fn()} download={jest.fn()} />)

    expect(component.html()).toMatchSnapshot()
  })

  it('renders an empty div if there are no times to display', () => {
    const component = shallow(<StyledTimeList times={[]} clear={clear} download={download} load={load} />)

    expect(component).toHaveHTML('<div></div>')
  })

  it('displays a sum field of all times', () => {
    const component = shallow(<StyledTimeList times={times} clear={clear} download={download} load={load} />)

    expect(component.find('#sum')).toIncludeText('04:00')
  })

  describe('Actions', () => {
    it('has a delete-all button when there are timesets', () => {
      const component = mount(<Provider store={createMockStore({})}><StyledTimeList times={times} clear={clear} download={download} load={load} toggleDialog={toggleDialog} /></Provider>)

      component.find('button').filterWhere(n => n.text() === 'delete').first().simulate('click')

      expect(toggleDialog).toBeCalled()
    })

    it('has a download button which exports the timelist as CSV', () => {
      const component = mount(<Provider store={createMockStore()}><StyledTimeList times={times} clear={clear} download={download} load={load} /></Provider>)

      component.find('button').filterWhere(n => n.text() === 'cloud_download').first().simulate('click')

      expect(download).toBeCalled()
    })
  })
})
