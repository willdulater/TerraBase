import ThreadButton from "./ThreadButton"
import { PlusIcon } from "@heroicons/react/24/outline"
import React, { useEffect } from "react";

const ThreadsTray = ({
	threads,
	setThreads,
	selectedThread,
	setSelectedThread,
	setShowTemplateSelector,
	selectedMode,
	setSelectedMode,
}) => {



	return (
		
		<div className='mt-10 self-start overflow-y-scroll w-full'>

			<div className="w-full border-t border-gray-300 sticky top-0 bg-white z-10"></div>
			
			
			{threads.map((thread, index) => {
				return (
					<ThreadButton
						key={thread.id}
						thread={thread}
						threads={threads}
						setThreads={setThreads}
						selectedThread={selectedThread}
						setSelectedThread={setSelectedThread}
						setShowTemplateSelector={setShowTemplateSelector}
					/>
				)
			})}

			{/* New Button for Template Selector */}
			<div
				className="flex justify-center items-center" // Ensures the button is centered in the container
			>
				<div
					className="flex flex-row justify-center items-center bg-[#0f4d92] hover:bg-[#00356b] w-3/4 mt-5 mb-2 rounded-[0.5rem] p-3 hover:cursor-pointer"
					onClick={() => setShowTemplateSelector(true)}
				>
					<PlusIcon className="h-5 w-5 text-[#ffffff] mr-2" aria-hidden="true" />
					<p className="text-white font-normal">New</p>
				</div>
			</div>
		</div>
	)
}

export default ThreadsTray
