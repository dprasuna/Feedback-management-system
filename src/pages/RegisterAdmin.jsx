import React, { useRef, useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

import styles from '../styles/RegisterAdmin.module.scss'
import { SpinnerDotted } from 'spinners-react'

const RegisterAdmin = () => {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup, currentUser } = useAuth()
    const navigate = useNavigate()

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(currentUser) {
            navigate('/dashboard')
        }
    })

    async function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match")
        }

        try {
            setError("")
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value)
            navigate("/loginAdmin")
        } catch(e) {
            console.log(e)
            setError("Failed to create an account")
        }

        setLoading(false)
    }

    return (
        <>
            <section className={styles.container}>
                <p className={"errmsg"} aria-live="assertive">{error}</p>
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        id="email"
                        ref={emailRef}
                        autoComplete="off"
                        required
                        aria-describedby="uidnote"
                        placeholder='Your email..'
                    />

                    <input
                        type="password"
                        id="password"
                        required
                        ref={passwordRef}
                        aria-describedby="pwdnote"
                        placeholder='Password'
                    />
                    
                    <input
                        type="password"
                        id="confirm_pwd"
                        required
                        ref={passwordConfirmRef}
                        aria-describedby="confirmnote"
                        placeholder='Confirm Password'
                    />

                    <button disabled={loading}>
                        Sign Up
                        {
                            loading ? <SpinnerDotted size={18} thickness={150} speed={100} color="rgb(0, 0, 0)" /> : ''
                        }
                    </button>
                </form>
                <p className={styles['already-cta']}>
                    Already registered?
                    <span className={styles.line}>
                        <Link to="/loginAdmin">Sign In</Link>
                    </span>
                </p>
            </section>
        </>
    )
}

export default RegisterAdmin