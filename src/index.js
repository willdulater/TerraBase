import App from "./App"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Auth0Provider } from "@auth0/auth0-react"
import { Toaster } from "react-hot-toast"
import * as Sentry from "@sentry/react"
import { BrowserTracing } from "@sentry/tracing"

if (process.env.REACT_APP_IS_PRODUCTION === "true") {
	Sentry.init({
		dsn: "https://c11e43fb76c39843720d10aec13ed93d@o4508445176365056.ingest.us.sentry.io/4508445771759616",
		integrations: [new BrowserTracing()],

		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 0.5,
	})
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
	<BrowserRouter>
		<Auth0Provider
			domain={process.env.REACT_APP_AUTH0_DOMAIN}
			clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
			redirectUri={process.env.REACT_APP_REDIRECT_URI}
			audience={process.env.REACT_APP_AUDIENCE}
			scope='read:current_user'
			useRefreshTokens={true}
			cacheLocation='localstorage'
		>
			<App />
			<Toaster />
		</Auth0Provider>
	</BrowserRouter>
)
