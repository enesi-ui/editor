import { Link } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";
export const Login = () => {
  return (
    <div>
      <Authenticator>
        {({ signOut, user }) => {
          return (
            <div>
              <p>Welcome {user?.attributes?.email}</p>
              <Link to="/editor">Editor</Link>
              <button onClick={signOut}>Sign out</button>
            </div>
          );
        }}
      </Authenticator>
    </div>
  );
};
