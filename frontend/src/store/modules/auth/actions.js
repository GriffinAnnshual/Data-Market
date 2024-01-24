import { createAction } from "@reduxjs/toolkit"
import axios from "axios"

export const logout = createAction("auth/logout")
export const setEmailVerified = createAction("auth/setEmailVerified")
export const setAuthenticatedSuccess = createAction(
	"auth/setAuthenticatedSuccess"
)
export const setAuthenticatedFailure = createAction(
	"auth/setAuthenticatedFailure"
)

export const getUser = () => {
	return async (dispatch) => {
		try {
			const res = await axios.get("http://localhost:3000/getUser", {
				withCredentials: true,
				headers: {
					"Content-Type": "application/json",
				},
			})

			if (res.status === 200) {
				const data = res.data
				console.log(data)
				dispatch(setAuthenticatedSuccess(data))
			} else {
				console.log("Error in fetching the data")
				dispatch(setAuthenticatedFailure("Error in fetching the data"))
			}
		} catch (err) {
			console.log(err.message)
			dispatch(setAuthenticatedFailure(err.message))
		}
	}
}
