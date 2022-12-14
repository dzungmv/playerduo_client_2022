import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from '@/components/GlobalStyles';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import 'nprogress/nprogress.css';

import { Provider } from 'react-redux';
import store from '@/_redux/store';

const container = document.getElementById('root');
const persistor = persistStore(store);
const root = createRoot(container);
root.render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <GlobalStyles>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </GlobalStyles>
        </PersistGate>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
