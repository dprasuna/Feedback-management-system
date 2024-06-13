import React from 'react'
import styles from '../styles/NotFound.module.scss'

const NotFound = () => {
  return (
    <section className={styles.contain}>
        <h1>404</h1>
        <h2>Page not found</h2>
        <h6>We couldn't find what you were looking for!</h6>
    </section>
  )
}

export default NotFound