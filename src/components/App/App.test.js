import React from 'react'
import App from './App'
import { shallow } from 'enzyme'
import { Provider } from 'react-redux'
import {
  MuiThemeProvider
} from '@material-ui/core/styles'

import 'jest-enzyme'
import { TimeHelper } from '../../logic/helpers'

describe('Component - App', () => {
  it('renders correctly', () => {
    const component = shallow(<App />).dive()

    const regex = new RegExp(TimeHelper.now(), 'g')
    expect(component.html().replace(TimeHelper.today(), 'TODAY').replace(regex, 'NOW')).toMatchSnapshot()
  })

  it('wraps everything with redux', () => {
    const component = shallow(<App />).dive()

    expect(component.find(Provider)).toHaveProp('store')
  })

  it('wraps everything with MUI Theme', () => {
    const component = shallow(<App />).dive()

    expect(component.find(MuiThemeProvider)).toHaveProp('theme')
  })
})
