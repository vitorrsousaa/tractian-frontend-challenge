interface SearchProps {
	value: string;
	onChange: (value: string) => void;
}

export function Search(props: SearchProps) {
	const { value, onChange } = props;
	return (
		<div className="relative">
			<input
				type="text"
				placeholder="Buscar Ativo ou Local"
				className="w-full py-3 pl-3 pr-12 rounded bg-transparent outline-none border-b border-gray-300 mb-2"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	);
}
