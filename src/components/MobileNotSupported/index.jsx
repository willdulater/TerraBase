import phone from "../../svg/phone.svg"
import logo from "../../img/logo2.png"
import Request from "../Request"
import { useState } from "react"
import { toast } from "react-hot-toast"

const MobileNotSupported = ({}) => {
	const [email, setEmail] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitted, setSubmitted] = useState(false)

	const handleEmail = (e) => {
		if (email === "") {
			toast.error("Please enter an email address")
			return
		}

		e.preventDefault()
		setIsSubmitting(true)

		const emailRequest = new Request("waitlist/", {
			method: "POST",
			data: {
				email: email,
			},
		})

		emailRequest
			.then((res) => {
				setIsSubmitting(false)
				setSubmitted(true)
			})
			.catch((err) => {
				toast.error(err.response.data.message)
				setIsSubmitting(false)
			})
	}

	return (
		<div className='h-screen w-screen flex flex-col items-center from-[#FFFFFF] to-[#F5F4FF] bg-gradient-135'>
			<div className='flex flex-row w-full justify-between items-center px-10 py-5'>
				<img src={logo} className='h-10' />
			</div>
			<img src={phone} className='h-fit mt-10 w-1/2' />
			<p className='text-center font-bold mt-5'>
				We're sorry. Suppal isn't built for mobile, yet!
			</p>

			<p className='text-center'>
				Enter your email below, and I'll personally send you a reminder to check
				us out on your laptop or tablet.
			</p>
			<div className='flex flex-row mt-10'>
				{submitted && (
					<p className='text-center mt-1 font-bold'>
						Thanks! Look out for an email from us soon!
					</p>
				)}

				<form
					onSubmit={(e) => handleEmail(e)}
					className={submitted ? " hidden" : ""}
				>
					<input
						id='email'
						name='email'
						type='email'
						className={"rounded-md p-3"}
						placeholder='Enter your email'
						value={email}
						autoComplete='username'
						onChange={(e) => setEmail(e.target.value)}
					/>

					<button type='submit' className='bg-[#7421FC] rounded-lg p-3 ml-2'>
						{isSubmitting ? (
							<p className='text-white font-semibold'>Submitting...</p>
						) : (
							<p className='text-white font-semibold'>Remind Me</p>
						)}
					</button>
				</form>
			</div>

			<div className='mt-auto'>
				<p className='font-bold text-black/75 font-bold text-xs'>
					Made with ❤️ at Yale
				</p>
			</div>
		</div>
	)
}

export default MobileNotSupported
