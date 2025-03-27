import "./style.css"
import Request from "../../Request/index.jsx"
import { PlusIcon } from "@heroicons/react/24/outline"

const NewThreadButton = ({
	threads,
	setThreads,
	setSelectedThread,
	setShowCTASubscribed,
	setShowChatModal,
}) => {
	return (
		<div
			className='flex flex-row justify-center items-center bg-delilahSecondary w-3/4 mt-5 rounded-[0.5rem] p-3 hover:cursor-pointer'
			onClick={() => setShowChatModal(true)}
		>
			<PlusIcon className='h-5 w-5 text-white mr-2' aria-hidden='true' />
			<p className='text-white font-normal'>New Generation</p>
		</div>
	)
}

export default NewThreadButton
