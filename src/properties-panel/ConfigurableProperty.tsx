import { MouseEvent, ReactNode } from "react";

interface ConfigurablePropertyProps {
  label: string;
  value: string | boolean;
  id: string;
  type?: "text" | "boolean";
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  hoverActions: {
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    icon: ReactNode;
    arialLabel: string;
  }[];
}
export const ConfigurableProperty = (props: ConfigurablePropertyProps) => {
  const root =
    "group content-box grid grid-rows-1 grid-cols-7 p-2 items-center overflow-hidden whitespace-nowrap col-span-2 cursor-pointer h-8";
  return (
    <div className={root}>
      <span
        onClick={props.onClick}
        className={
          "text-sm flex w-full border border-transparent text-ellipsis overflow-hidden whitespace-nowrap col-end-[span_2]"
        }
      >
        {props.label}
      </span>
      <span
        className={
          "text-sm col-end-[span_2] text-ellipsis overflow-hidden whitespace-nowrap"
        }
        onClick={props.onClick}
      >
        {props.value.toString() === "" ? "empty" : props.value.toString()}
      </span>
      {props.hoverActions.map((action) => (
        <button
          key={action.arialLabel}
          onClick={action.onClick}
          aria-label={action.arialLabel}
          className={
            "hover:bg-primary-100 w-8 h-8 items-center justify-center justify-self-end hidden group-hover:flex"
          }
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
};
