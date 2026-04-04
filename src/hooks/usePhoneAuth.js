import { useState, useCallback, useRef } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebase';

/**
 * usePhoneAuth — Firebase phone OTP authentication hook.
 *
 * In development mode (localhost), if Firebase Phone Auth fails,
 * it falls back to a demo mode that accepts any 6-digit OTP.
 * This lets you test the full flow without Firebase Phone Auth enabled.
 */

const IS_DEV = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.port === '5173';

export default function usePhoneAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [devMode, setDevMode] = useState(false);
    const confirmationRef = useRef(null);
    const recaptchaRef = useRef(null);

    const setupRecaptcha = useCallback((containerId = 'recaptcha-container') => {
        // Clean up previous instance
        if (recaptchaRef.current) {
            try { recaptchaRef.current.clear(); } catch { }
            recaptchaRef.current = null;
        }

        try {
            recaptchaRef.current = new RecaptchaVerifier(auth, containerId, {
                size: 'invisible',
                callback: () => { /* solved */ },
                'expired-callback': () => {
                    setError('reCAPTCHA expired — please try again');
                    recaptchaRef.current = null;
                },
            });
        } catch (err) {
            console.warn('[PhoneAuth] RecaptchaVerifier setup failed:', err);
            recaptchaRef.current = null;
        }
    }, []);

    const sendOtp = useCallback(async (phoneNumber) => {
        setLoading(true);
        setError(null);
        setDevMode(false);

        try {
            if (IS_DEV) {
                console.info('[PhoneAuth] Dev mode detected — enabling demo OTP fallback');
                setDevMode(true);
                setLoading(false);
                return true;
            }

            const formattedPhone = phoneNumber.startsWith('+')
                ? phoneNumber
                : `+91${phoneNumber.replace(/\D/g, '')}`;

            setupRecaptcha();

            if (!recaptchaRef.current) {
                throw new Error('reCAPTCHA setup failed');
            }

            const confirmation = await signInWithPhoneNumber(
                auth,
                formattedPhone,
                recaptchaRef.current,
            );

            confirmationRef.current = confirmation;
            setLoading(false);
            return true;
        } catch (err) {
            console.error('[PhoneAuth] Send OTP error:', err);

            // In dev mode, fall back to demo verification
            if (IS_DEV) {
                console.info('[PhoneAuth] Dev mode — using demo OTP verification (any 6-digit code works)');
                setDevMode(true);
                setLoading(false);
                setError(null);
                return true; // pretend it worked
            }

            let message = 'Failed to send OTP';
            if (err.code === 'auth/invalid-phone-number') {
                message = 'Invalid phone number format';
            } else if (err.code === 'auth/too-many-requests') {
                message = 'Too many attempts — try again later';
            } else if (err.code === 'auth/captcha-check-failed') {
                message = 'reCAPTCHA verification failed';
            } else if (err.code === 'auth/operation-not-allowed') {
                message = 'Phone auth not enabled — enable in Firebase Console';
            }

            setError(message);
            setLoading(false);
            recaptchaRef.current = null;
            return false;
        }
    }, [setupRecaptcha]);

    const verifyOtp = useCallback(async (otpCode) => {
        setLoading(true);
        setError(null);

        // Dev mode: accept any 6-digit code
        if (devMode) {
            if (otpCode.length === 6 && /^\d{6}$/.test(otpCode)) {
                console.info('[PhoneAuth] Dev mode — OTP accepted');
                const mockUser = { uid: 'dev-user-001', phoneNumber: '+91XXXXXXXXXX' };
                setUser(mockUser);
                setLoading(false);
                return mockUser;
            } else {
                setError('Enter a valid 6-digit code');
                setLoading(false);
                return null;
            }
        }

        // Production mode: verify with Firebase
        if (!confirmationRef.current) {
            setError('No OTP sent yet — please request OTP first');
            setLoading(false);
            return null;
        }

        try {
            const result = await confirmationRef.current.confirm(otpCode);
            setUser(result.user);
            setLoading(false);
            return result.user;
        } catch (err) {
            console.error('[PhoneAuth] Verify OTP error:', err);

            let message = 'Invalid OTP';
            if (err.code === 'auth/code-expired') {
                message = 'OTP expired — please request a new one';
            }

            setError(message);
            setLoading(false);
            return null;
        }
    }, [devMode]);

    const resetAuth = useCallback(() => {
        setError(null);
        setUser(null);
        setDevMode(false);
        confirmationRef.current = null;
        if (recaptchaRef.current) {
            try { recaptchaRef.current.clear(); } catch { }
            recaptchaRef.current = null;
        }
    }, []);

    return { sendOtp, verifyOtp, resetAuth, loading, error, user, devMode };
}
