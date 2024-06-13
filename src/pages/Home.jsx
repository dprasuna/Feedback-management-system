import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Home.module.scss";

const Home = () => {
    const navigate = useNavigate();
    return (
        <section className={styles.container}>
            <h1 className={styles.heading}>Feedback Management System</h1>
            <button
                className="btn btn-get-started"
                onClick={() => navigate("/registerAdmin")}
            >
                Get Started
            </button>
        </section>
    );
};

export default Home;
