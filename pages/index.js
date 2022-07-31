import Head from 'next/head'
import { useCallback, useEffect, useRef, useState } from 'react';
import GoTrue from 'gotrue-js';

const auth = new GoTrue({
  APIUrl: 'https://btgz.dev/.netlify/identity',
  audience: '',
  setCookie: false,
});

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  
  const [confirmed, setConfirmed] = useState(false);
  
  const onSignupSubmit = useCallback((event) => {
    event.preventDefault();
    
    auth
      .signup(email, password, { test: true })
      .then((response) => console.log('Confirmation email sent', response))
      .catch((error) => console.log("It's an error", error));
    
  }, [email, password]);
  
  const onSigninSubmit = useCallback((event) => {
    event.preventDefault();

    auth
      .login(currentEmail, currentPassword, true)
      .then((response) => {
        console.log(`Success! Response: ${JSON.stringify({ response })}`);
      })
      .catch((error) => console.log(`Failed :( ${JSON.stringify(error)}`));
    
  }, [currentEmail, currentPassword]);
  
  const onGetUserClick = useCallback(() => {
    const currentUser = auth.currentUser();
    console.log({ currentUser });
  }, []);

  useEffect(() => {
    const str = location.hash;
    if(str && str.includes('confirmation_token')) {
      const from = str.indexOf('=');

      const token = location.hash.substring(from+1, str.length);

      auth
        .confirm(token, true)
        .then((response) => {
          setConfirmed(true)
          console.log('Confirmed', JSON.stringify({ response }));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [setConfirmed])
  
  const onTestClick = useCallback(() => {
    const currentUser = auth.currentUser();

    fetch('https://btgz.dev/.netlify/functions/test', currentUser && {
      headers: {
        'Authorization': `Bearer ${currentUser.token.access_token}`
      }
    }).then((res) => {
      return res.json();
    }).then(console.log).catch(console.log);
  }, []);
  
  const onVerifyClick = useCallback(() => {
    fetch('https://btgz.dev/.netlify/functions/test/verify').then((res) => {
      return res.json();
    }).then(console.log).catch(console.log);
  }, []);
  
  const onLogoutClick = useCallback(() => {
    const user = auth.currentUser();
    user
      .logout().then(response => console.log("User logged out")).catch(error => {
      console.log("Failed to logout user: %o", error);
      throw error;
    });
  }, []);
  
  return (
    <div className="container">
      <Head>
        <title>Next.js Starter!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {confirmed && <h2>Successfully confirmed!</h2>}
        {!confirmed && (
          <>
          <h3>Signup form</h3>
          <form onSubmit={onSignupSubmit}>
            <div>
              <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div>
              <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <button type="submit">Submit signup</button>
          </form>
          <div>
          <h3>Sign in form</h3>
          <form onSubmit={onSigninSubmit}>
          <div>
          <input type="email" name="email" value={currentEmail} onChange={(e) => setCurrentEmail(e.target.value)} />
          </div>
          <div>
          <input type="password" name="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}/>
          </div>
          <button type="submit">Submit signup</button>
          </form>
          </div>
          <div>
          <button onClick={onGetUserClick}>Get current user</button>
          </div>
          <div>
          <button onClick={onTestClick}>Call test function</button>
          </div>
          <div>
          <button onClick={onVerifyClick}>Call test/verify function</button>
          </div>
          <div>
          <button onClick={onLogoutClick}>Logout</button>
          </div>
          </>
        )}
      </div>
    </div>
  )
}
