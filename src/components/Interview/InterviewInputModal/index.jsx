import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import {
	AcademicCapIcon,
	XMarkIcon,
	CheckCircleIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from "@heroicons/react/24/outline"
import { CheckCircleIcon as CheckCircleIconSolid } from "@heroicons/react/24/solid"
import Request from "../../Request"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"

const InterviewInputModal = ({
	open,
	setOpen,
	interviewThreads,
	setInterviewThreads,
	selectedInterviewThread,
	setSelectedInterviewThread,
	socket,
}) => {
	useEffect(() => {
		if (!open) {
			setInputText("")
		}
		setTimeout(() => {
			setSelectedQuestion(null)
		}, 500)
	}, [open])

	const [inputText, setInputText] = useState("")
	const [selectedQuestion, setSelectedQuestion] = useState(null)
	const [schoolName, setSchoolName] = useState("")
	const [interviewType, setInterviewType] = useState("general") // Default to "general"

	// Questions based on interview type
	const questionsList = {
		general: [
			{ id: 1, question: "Why do you want to attend this school?" },
			{ id: 2, question: "What are your long-term goals?" },
			{ id: 3, question: "How do you handle challenges or setbacks?" },
		],
		academic: [
			{ id: 1, question: "What’s your favorite subject and why?" },
			{ id: 2, question: "Describe a project or research you’re passionate about." },
		],
		extracurricular: [
			{ id: 1, question: "Tell me about an extracurricular activity you love." },
			{ id: 2, question: "How have you demonstrated leadership outside of school?" },
		],
	}

	// Dynamically set questions based on selected interview type
	const currentQuestions = questionsList[interviewType] || []

	const handleNewInterviewThread = () => {
		if (!schoolName) {
			toast.error("Please enter a school name.")
			return
		}

		const threadRequest = new Request("interviewthreads/", {
			method: "POST",
			data: {
				title: `${schoolName} Interview (${interviewType})`,
				description: "This is the new interview's description",
			},
		})
		threadRequest
			.then((res) => {
				const newThread = res.data
				setInterviewThreads([...interviewThreads, newThread])
				setSelectedInterviewThread(newThread.id)

				socket.send(
					JSON.stringify({
						command: `Conduct a ${interviewType} interview for ${schoolName}`,
						websocket_type: "interview",
						thread_id: newThread.id,
					})
				)
				setOpen(false)
			})
			.catch((err) => {
				toast.error(err.response.data.message || "An error occurred")
			})
	}

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as='div' className='relative z-10' onClose={setOpen}>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
				</Transition.Child>

				<div className='fixed inset-0 z-10 overflow-y-auto'>
					<div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
							enterTo='opacity-100 translate-y-0 sm:scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 translate-y-0 sm:scale-100'
							leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
						>
							<Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-2/5 sm:p-6'>
								<div>
									<h3 className='text-lg font-bold'>Start a New Interview</h3>

									{/* School Input */}
									<div className='mt-4'>
										<label className='block text-sm font-medium text-gray-700'>
											School Name
										</label>
										<input
											type='text'
											className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
											placeholder='Enter the school name...'
											value={schoolName}
											onChange={(e) => setSchoolName(e.target.value)}
										/>
									</div>

									{/* Interview Type Selection */}
									<div className='mt-4'>
										<label className='block text-sm font-medium text-gray-700'>
											Interview Type
										</label>
										<select
											className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
											value={interviewType}
											onChange={(e) => setInterviewType(e.target.value)}
										>
											<option value='general'>General Interview</option>
											<option value='academic'>Academic-Focused</option>
											<option value='extracurricular'>Extracurricular-Focused</option>
										</select>
									</div>

									{/* Questions Display */}
									<div className='mt-4'>
										<h4 className='text-sm font-medium text-gray-700'>
											Example Questions
										</h4>
										<ul className='list-disc list-inside mt-2'>
											{currentQuestions.map((q) => (
												<li key={q.id}>{q.question}</li>
											))}
										</ul>
									</div>

									{/* Start Interview Button */}
									<div className='mt-5 flex justify-end'>
										<button
											className='inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:text-sm'
											onClick={() => setOpen(false)}
										>
											Cancel
										</button>
										<button
											className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 sm:text-sm'
											onClick={handleNewInterviewThread}
											disabled={!schoolName}
										>
											Start Interview
										</button>
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

export default InterviewInputModal
