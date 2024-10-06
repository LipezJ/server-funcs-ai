export interface ToastProps {
  title: string;
  message?: string;
}

type Toaster = HTMLElement & {
  show?: (props: ToastProps) => void;
}

export default function toast(props: ToastProps) {
  const $toast = document.querySelector('#toast') as Toaster;
  if (!$toast || !$toast.show) {
    alert(props.message ?? props.title);
  }

  // @ts-ignore
  $toast?.show(props);
}
