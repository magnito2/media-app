import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import {mediaSoupMiddleware} from "./middlewares";

import rootReducer from "./reducers";

const initialState = {};

const middleware = [thunk, mediaSoupMiddleware];

const store = createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);
export default store;
