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
    <div className={`flex justify-between ${className} px-3`}>
      <span>{label}</span>
      <button
        className="btn btn-ghost btn-sm btn-square p-1 hover:bg-base-content/20 flex items-center justify-center"
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {icon}
      </button>
    </div>
  );
};
