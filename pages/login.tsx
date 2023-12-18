import { signIn } from 'next-auth/react';
import { FaGoogle } from 'react-icons/fa';
import styles from '../styles/Login.module.css';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const handleEmailSignIn = (email: string) => {
    setIsLoading(true);
    try{
      signIn('email', { email });
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>Sign in with</h2>
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={() => signIn('google')}>
            <span className={styles.iconWrapper}><FaGoogle /></span>
            Gmail
          </button>
          <div>
            or
          </div>
          <div className={styles.emailSignIn}>
            <input type="email" placeholder="Email Address" value={email} 
              onChange={(e) => setEmail(e.target.value )}
            className={styles.inputField} />
            {isLoading ? (
                <div className={styles.loading}>
                    <div className={styles.loadingSpinner}></div>
                </div>
            ) : (
              <button className={styles.submitButton} onClick={() => handleEmailSignIn(email)}>Sign in with Email</button>
              )}
          </div>
        </div>
        <p className={styles.terms}>
          By connecting you agree to create pizzas!
        </p>
      </div>
    </div>
  );
}
