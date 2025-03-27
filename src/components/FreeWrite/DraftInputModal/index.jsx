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

const DraftInputModal = ({ open, setOpen, selectedThread, socket }) => {
	const [draftText, setDraftText] = useState("")

	useEffect(() => {
		if (!open) {
			setTimeout(() => {
				setDraftText("")
			}, 500)
		}
	}, [open])

	const submitDraftText = () => {
		socket.send(
			JSON.stringify({
				draft_text: draftText,
				websocket_type: "freewritedraft",
				freewrite_thread_id: selectedThread,
			})
		)
		setOpen(false)
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
							<Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-2/5 sm:p-6 sm:px-12'>
								<div className='mt-3 text-center sm:mt-0 sm:text-left'>
									<p className='text-lg font-bold'>Generate a draft</p>
								</div>

								<div className='flex flex-col mt-3 space-y-3'>
									<div className='flex flex-col'>
										<div className='flex flex-row justify-between'>
											<div className='flex flex-row'>
												<p className='text-xs text-[#545E6B] font-bold'>
													What are you writing about?
												</p>
											</div>
										</div>
										<input
											type='text'
											className='border-[1px] border-[#E5E7EB] rounded-lg p-2 mt-1'
											value={draftText}
											onChange={(e) => setDraftText(e.target.value)}
											placeholder='A detailed description of the topic you want to write about'
										/>
									</div>
								</div>

								<div className='mt-5 sm:mt-10 flex flex-row justify-end w-full'>
									<button
										type='button'
										className='mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-2/5 sm:text-sm'
										onClick={() => setOpen(false)}
									>
										Cancel
									</button>
									<button
										type='button'
										className={
											"inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-delilahPrimary/80 focus:ring-offset-2 sm:ml-3 sm:w-2/5 sm:text-sm bg-delilahSecondary"
										}
										onClick={(e) => submitDraftText()}
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

export default DraftInputModal
