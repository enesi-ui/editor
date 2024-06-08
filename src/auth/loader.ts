import { auth } from "~/service/auth.ts";
import { LoaderFunctionArgs, redirect } from "react-router-dom";

export const loginLoader = async () => {
  if (await auth.loggedIn()) {
    return redirect("/");
  } else {
    return null;
  }
};

export const protectedLoader = async ({ request }: LoaderFunctionArgs) => {
  if (!(await auth.loggedIn())) {
    const params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }
  return null;
};
