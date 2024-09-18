import { cn } from "@/utils/cn";
import React from "react";

interface ButtonProps {
	children?: React.ReactNode;
	isSelected?: boolean;
	variant?: "primary" | "secondary";
}

export function Button(props: ButtonProps) {
	const { children, isSelected, variant = "primary" } = props;

	return (
		<button
			type="button"
			className={cn(
				"flex flex-row items-center cursor-pointer gap-2  bg-blue-700 text-[12px] px-2 py-1 text-white rounded-md font-semibold",
				isSelected && "bg-blue-500",
				variant === "secondary" &&
					"bg-white border-gray-300 border text-gray-500",
			)}
		>
			{children}
		</button>
	);
}
