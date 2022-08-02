import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './redux/store';
import { Provider } from "react-redux";
import reportWebVitals from './reportWebVitals';
import { createBrowserHistory } from "history";
import { BrowserRouter} from "react-router-dom";

const history = createBrowserHistory({ window });

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter history={history}>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>, document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
