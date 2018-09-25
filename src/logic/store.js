import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import rootReducer from './reducers/reducers'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas/middlewares'

const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose
const sagaMiddleware = createSagaMiddleware()

let middlewares = [sagaMiddleware]

if (process && process.env.NODE_ENV !== 'test') {
  middlewares = [ ...middlewares, createLogger() ]
}

export default function configureStore (preloadedState) {
  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(...middlewares))
  )
  sagaMiddleware.run(rootSaga)

  return store
}
