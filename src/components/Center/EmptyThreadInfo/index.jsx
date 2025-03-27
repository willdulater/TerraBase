import ChatBubbles from "../../../svg/chat-bubbles.svg"
import LightningBolt from "../../../svg/lightning-bolt.svg"
import Warning from "../../../svg/warning.svg"

const EmptyThreadInfo = () => {
	const EmptyThreadInfoBox = ({ icon, title, text1, text2, text3 }) => {
		return (
			<div className="w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col p-5 bg-white rounded-lg border-4 border-b-[#7C55D6] border-t-white border-l-white border-r-white">
				<div className="flex gap-5 items-center m-auto text-lg font-bold md:flex-col md:gap-2 text-black">
					<div className="flex items-center justify-center">
						<div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
							<div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
								<img src={icon} alt="Your SVG" />
							</div>
						</div>
					</div>
					{title}
				</div>
				<ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
					<li className="w-full text-slate-500 text-sm rounded-md p-1">
						{text1}
					</li>
					<li className="w-full text-slate-500 text-sm rounded-md p-1">
						{text2}
					</li>
					<li className="w-full text-slate-500 text-sm rounded-md p-1">
						{text3}
					</li>
				</ul>
			</div>
		)
	}

	return (
		<div className="flex flex-col items-center justify-center h-full">
			<div className="w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col px-6 dark:text-gray-100">
				<h1 className="text-4xl font-semibold text-center mt-6 sm:mt-[20vh] ml-auto mr-auto mb-10 sm:mb-16 flex gap-2 items-center justify-center"></h1>
				<div className="md:flex items-start text-center gap-3.5">
					<EmptyThreadInfoBox
						icon={ChatBubbles}
						title="Best Effect"
						text1="Be extremely weird and specific."
						text2="Constantly feed Delilah with new and specific information."
						text3="Use 'Show Don't Tell' to create a more vivid experience.'"
						clickable={true}
					></EmptyThreadInfoBox>
					<EmptyThreadInfoBox
						icon={LightningBolt}
						title="Capabilities"
						text1="Creates personal anecdotes showcasing the user's personality"
						text2="Allows user to provide follow-up correction"
						text3="Remembers what the user said earlier in the conversation."
						clickable={false}
					></EmptyThreadInfoBox>
					<EmptyThreadInfoBox
						icon={Warning}
						title="Limitations"
						text1="Requires you to input very detailed and specific experiences"
						text2="Limited knowledge of the world and events after 2021"
						text3="May occasionally produce harmful instructions or biased content"
						clickable={false}
					></EmptyThreadInfoBox>
				</div>
			</div>
		</div>
	)
}

export default EmptyThreadInfo
