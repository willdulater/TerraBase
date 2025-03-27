import { Dialog, Transition } from "@headlessui/react"
import {
	AcademicCapIcon,
	XMarkIcon,
	CheckCircleIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	ChatBubbleOvalLeftIcon,
	DocumentTextIcon,
} from "@heroicons/react/24/outline"
import { CheckCircleIcon as CheckCircleIconSolid } from "@heroicons/react/24/solid"
import Request from "../../Request"
import { useState, useEffect, Fragment } from "react"
import InfoCircle from "../../../svg/info-circle.svg"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import TextareaAutosize from "react-textarea-autosize"
import * as Sentry from "@sentry/react"

const ChatModal = ({
	open,
	setOpen,
	threads,
	setThreads,
	selectedThread,
	setSelectedThread,
	socket,
}) => {
	useEffect(() => {
		if (!open) {
			setTimeout(() => {
				setTitleText("")
				setTopicText("")
				setExperiencesText("")
				setSelectedOutputType("introduction")
			}, 500)
		}
	}, [open])

	const [titleText, setTitleText] = useState("")
	const [topicText, setTopicText] = useState("")
	const [experiencesText, setExperiencesText] = useState("")
	const [selectedOutputType, setSelectedOutputType] = useState("introduction")

	const submitNewThread = () => {
		const threadRequest = new Request("threads/", {
			method: "POST",
			data: {
				title: titleText === "" ? "New chat" : titleText,
				description: "This is the new thread's description",
			},
		})
		threadRequest
			.then((res) => {
				setThreads([...threads, res.data])
				setSelectedThread(res.data.id)

				
    const data = {
      prompt_type: "academic",
      command: "command",
      text_field_value: experiencesText,
      thread_id: selectedThread,
	  template_type: "academic",
    };
    socket.send(JSON.stringify({ ...data, websocket_type: "create" }));
			})
			.catch((err) => {
				Sentry.captureException(err)
			})
		setOpen(false)
	}

	const writtenEnoughClass = () => {
		return topicText.length > 30 &&
			experiencesText.length > 30 &&
			selectedOutputType !== ""
			? " bg-delilahSecondary"
			: " bg-delilahSecondary/50"
	}

	const topicTooltip = () => {
		return (
			<div className='bg-white p-2 rounded-lg shadow-lg max-w-[33vw] z-50'>
				<div className='flex flex-row justify-left items-center'>
					<div className='flex flex-col justify-left items-left p-3 space-y-2'>
						<div>
							<p className='font-bold text-md text-[#545E6B]'>Good Examples</p>
							<div className='flex flex-row'>
								<p>•</p>
								<p className='italic ml-1'>
									The view from my NYC bedroom window at 3 AM
								</p>
							</div>
							<div className='flex flex-row'>
								<p>•</p>
								<p className='italic ml-1'>
									Lunar New Year celebration with family from across the country
								</p>
							</div>
							<div className='flex flex-row'>
								<p>•</p>
								<p className='italic ml-1'>
									My collection of postcards from every state park in Vermont
								</p>
							</div>
						</div>
						<div>
							<p className='font-bold text-md text-[#545E6B]'>Bad Examples</p>
							<div className='flex flex-row'>
								<p>•</p>
								<p className='italic ml-1'>Donating to a charity</p>
							</div>
							<div className='flex flex-row'>
								<p>•</p>
								<p className='italic ml-1'>Winning a debate tournament</p>
							</div>
							<div className='flex flex-row'>
								<p>•</p>
								<p className='italic ml-1'>My science fair project</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
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

				<div
					className='fixed inset-0 z-10 overflow-y-auto'
					onKeyDown={(e) => {
						if (e.key === "Escape") {
							e.preventDefault()
						}
					}}
				>
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
							<Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-2/5 sm:p-6 sm:px-12'>
								<div className='mt-3 text-center sm:mt-0 sm:text-left'>
									<p className='text-lg font-bold'>Generate</p>
								</div>

								<div className='flex flex-col mt-3 space-y-3'>
									<div className='flex flex-col w-1/2'>
										<p className='text-xs text-[#545E6B] font-bold'>Title</p>
										<input
											type='text'
											className='border-[1px] border-[#E5E7EB] rounded-lg p-2 mt-1'
											placeholder='New chat title'
											value={titleText}
											onChange={(e) => setTitleText(e.target.value)}
										/>
									</div>

									<div className='flex flex-col'>
										<div className='flex flex-row'>
											<p className='text-xs text-[#545E6B] font-bold'>
												Output Type
											</p>
											<p className='text-xs text-red-600 font-bold ml-1'>*</p>
										</div>
										<div className='flex flex-row space-x-3'>
											<div
												className={
													"flex flex-row hover:cursor-pointer border-[1px] border-[#E5E7EB] rounded-lg p-2 mt-1 w-fit items-center" +
													(selectedOutputType === "introduction"
														? " bg-delilahSecondary/50 font-bold"
														: " ")
												}
												onClick={() => setSelectedOutputType("introduction")}
												tabIndex={0}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														setSelectedOutputType("introduction")
													}
												}}
											>
												<ChatBubbleOvalLeftIcon className='h-5 w-5 text-black' />
												<p className='text-sm text-black ml-1'>
													Introduction Paragraph
												</p>
											</div>
											<div
												className={
													"flex flex-row hover:cursor-pointer border-[1px] border-[#E5E7EB] rounded-lg p-2 mt-1 w-fit items-center" +
													(selectedOutputType === "outline"
														? " bg-delilahSecondary/50 font-bold"
														: " ")
												}
												onClick={() => setSelectedOutputType("outline")}
												tabIndex={0}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														setSelectedOutputType("outline")
													}
												}}
											>
												<DocumentTextIcon className='h-5 w-5 text-black' />
												<p className='text-sm text-black ml-1'>Essay Outline</p>
											</div>
										</div>
									</div>

									<div className='flex flex-col'>
										<div className='flex flex-row justify-between'>
											<div className='flex flex-row'>
												<p className='text-xs text-[#545E6B] font-bold'>
													Topic
												</p>
												<p className='text-xs text-red-600 font-bold ml-1'>*</p>
											</div>
											<p
												className={
													"text-xs font-bold" +
													(topicText.length < 30
														? " text-red-600"
														: " text-green-600")
												}
											>
												{topicText.length}/30 characters minimum
											</p>
										</div>
										<input
											type='text'
											className='border-[1px] border-[#E5E7EB] rounded-lg p-2 mt-1'
											value={topicText}
											onChange={(e) => setTopicText(e.target.value)}
											placeholder='My love for a warm, gooey, delicious grilled cheese sandwich'
										/>
										<div className='self-end mt-1'>
											<OverlayTrigger
												trigger='click'
												key={"top"}
												placement={"top"}
												rootClose={true}
												overlay={topicTooltip()}
											>
												<div className='cursor-pointer flex flex-row'>
													<p className='text-xs text-blue-600 font-bold ml-1'>
														inspiration?
													</p>
												</div>
											</OverlayTrigger>
										</div>
									</div>

									<div className='flex flex-col'>
										<div className='flex flex-row justify-between'>
											<div className='flex flex-row'>
												<p className='text-xs text-[#545E6B] font-bold'>
													Experiences
												</p>
												<p className='text-xs text-red-600 font-bold ml-1'>*</p>
											</div>
											<p
												className={
													"text-xs font-bold" +
													(experiencesText.length < 30
														? " text-red-600"
														: " text-green-600")
												}
											>
												{experiencesText.length}/30 characters minimum
											</p>
										</div>
										<input
											type='text'
											className='border-[1px] border-[#E5E7EB] rounded-lg p-2 mt-1'
											value={experiencesText}
											onChange={(e) => setExperiencesText(e.target.value)}
											placeholder='Growing up in the back of my moms kitchen as a Vietnamese refugee'
										/>
									</div>
								</div>

								<div className='mt-5 sm:mt-8 flex flex-row justify-end'>
									<button
										type='button'
										className='mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-1/4 sm:text-sm'
										onClick={() => setOpen(false)}
									>
										Cancel
									</button>
									<button
										type='button'
										className={
											"inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-delilahPrimary/80 focus:ring-offset-2 sm:ml-3 sm:w-3/4 sm:text-sm" +
											writtenEnoughClass()
										}
										onClick={(e) => submitNewThread()}
										disabled={
											topicText.length < 30 && selectedOutputType !== ""
										}
									>
										Generate
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

export default ChatModal
