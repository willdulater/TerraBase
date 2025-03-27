import Request from "../../Request/index.jsx"
import { PlusIcon } from "@heroicons/react/24/outline"

const NewFreewriteThreadButton = ({
	freewriteThreads,
	setFreewriteThreads,
	setSelectedFreewriteThread,
	setShowCTASubscribed,
}) => {
	const submitNewThread = () => {
		const threadRequest = new Request("freewritethreads/", {
			method: "POST",
			data: {
				title: "Refine Essay",
				description: "This is the new thread's description",
			},
		})
		threadRequest
			.then((res) => {
				setFreewriteThreads([...freewriteThreads, res.data])
				setSelectedFreewriteThread(res.data.id)
			})
			.catch((err) => {
				setShowCTASubscribed(true)
			})
	}

	return (

		<div
				className="flex justify-center items-center" // Ensures the button is centered in the container
			>
				<div
					className="flex flex-row justify-center items-center bg-[#90CAF9]/50 hover:bg-[#90CAF9] w-3/4 mt-5 mb-2 rounded-[0.5rem] p-3 hover:cursor-pointer"
					onClick={() => submitNewThread()}
				>
					<PlusIcon className="h-5 w-5 text-[#00356b] mr-2" aria-hidden="true" />
					<p className="text-black font-normal">New</p>
				</div>
			</div>
	)
}

export default NewFreewriteThreadButton
