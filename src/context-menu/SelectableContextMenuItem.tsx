import { ReactNode } from "react";

export type ContextMenuItemProps = {
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  onClick: () => void;
  active?: boolean;
};
export const SelectableContextMenuItem = ({
  icon,
  label,
  shortcut,
  onClick,
}: ContextMenuItemProps) => {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer hover:bg-accent text-sm"
    >
      <div className="flex justify-start flex-row">
        <span className="p-1 flex items-center w-[17px]" />
        {icon && <span className="p-1 flex items-center">{icon}</span>}
        <span className="p-1">{label}</span>
        {shortcut && <span className="p-1">{shortcut}</span>}
      </div>
    </div>
  );
};
