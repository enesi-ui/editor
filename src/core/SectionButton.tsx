import { MouseEvent, ReactNode } from "react";

export interface AddButtonProps {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  ariaLabel: string;
  label: string;
  icon: ReactNode;
  className?: string;
}
export const SectionButton = (props: AddButtonProps) => {
  const { className, ariaLabel, label, icon, onClick } = props;
  return (
    <button
      className={`btn btn-block btn-ghost btn-sm ${className}`}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <span className="flex items-center justify-between w-full">
        <span>{label}</span>
        <span>{icon}</span>
      </span>
    </button>
  );
};
