import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

import styles from '../styles/LoginAdmin.module.scss'
import { SpinnerDotted } from 'spinners-react'

const LoginAdmin = () => {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login, currentUser } = useAuth()
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

        try {
            setError("")
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            navigate("/dashboard")
        } catch(e) {
            console.log(e)
            setError("Failed to sign in")
        }

        setLoading(false)
    }

    return (
        <>
            <section className={styles.container}>
                <p className={"errmsg"} aria-live="assertive">{error}</p>
                <h1>Login</h1>
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

                    <button disabled={loading}>
                        Log In
                        {
                            loading ? <SpinnerDotted size={18} thickness={150} speed={100} color="rgb(0, 0, 0)" /> : ''
                        }
                    </button>
                </form>
                <p className={styles['already-cta']}>
                    Not registered?
                    <span className={styles.line}>
                        <Link to="/registerAdmin">Sign Up</Link>
                    </span>
                </p>
            </section>
        </>
    )
}

export default LoginAdmin