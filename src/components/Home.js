import React, { useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import Spinner from "./Spinner/"
import Login from "./Login/"
import Content from "./Content"
import Cookies from "universal-cookie"
import * as Sentry from "@sentry/react"
import { useWindowDimension } from "../hooks/useWindowDimension"
import MobileNotSupported from "./MobileNotSupported"
import MobileSchoolMode from "./MobileSchoolMode"

const cookies = new Cookies()
let AUDIENCE = process.env.REACT_APP_AUDIENCE

const Home = () => {
	const {
		isAuthenticated,
		isLoading,
		getAccessTokenSilently,
		getAccessTokenWithPopup,
	} = useAuth0()

	const [gotToken, setGotToken] = useState(false)

	const [showMobileWarning, setShowMobileWarning] = useState(false)
	const [width, _] = useWindowDimension()
	useEffect(() => {
		if (width <= 800) {
			setShowMobileWarning(true)
		} else {
			setShowMobileWarning(false)
		}
	}, [width])

	useEffect(() => {
		if (isAuthenticated) {
			getAccessTokenSilently({
				audience: AUDIENCE,
				scope: "read:current_user",
			})
				.then((res) => {
					cookies.set("token", res, { path: "/" })
					setGotToken(true)
				})
				.catch((error) => {
					getAccessTokenWithPopup({
						audience: AUDIENCE,
						scope: "read:current_user",
					})
						.then((res) => {
							cookies.set("token", res, { path: "/" })
							setGotToken(true)
						})
						.catch((error) => {
							Sentry.captureException(error)
						})
				})
		}
	}, [isAuthenticated])

	if (!isAuthenticated) {
		return <Login />
	}

	if (isLoading || !gotToken) {
		return <Spinner />
	}

	return <>{showMobileWarning ? <MobileNotSupported /> : <Content />}</>
}

export default Home
