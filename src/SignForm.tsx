import React, { useEffect, useState } from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { useNavigate } from 'react-router-dom';
import { userPool } from './MyCognitoUserPool';

interface SignFormProps {
  title: string;
  actionId: string;
}

function signUp(username: string, password: string, callbacks: FormActions) {
  const userAttributes = [
    new CognitoUserAttribute({ Name: 'email', Value: username }),
  ];

  userPool.signUp(username, password, userAttributes, [], (err, result) => {
    if (err) {
      callbacks.setErrorMessage(err.message);
      return;
    }
    if (result?.userConfirmed !== true) {
      callbacks.openCodeConfirm();
      return;
    }
    callbacks.navigator('/');
  });
}

function signIn(username: string, password: string, callbacks: FormActions) {
  const user = new CognitoUser({
    Pool: userPool,
    Username: username,
  });

  // set flow-type before invoking the authenticateUser method
  user.setAuthenticationFlowType('USER_PASSWORD_AUTH');

  user.authenticateUser(
    new AuthenticationDetails({
      Username: username,
      Password: password,
    }),
    {
      onFailure(err: Error): void {
        callbacks.setErrorMessage(err.message);
        if ('UserNotConfirmedException' === err.name) {
          callbacks.openCodeConfirm();
        }
      },
      onSuccess(
        session: CognitoUserSession,
        userConfirmationNecessary: boolean | undefined,
      ): void {
        console.log(`set session to login user: ${session}`);
        if (userConfirmationNecessary) {
          callbacks.openCodeConfirm();
        }
        callbacks.navigator('/');
      },
    },
  );
}

interface FormActions {
  setErrorMessage: (e: string) => void;
  openCodeConfirm: () => void;
  navigator: (s: string) => void;
}

function SignForm(props: SignFormProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorConfirm, setErrorConfirm] = useState('');
  const [confirmCode, setConfirmCode] = useState('');

  const navigator = useNavigate();

  useEffect(() => {
    if (userPool.getCurrentUser() != null) {
      navigator('/');
    }
  });

  const handleClick: React.MouseEventHandler = (e) => {
    setErrorMessage('');
    setErrorConfirm('');

    const actions: FormActions = {
      setErrorMessage,
      openCodeConfirm: onOpen,
      navigator,
    };

    if (props.actionId === 'signUp') {
      signUp(username, password, actions);
      return;
    }
    if (props.actionId === 'signIn') {
      signIn(username, password, actions);
      return;
    }
  };

  const handleConfirmCode: React.MouseEventHandler = (e) => {
    setErrorConfirm('');
    const user = new CognitoUser({
      Pool: userPool,
      Username: username,
    });
    user.confirmRegistration(confirmCode, false, (err, success) => {
      if (err) {
        setErrorConfirm(err.message);
        return;
      }

      onClose();
      setErrorConfirm('');
    });
  };

  const resendConfirmCode: React.MouseEventHandler = (e) => {
    const user = new CognitoUser({
      Pool: userPool,
      Username: username,
    });
    user.resendConfirmationCode((err, result) => {
      if (err) {
        setErrorConfirm(err.message);
        return;
      }
      setErrorConfirm('');
    });
  };

  return (
    <div id="SignForm">
      <Flex alignItems="center" justifyContent="center" height="100vh">
        <Flex
          direction="column"
          background="gray.100"
          padding="50"
          rounded={25}
          width={400}
        >
          <Heading mb={8}>{props.title}</Heading>
          <Text>Email</Text>
          <Input
            type="email"
            name="email"
            placeholder="foobarbar@example.com"
            className="input-text"
            background="white"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <Text>Password</Text>
          <Input
            type="password"
            name="password"
            placeholder={'*'.repeat(16)}
            className="input-text"
            background="white"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Button mt={8} colorScheme="facebook" onClick={handleClick}>
            {props.title.toLowerCase()}
          </Button>
          {errorMessage && (
            <Alert mt={4} status="error">
              {errorMessage}
            </Alert>
          )}
        </Flex>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Enter confirm code</Text>
            <Input
              type="number"
              onChange={(e) => {
                setConfirmCode(e.target.value);
              }}
            />
            {errorConfirm && (
              <Alert status="error" mt={8}>
                <AlertIcon />
                <AlertTitle>{errorConfirm}</AlertTitle>
              </Alert>
            )}
          </ModalBody>
          <ModalFooter>
            {errorConfirm && (
              <Button colorScheme="red" mr={3} onClick={resendConfirmCode}>
                Request another code
              </Button>
            )}
            <Button colorScheme="blue" mr={3} onClick={handleConfirmCode}>
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default SignForm;
