import React, { useState } from 'react';
import styles from './styles/LoginSignUp.module.css'; // Import the CSS module
import Alert from './components/Alert.tsx';
import { FormData } from './types.ts';

interface LoginSignUpProps {
  onLogin: () => void;
}

const Login_SignUp: React.FC<LoginSignUpProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.email) {
      setValidationError("Email cannot be empty.");
      setShowAlert(true);
      return;
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(formData.email)) {
      setValidationError("Please enter a valid email address.");
      setShowAlert(true);
      return;
    }

    if (!isLogin) {
      if (!formData.username) {
        setValidationError("Username cannot be empty.");
        setShowAlert(true);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setValidationError("Passwords don't match!");
        setShowAlert(true);
        return;
      }
    }
    
    setShowAlert(true);
    setTimeout(() => {
      onLogin();
    }, 2000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className={styles.loginSignUpPage}>
     
      {showAlert && (
        <Alert 
          type={validationError ? "error" : "success"}
          message={validationError ? validationError : (isLogin ? "Login successful! Redirecting..." : "Account created successfully! Redirecting...")}
        />
      )}

      <div className={`${styles.container} ${!isLogin ? styles.rightPanelActive : ''}`}>
        <div className={`${styles.formContainer} ${styles.signupContainer}`}>
          <form onSubmit={handleSubmit}>
            <h1 className='heading'>Create Account</h1>
            <div className={styles.socialContainer}>
              {/* Make sure to include Font Awesome CDN in your public/index.html */}
              <a href="#" className={styles.social}><i className="fab fa-facebook-f"></i></a>
              <a href="#" className={styles.social}><i className="fab fa-google-plus-g"></i></a>
              <a href="#" className={styles.social}><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use your email for registration</span>
            <input 
              type="text" 
              placeholder="Name" 
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
            <input 
              type="email" 
              placeholder="Email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <div className={styles.inputGroup}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <span className={styles.togglePassword} onClick={togglePasswordVisibility}>
                <i className={showPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
              </span>
            </div>
            <div className={styles.inputGroup}>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Confirm Password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <span className={styles.togglePassword} onClick={toggleConfirmPasswordVisibility}>
                <i className={showConfirmPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
              </span>
            </div>
            <button type="submit">Sign Up</button>
          </form>
        </div>

        <div className={`${styles.formContainer} ${styles.loginContainer}`}>
          <form onSubmit={handleSubmit}>
            <h1 className='heading'>Login</h1>
            <div className={styles.socialContainer}>
              <a href="#" className={styles.social}><i className="fab fa-facebook-f"></i></a>
              <a href="#" className={styles.social}><i className="fab fa-google-plus-g"></i></a>
              <a href="#" className={styles.social}><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use your account</span>
            <input 
              type="email" 
              placeholder="Email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <div className={styles.inputGroup}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <span className={styles.togglePassword} onClick={togglePasswordVisibility}>
                <i className={showPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
              </span>
            </div>
            <a href="#">Forgot your password?</a>
            <button type="submit">Login</button>
          </form>
        </div>

        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <ul className={styles.shapes}>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h1 className={styles.welcome}>Welcome to E-Literacy!</h1>
              <p>Create your account to begin managing the E-Literacy platform with ease</p>
              <p className="or">or</p>
              <button className={styles.ghost} onClick={() => setIsLogin(true)}>Login</button>
            </div>
            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h1 className={styles.welcome}>Welcome Back!</h1>
              <p>Log in to access your admin dashboard and manage the E-Literacy platform efficiently.</p>
              <button className={styles.ghost} onClick={() => setIsLogin(false)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login_SignUp;

