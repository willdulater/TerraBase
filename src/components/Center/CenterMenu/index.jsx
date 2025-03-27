import {
	ArrowPathIcon,
	ArrowTrendingUpIcon,
	ScissorsIcon,
	SparklesIcon,
} from "@heroicons/react/20/solid"

const CenterMenu = ({ showMenu, bounds, handleContextMenu }) => {
	const menuOption = ({ mode, icon, text }) => {
		return (
			<div
				className='p-2 text-sm font-medium w-full hover:cursor-pointer hover:bg-delilahPrimary/50 flex flex-row text-[#475467]'
				onMouseDown={(e) => handleContextMenu(e, mode)}
			>
				{icon}
				<p className='ml-2 '>{text}</p>
			</div>
		)
	}

	return (
		<div
			className={
				"flex flex-col bg-[#FFFFFF] rounded absolute space-x-1 text-black items-center justify-center border border-slate-200" +
				(showMenu ? "" : " hidden")
			}
			style={
				bounds
					? {
							top: bounds.top + 220,
							left: bounds.left,
							minWidth: 100,
							maxWidth: 200,
					  }
					: {}
			}
		>
			<p className='font-normal text-xs text-left text-slate-500 mt-2 self-start ml-2'>
				Delilah Options
			</p>
			{menuOption({
				mode: "flowery",
				icon: <SparklesIcon className='h-5 w-5 text-violet-700' />,
				text: "Show Don't Tell",
			})}
			{menuOption({
				mode: "expand",
				icon: <ArrowTrendingUpIcon className='h-5 w-5 text-green-700' />,
				text: "Expand",
			})}
			{menuOption({
				mode: "summarize",
				icon: <ScissorsIcon className='h-5 w-5 text-red-700' />,
				text: "Summarize",
			})}
			{menuOption({
				mode: "regenerate",
				icon: <ArrowPathIcon className='h-5 w-5 text-yellow-500' />,
				text: "Regenerate",
			})}
		</div>
	)
}

export default CenterMenu
