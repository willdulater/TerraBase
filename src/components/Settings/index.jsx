import { useEffect, useState } from "react"
import Request from "../Request"
import { useAuth0 } from "@auth0/auth0-react"
import Rocket from "../../svg/rocket.svg"
import PricingCard from "./PricingCard"
import toast from "react-hot-toast"
import { TailSpin } from "react-loading-icons"
import Countdown from "react-countdown"

const Settings = ({ subscription, setSubscribed, userInfo, setUserInfo }) => {
	const { user } = useAuth0()
	const { picture } = user
	const [wordsUsed, setWordsUsed] = useState(null)

	const [referrerEmail, setReferrerEmail] = useState("")
	const [submittingReferrer, setSubmittingReferrer] = useState(false)

	const [friendEmail, setFriendEmail] = useState("")
	const [submittingFriend, setSubmittingFriend] = useState(false)

	const [copied, setCopied] = useState(false)

	useEffect(() => {
		const meRequest = new Request("users/wordcount/")
		meRequest
			.then((res) => {
				setWordsUsed(res.data.wordcount)
			})
			.catch((err) => {
				setWordsUsed(0)
			})
	}, [])

	const CountdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
		if (completed) {
			return <span>Countdown complete!</span>
		} else {
			return (
				<span>
					{days}d, {hours}h, {minutes}m, {seconds} left
				</span>
			)
		}
	}

	const handleCancelSubscription = () => {
		const parameters = {
			method: "POST",
		}

		const cancelSubscriptionRequest = new Request(
			"stripe/cancel-subscription/",
			parameters
		)

		cancelSubscriptionRequest
			.then((res) => {
				setSubscribed(false)
			})
			.catch((err) => {
				toast.error(err.response.data.message)
			})
	}

	const handleSubscription = (subscription_type) => {
		const commandsRequest = new Request("stripe/create-checkout-session/", {
			method: "POST",
			data: {
				subscription_type: subscription_type,
			},
		})

		commandsRequest
			.then((response) => {
				window.location.href = response.data.url
			})
			.catch((err) => {
				toast.error(err.response.data.message)
			})
	}

	const submitReferrer = (e) => {
		e.preventDefault()
		setSubmittingReferrer(true)
		const parameters = {
			method: "POST",
			data: {
				referral_email: referrerEmail,
			},
		}

		const referralRequest = new Request("users/setreferrer/", parameters)

		referralRequest
			.then((res) => {
				toast.success("Referrer set successfully!")
				setSubmittingReferrer(false)
				setUserInfo({
					...userInfo,
					referrer_email: referrerEmail,
				})
			})
			.catch((err) => {
				toast.error(err.response.data.message)
				setSubmittingReferrer(false)
			})
	}

	const submitFriend = () => {
		setSubmittingFriend(true)

		if (friendEmail === user.email) {
			toast.error("You can't refer yourself!")
			setSubmittingFriend(false)
			return
		}

		if (friendEmail === userInfo.referrer_email) {
			toast.error("You can't refer your referrer!")
			setSubmittingFriend(false)
			return
		}

		if (friendEmail.length === 0) {
			toast.error("Please enter an email address.")
			setSubmittingFriend(false)
			return
		}

		const parameters = {
			method: "POST",
			data: {
				email: friendEmail,
			},
		}

		const referralRequest = new Request("users/submitreferral/", parameters)

		referralRequest
			.then((res) => {
				toast.success("We'll send an email to your friend!")
				setSubmittingFriend(false)
				setFriendEmail("")
			})
			.catch((err) => {
				toast.error(err.response.data.message)
				setSubmittingFriend(false)
			})
	}

	return (
		<div className='flex flex-col w-4/5 items-center overflow-y-scroll h-screen'>
			{/* Subscription advertisement */}
			
			{/*
			{!subscription["subscribed"] && (
				<div className='mb-5 w-[90%] h-fit rounded-2xl px-10 flex flex-col mt-5'>
					<p className='text-sm font-extrabold text-[#8033fc] mb-4'>
						SELECT A PLAN
					</p>
					<div className='flex flex-row space-x-5'>
						<PricingCard
							planName={"Basic"}
							bg={"white"}
							price={"Free"}
							upgradeButton={"current"}
							handleSubscription={handleSubscription}
							fullWidth={true}
						/>
						<PricingCard
							planName={"Premium"}
							bg={"white"}
							price={"$5/mo"}
							upgradeButton={"special"}
							handleSubscription={handleSubscription}
							fullWidth={true}
						/>
						<PricingCard
							planName={"Early Access Special"}
							bg={"special"}
							price={"$20, forever"}
							upgradeButton={"special"}
							handleSubscription={handleSubscription}
							fullWidth={true}
						/>
					</div>
				</div>
			)}
				*/}

			<div className='bg-white w-[85%] flex flex-col my-5 h-fit rounded-2xl p-5 pl-10 pr-10'>
				<div className='flex flex-row mb-[-2rem]'>
					<div className='flex flex-col items-left'>
						<p className='font-semibold text-3xl'>Profile</p>
					</div>
					<div className='flex flex-col mt-1 ml-auto'>
						<img src={picture} alt='PFP' className='rounded-full h-16 w-16' />
					</div>
				</div>

				<div className='flex flex-row mt-5'>
					<div className='flex flex-row w-3/5'>
						<p className='font-semibold'>Email</p>
						<p type='text' className='rounded-lg ml-3 text-black'>
							{user.email}
						</p>
					</div>
					<div className='flex flex-row w-2/5'>
						<p className='font-semibold'>Full Name</p>
						<p type='text' className='rounded-lg ml-3 text-black'>
							{user.name}
						</p>
					</div>
				</div>

				{/* refferal */}

				{/*
				<div className='flex flex-row mt-5 w-full'>
					<div className='flex flex-col w-3/5'>
						{userInfo.referrer_email !== null ? (
							<div className='flex flex-row'>
								<p className='font-semibold'>Referred By</p>
								<p className='font-normal ml-2'>{userInfo.referrer_email}</p>
							</div>
						) : (
							<div className='flex flex-row items-center w-full'>
								<p className='font-semibold'>Referred by a friend?</p>
								<form onSubmit={submitReferrer} className='flex flex-row ml-2'>
									<input
										type='email'
										className='border-[1px] border-[#475467]/30 rounded-lg p-2 w-60'
										value={referrerEmail}
										onChange={(e) => setReferrerEmail(e.target.value)}
										disabled={submittingReferrer}
										placeholder='Friend&#39;s Email'
									/>

									<button
										className='bg-[#7D55D6] rounded-md text-center px-4 py-2 w-fit ml-2 hover:bg-[#7D55D6]/90'
										type='submit'
									>
										{submittingReferrer ? (
											<TailSpin
												strokeWidth={2}
												className='animate-spin h-5 w-5 text-white'
											/>
										) : (
											<p className='font-normal text-white'>Submit</p>
										)}
									</button>
								</form>
							</div>
						)}
					</div>
					<div className='flex flex-row w-2/5'>
						<p className='font-semibold'>Friends Referred</p>
						<p type='text' className='rounded-lg ml-3 text-black'>
							{userInfo.num_referred}
						</p>
					</div>
				</div>

				*/}
				{subscription["subscription_type"] !== "lifetime" && false && (
					<>
						<div className='h-[1px] w-5/6 bg-delilahSecondary mx-auto mt-6'></div>

						<div className='flex flex-col mt-4'>
							<div className='flex flex-row items-center'>
								<p className='font-semibold text-3xl'>Free Premium!</p>
								<div className='ml-auto mr-3 bg-yellow-600 rounded-lg px-2 py-1 text-white'>
									<Countdown
										date={new Date("March 2, 2023")}
										renderer={CountdownRenderer}
									/>
								</div>
							</div>
							<p className='font-semibold text-md'>
								Invite 3 friends to use Delilah, and we'll give you a
								{subscription["subscription_type"] === "monthly"
									? "n additional "
									: " "}
								month of premium.
							</p>

							<div className='flex flex-col self-center mt-2 w-1/2'>
								<p className='text-xs text-slate-600'>
									your unique referral link
								</p>
								<div className='rounded-lg border-slate-300 p-2 bg-slate-200 flex flex-row'>
									<p className='text-[#7421FC] text-center font-normal'>
										app.delilah.ai/?refer={user.email}
									</p>
									<button
										className='ml-auto rounded-md text-center px-4 w-fit ml-2 '
										onClick={() => {
											navigator.clipboard.writeText(
												`https://app.delilah.ai/?refer=${user.email}&utm_source=delilah&utm_medium=referral-link&utm_campaign=alpha`
											)
											setCopied(true)
											toast.success(
												"Copied your referral link! Share it with your friends!"
											)
										}}
										disabled={copied}
									>
										{copied ? (
											<p className='font-semibold text-[#6060b1]'>copied!</p>
										) : (
											<p className='font-semibold text-[#6060b1]'>copy</p>
										)}
									</button>
								</div>
							</div>

							{/* <form
								className='flex flex-row w-1/2 self-center mt-5'
								onSubmit={(e) => {
									e.preventDefault()
									submitFriend()
								}}
							>
								<input
									type='email'
									className='border-[1px] border-[#475467]/30 rounded-lg p-3 w-[75%] ml-3 text-black'
									value={friendEmail}
									onChange={(e) => setFriendEmail(e.target.value)}
									placeholder={"Friend's email"}
								/>
								<button
									className='bg-[#7D55D6] rounded-md text-center px-4 py-2 w-fit ml-2 hover:bg-[#7D55D6]/90'
									type='submit'
								>
									{submittingFriend ? (
										<TailSpin
											strokeWidth={2}
											className='animate-spin h-5 w-5 text-white'
										/>
									) : (
										<p className='font-normal text-white'>Submit</p>
									)}
								</button>
							</form> */}

							<div className='flex flex-row space-between space-x-5 self-center mt-3 mr-10'>
								<a
									href='discord://'
									onClick={(e) => {
										// make toast last longer
										toast.success(
											"We've copied a message to your clipboard! Send it to your friends to get started!",
											{
												position: "top-center",
												duration: 5000,
											}
										)
										navigator.clipboard.writeText(
											"Hey guys check this app out https://app.delilah.ai"
										)
										return true
									}}
								>
									<div className='bg-[#7289DA] rounded-2xl p-2 h-12 w-12 flex hover:bg-[#7289DA]/90 hover:cursor-pointer'>
										<i className='fab fa-discord text-lg text-white mx-auto my-auto'></i>
									</div>
								</a>
								<div
									className='bg-[#1DA1F2] rounded-2xl p-2 h-12 w-12 flex hover:bg-[#1DA1F2]/90 hover:cursor-pointer'
									onClick={() => {
										window.open(
											`https://twitter.com/intent/tweet?text=Just found this app that helps you write your college essays https://app.delilah.ai`,
											"_blank"
										)
									}}
								>
									<i className='fab fa-twitter text-lg text-white mx-auto my-auto'></i>
								</div>

								{/* <a
							href='https://www.facebook.com/sharer/sharer.php?u=https://app.delilah.ai&quote=Just found this app that helps you write your college essays'
							target='_blank'
						>
							<div className='bg-[#3B5998] rounded-2xl p-2 h-12 w-12 flex hover:bg-[#3B5998]/90 hover:cursor-pointer'>
								<i className='fab fa-facebook text-lg text-white mx-auto my-auto'></i>
							</div>
						</a> */}

								{/* check if user is using an apple computer */}
								{/* {navigator.platform.includes("Mac") ? ( */}

								{navigator.platform.toUpperCase().indexOf("MAC") >= 0 && (
									<a href='sms://open?addresses=&body=Check out this app that helps you write your college essays: https://app.delilah.ai'>
										<div className='bg-[#64FC4C] rounded-2xl p-2 h-12 w-12 flex hover:bg-[#64FC4C]/90 hover:cursor-pointer'>
											<i className='fas fa-comment text-lg text-white mx-auto my-auto'></i>
										</div>
									</a>
								)}

								<a
									href='https://www.facebook.com/dialog/send?link=https://app.delilah.ai&app_id=87741124305&redirect_uri=https://app.delilah.ai'
									target='_blank'
								>
									<div className='bg-[#0084FF] rounded-2xl p-2 h-12 w-12 flex hover:bg-[#0084FF]/90 hover:cursor-pointer'>
										<i className='fab fa-facebook-messenger text-lg text-white mx-auto my-auto'></i>
									</div>
								</a>
								{/* <a
							href='https://www.reddit.com/submit?url=https://app.suppal.ai&title=Just found this app that helps you write your college essays'
							onClick={() => {
								navigator.clipboard.writeText(
									"Just found this app that helps you write your college essays https://app.suppal.ai"
								)
							}}
							target='_blank'
						>
							<div className='bg-[#FF4500] rounded-2xl p-2 h-12 w-12 flex hover:bg-[#FF4500]/90 hover:cursor-pointer'>
								<i className='fab fa-reddit text-lg text-white mx-auto my-auto'></i>
							</div>
						</a> */}
								<a
									href='mailto:?subject=Just found this app that helps you write your college essays&body=https://app.suppal.ai'
									target='_blank'
								>
									<div className='bg-[#7289DA] rounded-2xl p-2 h-12 w-12 flex hover:bg-[#7289DA]/90 hover:cursor-pointer'>
										<i className='fas fa-envelope text-lg text-white mx-auto my-auto'></i>
									</div>
								</a>
								{/* <a href='whatsapp://send?text=Just found this app that helps you write your college essays https://app.suppal.ai'>
							<div className='bg-[#25D366] rounded-2xl p-2 h-12 w-12 flex hover:bg-[#25D366]/90 hover:cursor-pointer'>
								<i className='fab fa-whatsapp text-lg text-white mx-auto my-auto'></i>
							</div>
						</a> */}
							</div>
						</div>
					</>
				)}
			</div>

			{subscription["subscribed"] && (
				<div className='bg-white w-[85%] my-5 h-fit rounded-2xl py-5 px-10'>
					<div className='flex flex-row items-center'>
						<p className='font-semibold text-3xl'>Subscription Details</p>

						<div className='rounded-2xl bg-[#7D55D6]/10 p-2 ml-5'>
							<p className='font-semibold text-sm text-[#7D55D6]'>
								ACTIVE SUBSCRIPTION
							</p>
						</div>
					</div>

					<div className='flex flex-row w-full mt-5'>
						<div className='flex flex-col w-1/2 mt-5 mb-5 justify-between items'>
							<div className='flex flex-col space-y-5 justify-between'>
								<div className='flex flex-row justify-between'>
									<p className='text-[#475467] font-normal'>Plan</p>
									<p className='text-[#101828] font-semibold'>
										{subscription["subscription_type"] === "lifetime"
											? "Lifetime (Early Supporter)"
											: "Monthly"}
									</p>
								</div>
								{subscription["subscription_type"] === "monthly" && (
									<div className='flex flex-row justify-between'>
										<p className='text-[#475467] font-normal'>
											Subscribed Until
										</p>
										<p className='text-[#101828] font-semibold'>
											{subscription["subscribed_until"]}
										</p>
									</div>
								)}
								<div className='flex flex-row justify-between'>
									<p className='text-[#475467] font-normal'>Words Generated</p>
									<p className='text-[#101828] font-semibold'>{wordsUsed}</p>
								</div>

								<div className='flex flex-row justify-between'>
									<p className='text-[#475467] font-normal'>Word Limit</p>
									<p className='text-[#101828] font-semibold'>
										{subscription["subscription_type"] === "monthly"
											? "100,000"
											: "Unlimited"}
									</p>
								</div>
							</div>
							<div className='flex flex-col'>
								{subscription["subscription_type"] === "monthly" && (
									<div
										className='bg-red-500 rounded-md text-center px-2 py-4 mt-5 w-full ml-auto mr-auto hover:cursor-pointer'
										onClick={() => {
											window.open(
												"mailto:founders@delilah.ai?subject=[ASSISTANCE] Cancel subscription&body=Please cancel my subscription."
											)
										}}
									>
										<p className='font-normal text-white'>
											Cancel your subscription
										</p>
									</div>
								)}
								<div
									className='bg-[#7D55D6] rounded-md text-center px-2 py-4 mt-5 w-full ml-auto mr-auto hover:cursor-pointer'
									onClick={() => {
										window.open("mailto:founders@delilah.ai")
									}}
								>
									<p className='font-normal text-white'>
										Thanks for supporting Suppal! Click here to email us.
									</p>
								</div>
							</div>
						</div>

						<div className='w-[3px] bg-[#7D55D6]/25 ml-10 mr-10'></div>

						<div className='w-1/5 justify-center items-center mx-auto'>
							<img src={Rocket} alt='Rocket' />
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Settings
