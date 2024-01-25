import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
	name: "auth",
	initialState: {
		emailVerified: false,
		isAuthenticated: false,
		user: null,
		error: null,
	},
	reducers: {
		setUser(state,action){
			state.user = action.payload
		},
		logout(state) {
			state.isAuthenticated = false
			state.user = null
			state.error = null
		},
		setEmailVerified(state, action) {
			state.emailVerified = action.payload
		},
		setAuthenticatedSuccess(state, action) {
			state.user = action.payload
			state.error = null
			state.isAuthenticated = true
		},
		setAuthenticatedError(state, action) {
			state.user = null
			state.error = action.payload
			state.isAuthenticated = false
		},
	},
})

const authReducer = authSlice.reducer
export default authReducer
