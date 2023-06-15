import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import authReducer from './state'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import {persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'


const persistConfig = { key: 'root', storage, version: 1 }      //Ρυθμίσεις για την διαχείριση της αποθήκευσης 
const persistedReducer = persistReducer(persistConfig, authReducer)     //Ο persistReducer αναλαμβάνει να αποθηκεύει και να ανακτά το state από τo store
const store = configureStore({          //Δημιουργία του Redux store
    reducer: persistedReducer,
    //Τα παρακάτω actions (FLUSH, REHYDRATE κ.λ.π) που αφορούν την διαχείριση του αποθηκευμένου state, αγνοούνται από το middleware
    //προκειμένου να μην προκαλέσουν προβλήματα κατά την αποθήκευση και ανάκτηση του state
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: {ignoreActions: 
                [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]     
            }
        })
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistStore(store)}>
                <App />
            </PersistGate>
        </Provider>
    </React.StrictMode>
)