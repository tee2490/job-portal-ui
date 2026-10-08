import { cloneElement, isValidElement, useId } from "react";

export const Tooltip = ({ content, children }) => {
	const tooltipId = useId();

	const trigger = isValidElement(children)
		? cloneElement(children, { "aria-describedby": tooltipId })
		: children;

	return (
		<span className="group/tooltip relative inline-flex">
			{trigger}
			<span
				id={tooltipId}
				role="tooltip"
				className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 w-64 -translate-x-1/2 translate-y-1 rounded-xl border border-gray-700/50 bg-gray-800/95 p-4 text-left text-xs leading-relaxed text-gray-300 opacity-0 shadow-2xl backdrop-blur-sm transition-all duration-300 invisible group-hover/tooltip:visible group-hover/tooltip:translate-y-0 group-hover/tooltip:opacity-100 group-focus-within/tooltip:visible group-focus-within/tooltip:translate-y-0 group-focus-within/tooltip:opacity-100"
			>
				<span className="absolute inset-x-0 top-0 h-px rounded-t-xl bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500"></span>
				{content}
				<span className="absolute left-1/2 top-full -mt-1.5 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-gray-700/50 bg-gray-800"></span>
			</span>
		</span>
	);
};
