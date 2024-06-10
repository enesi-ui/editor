import { SVGProps } from "react";

export const ChevronIcon = (props: SVGProps<SVGElement>) => {
  return (
    <svg
      className={`svg ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="7"
      viewBox="0 0 8 7"
    >
      <path
        fill="none"
        fillOpacity="1"
        fillRule="evenodd"
        stroke="currentColor"
        d="m3.646 5.354-3-3 .708-.708L4 4.293l2.646-2.647.708.708-3 3L4 5.707l-.354-.353z"
      ></path>
    </svg>
  );
};
