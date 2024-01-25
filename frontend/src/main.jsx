import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { store } from "./store/configureStore.js"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { persistor } from "./store/configureStore.js"

ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<PersistGate
			loading={null}
			persistor={persistor}>
			<React.StrictMode>
				<App />
			</React.StrictMode>
		</PersistGate>
	</Provider>
)
