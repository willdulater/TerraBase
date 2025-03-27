import { useState, useEffect, useRef } from "react"
import InterviewMessage from "./InterviewMessage"
import InterviewForm from "./InterviewForm"
import Request from "../Request"
import { toast } from "react-hot-toast"

const Interview = ({
	interviewThreads,
	setInterviewThreads,
	selectedInterviewThread,
	setSelectedInterviewThread,
	socket,
	setShowCTASubscribed,
}) => {
	const [commandValue, setCommandValue] = useState("")
	const [formSubmitting, setFormSubmitting] = useState(false)

	const [predictedCommands, setPredictedCommands] = useState([null, null, null])
	const [loadingPredictedCommands, setLoadingPredictedCommands] =
		useState(false)

	useEffect(() => {
		if (socket === null) return

		socket.onmessage = (e) => {
			const data = JSON.parse(e.data)
			if (data["error"] !== undefined && data["error"] === "tokens_used") {
				setShowCTASubscribed(true)
				return
			}

			if (data["error"] !== undefined && data["error"] === "openai_error") {
				toast.error(data["message"])
			}

			if (data["output_text"] && data["websocket_type"] === "interview") {
				setInterviewThreads(
					interviewThreads.map((thread) => {
						if (thread.id === data["thread_id"]) {
							const lastCommand = thread.commands.slice(-1)[0]
							lastCommand.output_text =
								lastCommand.output_text + data["output_text"]
						}
						return thread
					})
				)
			}
			if (data["command"]) {
				setInterviewThreads(
					interviewThreads.map((thread) => {
						if (thread.id === selectedInterviewThread) {
							return {
								...thread,
								commands: [...thread.commands, data],
							}
						}
						return thread
					})
				)
			}

			if (data["status"] === "DONE") {
				generatePredictedCommands()
				setFormSubmitting(false)
			}
		}

		return () => {
			socket.onmessage = null
		}
	}, [interviewThreads, selectedInterviewThread, socket])

	useEffect(() => {
		const selectedThreadObj = interviewThreads.find(
			(thread) => thread.id === selectedInterviewThread
		)
		if (
			interviewThreads.length > 0 &&
			selectedThreadObj.commands.length > 0 &&
			!loadingPredictedCommands
		) {
			generatePredictedCommands()
		}
	}, [selectedInterviewThread])

	const sendCommand = (e) => {
		e.preventDefault()
		setLoadingPredictedCommands(true)
		socket.send(
			JSON.stringify({
				command: commandValue,
				websocket_type: "interview",
				thread_id: selectedInterviewThread,
			})
		)
		setCommandValue("")
	}

	const sendPredictedCommand = (command) => {
		setLoadingPredictedCommands(true)
		socket.send(
			JSON.stringify({
				command: command,
				websocket_type: "interview",
				thread_id: selectedInterviewThread,
			})
		)
	}

	const getThreadCommands = () => {
		if (interviewThreads.length === 0) return []
		return interviewThreads.find(
			(thread) => thread.id === selectedInterviewThread
		).commands
	}

	const generatePredictedCommands = () => {
		setLoadingPredictedCommands(true)

		const commandsRequest = new Request(
			"interviewthreads/" + selectedInterviewThread + "/commands/"
		)

		commandsRequest
			.then((res) => {
				setLoadingPredictedCommands(false)
				setPredictedCommands(res.data.commands)
			})
			.catch((err) => {
				setPredictedCommands([])
				toast.error(err.response.data.message)
				setLoadingPredictedCommands(false)
			})
	}

	const AlwaysScrollToBottom = () => {
		const elementRef = useRef()
		useEffect(() => elementRef.current.scrollIntoView())
		return <div ref={elementRef} />
	}

	return (
		<div className='h-screen w-full flex flex-col from-[#F4FAFE] to-[#F4FAFE] bg-gradient-135'>
			<div className='overflow-y-scroll overflow-x-hidden h-screen mx-auto left-0 right-0 w-5/6'>
				<>
					{getThreadCommands().map((command, index, arr) => {
						return (
							<div key={index}>
								<InterviewMessage
									text={command.command}
									writtenByDelilah={false}
									isLast={false}
									interviewThreads={interviewThreads}
									setInterviewThreads={setInterviewThreads}
									setSelectedInterviewThread={setSelectedInterviewThread}
									setShowCTASubscribed={setShowCTASubscribed}
								/>
								<InterviewMessage
									text={command.output_text}
									writtenByDelilah={true}
									isLast={arr.length - 1 === index}
									interviewThreads={interviewThreads}
									setInterviewThreads={setInterviewThreads}
									setSelectedInterviewThread={setSelectedInterviewThread}
									setShowCTASubscribed={setShowCTASubscribed}
								/>

								{index !== arr.length - 1 && (
									<div className="w-full h-px bg-gray-300 my-2"></div>
									)}
							</div>
						)
					})}
					<AlwaysScrollToBottom />
				</>
			</div>
			{getThreadCommands().length !== 0 && (
				<InterviewForm
					commandValue={commandValue}
					setCommandValue={setCommandValue}
					sendCommand={sendCommand}
					formSubmitting={formSubmitting}
					setFormSubmitting={setFormSubmitting}
					predictedCommands={predictedCommands}
					loadingPredictedCommands={loadingPredictedCommands}
					sendPredictedCommand={sendPredictedCommand}
				/>
			)}
		</div>
	)
}

export default Interview
