import InterviewThreadButton from "./InterviewThreadButton"
import NewInterviewButton from "../NewInterviewButton"

const InterviewThreadsTray = ({
	interviewThreads,
	setInterviewThreads,
	selectedInterviewThread,
	setSelectedInterviewThread,
	setShowInterviewModal,
	setShowCTASubscribed,
}) => {
	return (
		<div className='mt-10 self-start overflow-y-scroll w-full'>
			<div className="w-full border-t border-gray-300 sticky top-0 bg-white z-10"></div>

			{interviewThreads.map((thread, index) => {
				return (
					<InterviewThreadButton
						key={index}
						thread={thread}
						interviewThreads={interviewThreads}
						setInterviewThreads={setInterviewThreads}
						selectedInterviewThread={selectedInterviewThread}
						setSelectedInterviewThread={setSelectedInterviewThread}
					/>
				)
			})}


			<NewInterviewButton
						setShowInterviewModal={setShowInterviewModal}
						setShowCTASubscribed={setShowCTASubscribed}
					/>


		</div>
	)
}

export default InterviewThreadsTray
