import "./style.css"
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid"

const PricingCard = ({
	planName,
	bg,
	price,
	upgradeButton,
	handleSubscription,
	fullWidth,
}) => {
	return (
		<div
			className={
				"flex flex-col h-full rounded-2xl p-4 px-8" +
				(bg === "white"
					? " bg-white"
					: " from-[#9251FF] to-[#6203FF] bg-gradient-135") +
				(fullWidth ? " w-full" : " w-fit")
			}
		>
			<p
				className={
					"uppercase font-extrabold my-4 " +
					(planName === "Basic" ? " text-[#000000]/50" : " ") +
					(planName === "Premium" ? " text-[#7421FC]" : " ") +
					(planName === "Early Access Special" ? " text-white" : "")
				}
			>
				{planName}
			</p>
			<p
				className={
					"text-[2.5rem] font-bold" +
					(bg === "white" ? " text-[#19154e]" : " text-white")
				}
			>
				{price}
			</p>
			<div
				className={
					"flex flex-col space-y-2 justify-between mt-2 ml-2 font-extrabold" +
					(bg === "white" ? " text-[#19154e]" : " text-white")
				}
			>
				<div className='flex flex-row h-fit'>
					<CheckCircleIcon className='h-6 w-6' />
					<p className='ml-2'>
						{planName === "Basic" && "For Trying"}
						{planName === "Premium" && "For Applying"}
						{planName === "Early Access Special" &&
							"Revolutionize Your Writing"}
					</p>
				</div>
				<div className='flex flex-row'>
					<CheckCircleIcon className='h-6 w-6' />
					<p className='ml-2'>
						{planName === "Basic" && "Scholarship List"}
						{planName === "Premium" && "Same Day Email Support"}
						{planName === "Early Access Special" && "Text Us Personally"}
					</p>
				</div>
				<div className='flex flex-row h-fit'>
					<CheckCircleIcon className='h-6 w-6' />
					<p className='ml-2'>
						{planName === "Basic" && "3 Brainstorms"}
						{planName === "Premium" && "10 Brainstorms"}
						{planName === "Early Access Special" && "Unlimited Brainstorms"}
					</p>
				</div>
				<div className='flex flex-row h-fit'>
					<CheckCircleIcon className='h-6 w-6' />
					<p className='ml-2'>
						{planName === "Basic" && "3 Chats"}
						{planName === "Premium" && "10 Chats"}
						{planName === "Early Access Special" && "Unlimited Chats"}
					</p>
				</div>
				<div className='flex flex-row h-fit'>
					<CheckCircleIcon className='h-6 w-6' />
					<p className='ml-2'>
						{planName === "Basic" && "3 Freewrites"}
						{planName === "Premium" && "10 Freewrites"}
						{planName === "Early Access Special" && "Unlimited Freewrites"}
					</p>
				</div>
				<div className='flex flex-row'>
					{planName === "Basic" ? (
						<XCircleIcon className='h-6 w-6 text-red-500' />
					) : (
						<CheckCircleIcon className='h-6 w-6' />
					)}

					<p className={"ml-2 "}>
						{planName === "Basic" && "10,000 words per month"}
						{planName === "Premium" && "100,000 words per month"}
						{planName === "Early Access Special" && "Unlimited Words"}
					</p>
				</div>
			</div>
			{upgradeButton === "current" && (
				<div className='flex flex-col space-y-2 justify-between mt-6 ml-2 font-extrabold border-[1px] border-slate-200 rounded-2xl p-4 text-center'>
					<p>Current Plan</p>
				</div>
			)}
			{planName === "Premium" && (
				<div
					className='flex flex-col space-y-2 justify-between mt-6 ml-2 font-extrabold rounded-2xl p-4 text-center bg-delilahSecondary text-white hover:cursor-pointer hover:bg-delilahSecondary/90'
					onClick={() => handleSubscription("monthly")}
				>
					<p>Upgrade Now</p>
				</div>
			)}
			{planName === "Early Access Special" && (
				<div
					className='flex flex-col space-y-2 justify-between mt-6 ml-2 font-extrabold rounded-2xl p-4 text-center bg-white hover:cursor-pointer hover:bg-white/95'
					onClick={() => handleSubscription("lifetime")}
				>
					<p>Unlock the Future</p>
				</div>
			)}
		</div>
	)
}

export default PricingCard
