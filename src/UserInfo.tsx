import { CognitoUser } from 'amazon-cognito-identity-js';
import { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { currentUser } from './MyCognitoUserPool';

function UserInfo() {
  const [user, setUser] = useState<CognitoUser | null>(null);
  useEffect(() => {
    if (user == null) {
      setUser(currentUser);
    }
  }, [user]);

  if (user == null) {
    return <></>;
  }

  return (
    <Button
      id="user-info"
      colorScheme="twitter"
      onClick={(e) => {
        user?.signOut(() => {
          setUser(null);
        });
      }}
    >
      Logout: {user.getUsername()}
    </Button>
  );
}

export default UserInfo;
