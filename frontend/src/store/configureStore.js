import { configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import rootReducer from "./modules/index.js"

const persistConfig = {
	key: "root",
	storage,
	blacklist: ["navigation"],
}

const rootPersistReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
	reducer: rootPersistReducer,
})

const persistor = persistStore(store)

export { store, persistor }
