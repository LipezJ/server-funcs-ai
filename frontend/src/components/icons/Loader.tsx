export default function Loader() {
	return (
		<>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="size-6 -mb-1 text-text"
				viewBox="0 0 24 24"
			>
				<title>loader</title>
				<circle
					className="spinner_qM83 spinner_ZTLf"
					cx="20"
					cy="12"
					r="3"
					fill="currentColor"
				/>
				<circle
					className="spinner_qM83"
					cx="4"
					cy="12"
					r="3"
					fill="currentColor"
				/>
				<circle
					className="spinner_qM83 spinner_oXPr"
					cx="12"
					cy="12"
					r="3"
					fill="currentColor"
				/>
			</svg>

			<style>
				{`.spinner_qM83 {
          animation: spinner_8HQG 1.05s infinite;
        }
        .spinner_oXPr {
          animation-delay: 0.1s;
        }
        .spinner_ZTLf {
          animation-delay: 0.2s;
        }
        @keyframes spinner_8HQG {
          0%,
          57.14% {
            animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
            transform: translate(0);
          }
          28.57% {
            animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
            transform: translateY(-6px);
          }
          100% {
            transform: translate(0);
          }
        }`}
			</style>
		</>
	);
}
