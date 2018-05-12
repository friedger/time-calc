import React from 'react'
import { Provider } from 'react-redux'
import 'material-design-lite/src/mdlComponentHandler'

import './App.css'

import UserProfile  from '../UserProfile/UserProfile'
import Form from '../Form/Form'
import TimeList from '../TimeList/TimeList'

import createStore from './../../logic/store'

const App = () => {
  return (
    <Provider store={createStore()}>
      <div className='mdl-layout mdl-layout--fixed-header'>
        <header className='mdl-layout__header mdl-layout--no-drawer-button'>
          <div className='mdl-layout__header-row'>
            <div className='mdl-layout-spacer' />
            <div className='mdl-layout-title'>Time - Calculator</div>
            <div className='mdl-layout-spacer' />
          </div>
          <UserProfile/>
        </header>
        <main className='mdl-layout__content'>
          <Form />
          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--12-col'>
              <TimeList />
            </div>
          </div>
        </main>
      </div>
    </Provider>
  )
}

export default App
