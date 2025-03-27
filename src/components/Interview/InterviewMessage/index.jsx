import { useAuth0 } from "@auth0/auth0-react"
import logo from "../../../img/pal.svg"

const InterviewMessage = ({ writtenByDelilah, text, isLast }) => {
	const { user } = useAuth0()
	const { picture } = user

	return (
		<div className='relative'>
			<div
				className={
					"flex flex-row mb-4 pl-6 " +
					(writtenByDelilah ? "bg-white " : " ") +
					(isLast ? " border-l-4 border-black shadow-lg rounded-xl" : " ") +
					(!isLast ? "rounded-xl " : " ")
				}
			>
				{!writtenByDelilah && (
					<img src={picture} alt='PFP' className='h-8 w-8 rounded-2xl mt-6' />
				)}
				{writtenByDelilah && (
					<img className='h-8 w-8 my-6' src={logo} alt='Suppal Logo' />
				)}

				<div className='flex flex-col items-start w-full p-3 items-center justify-center'>
					<div className={`text-black w-full p-3 rounded-md`}>
						<div className='whitespace-pre-wrap leading-7 hover:cursor-text relative'>
							{text.trim()}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
export default InterviewMessage
