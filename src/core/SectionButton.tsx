import { MouseEvent, ReactNode } from "react";

export interface AddButtonProps {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  ariaLabel: string;
  label: string;
  icon: ReactNode;
  topBorder?: boolean;
}
export const SectionButton = (props: AddButtonProps) => {
  const borderClass = props.topBorder
    ? "border-t-[color:var(--color-border)] border-t border-solid"
    : "";
  return (
    <button
      className={`group grid grid-rows-1 grid-cols-3 p-2 items-center col-span-2 ${borderClass}`}
      aria-label={props.ariaLabel}
      onClick={props.onClick}
    >
      <span className="flex justify-start group-hover:text-primary-700 text-sm">
        {props.label}
      </span>
      <span className="col-end-4 col-start-3 flex justify-self-end group-hover:text-primary-700 hover:bg-primary-100 w-8 h-8 justify-center items-center">
        {props.icon}
      </span>
    </button>
  );
};
