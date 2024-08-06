interface Props {
	style: 'pri' | 'sec';
	children: React.ReactNode;
	type: 'button' | 'submit' | 'reset';
	onClick?: () => void;
	className?: string;
}

const styles = {
	pri: `text-base font-medium text-center text-text 
    rounded-md bg-pri border border-pri focus:ring-4 focus:ring-pri/20`,
	sec: `text-base font-medium text-center border rounded-md box-content
    focus:ring-4 text-sec border-paragraph border focus:ring-gray-200/50`,
};

export default function Button(props: Props) {
	return (
		<button
			className={`
        inline-flex items-center justify-center box-border
        ${styles[props.style]} ${props.className}
      `}
			type={props.type}
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
}
