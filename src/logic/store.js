import { createStore, applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import rootReducer from './reducers/reducers'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas/middlewares';

const loggerMiddleware = createLogger()
const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose
const sagaMiddleware = createSagaMiddleware()

export default function configureStore (preloadedState) {
  const store = createStore(
        rootReducer,
        preloadedState,
        composeEnhancers(applyMiddleware(
            sagaMiddleware,
            loggerMiddleware
        ))
    )
    sagaMiddleware.run(rootSaga)

    return store;
}
