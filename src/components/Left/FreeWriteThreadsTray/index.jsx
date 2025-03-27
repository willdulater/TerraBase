import FreewriteThreadButton from "./FreewriteThreadButton"
import NewFreewriteThreadButton from "./NewFreewriteThreadButton";

const FreeWriteThreadsTray = ({
	freewriteThreads,
	setFreewriteThreads,
	selectedFreewriteThread,
	setSelectedFreewriteThread,
	setShowCTASubscribed,
}) => {
	return (
		<div className='mt-10 self-start grow overflow-y-scroll w-full'>

			<div className="w-full border-t border-gray-300 sticky top-0 bg-white z-10"></div>

			{freewriteThreads.map((thread, index) => {
				return (
					<FreewriteThreadButton
						key={index}
						thread={thread}
						freewriteThreads={freewriteThreads}
						setFreewriteThreads={setFreewriteThreads}
						selectedFreewriteThread={selectedFreewriteThread}
						setSelectedFreewriteThread={setSelectedFreewriteThread}
					/>
				)
			})}

			<NewFreewriteThreadButton
						freewriteThreads={freewriteThreads}
						setFreewriteThreads={setFreewriteThreads}
						setSelectedFreewriteThread={setSelectedFreewriteThread}
						setShowCTASubscribed={setShowCTASubscribed}
					/>
		</div>
	)
}

export default FreeWriteThreadsTray
