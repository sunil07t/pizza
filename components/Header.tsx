// components/Header.tsx

import { useSession, signOut, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/Header.module.css'; 
import Link from 'next/link';

const Header = () => {
  const { data: session, status: sessionStatus } = useSession(); 
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  useEffect(() => {
    setIsSessionLoading(sessionStatus === "loading");
  }, [sessionStatus]);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <Image src="/logo.png" alt="MyPizzaApp Logo" width={50} height={50} />
        </Link>
      </div>
      <nav className={styles.nav}>
        {!isSessionLoading && (
        session && session.user ? (
          <div>
              <span className={`${styles.accountInfo}`}>Account - {session.user.email}</span>
            <button onClick={() => signOut()} className={styles.signInOutButton}>Sign out</button>
          </div>
        ) : (
          <button className={styles.signInOutButton}><Link href="/login">
          Sign in
        </Link></button>
        ))}
      </nav>
    </header>
  );
};

export default Header;
