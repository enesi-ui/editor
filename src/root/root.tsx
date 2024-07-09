import { Link, Outlet } from "react-router-dom";
import { LogoIcon } from "~/icon/LogoIcon.tsx";

export const Root = () => {
  return (
    <div className="mt-64 mx-auto flex h-fit w-fit">
      <Link to="/start">
        <button className="btn btn-circle btn-lg">
          <LogoIcon className="text-primary" />
        </button>
      </Link>
      <Outlet />
    </div>
  );
};
