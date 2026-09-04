import React from 'react'
import App from './App';
import {Provider} from "react-redux";
import store from './redux/store';
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>
);

