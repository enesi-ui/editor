;export class User {
  constructor(public readonly name: string) {}
}

class Auth {
  constructor() {}
  public async loggedIn(): Promise<boolean> {
    try {
      //return (await AWSAuth.currentSession()).isValid();
      return true;
    } catch (e) {
      console.log('not logged in:', e)
      return false;
    }
  }

  public async jwt(): Promise<string> {
    //const session = await AWSAuth.currentSession();
    //return session.getIdToken().getJwtToken();
    return 'jwt';
  }
}

const auth = new Auth();
export { auth };
