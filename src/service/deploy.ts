import { auth } from "./auth.ts";

class Deploy {
  constructor(private readonly endpoint: string) {}
  async call(variables: { name: string; code: string }) {
    await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${await auth.jwt()}`,
      },
      body: JSON.stringify(variables),
    });
  }
}
const deploy = new Deploy(import.meta.env.VITE_DEPLOY_ENDPOINT as string);
export default deploy;
