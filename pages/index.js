import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import { useCallback, useRef, useState } from 'react';
import GoTrue from 'gotrue-js';

const auth = new GoTrue({
  APIUrl: 'https://btgz.dev/.netlify/functions/test',
  audience: '',
  setCookie: false,
});

export default function Home() {
  const [email,setEmail] = useState('');
  const [pass,setPass] = useState('')
  const onSubmit = useCallback((event) => {
    event.preventDefault();
    
    auth
      .signup(email, pass)
      .then((response) => console.log('Confirmation email sent', response))
      .catch((error) => console.log("It's an error", error));
  }, [email, pass]);
  return (
    <div className="container">
      <Head>
        <title>Next.js Starter!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <form onSubmit={onSubmit}>
        <div>
          <input type="email" required name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <input type="password" required name="password" value={pass} onChange={(e) => setPass(e.target.value)} />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}
