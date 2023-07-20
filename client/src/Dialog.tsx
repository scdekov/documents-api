import { useRef, useEffect } from "react";

export const Dialog = ({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (ref.current) {
      if (open) {
        ref.current.showModal();
      } else {
        ref.current.close();
      }
    }
  }, [ref.current, open]);

  return <dialog ref={ref}>{children}</dialog>;
};
