import React from 'react'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useParams, Link, useNavigate } from 'react-router-dom'

import styles from '../styles/Form.module.scss'
import { SpinnerDotted } from 'spinners-react'
import { MdKeyboardArrowLeft } from 'react-icons/md'

const Form = () => {

    const { id } = useParams()
    const [formData, setFormData] = useState()
    const [loading, setLoading] = useState(true)
    const [deleted, setDeleted] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const navigate = useNavigate()
    const { logout } = useAuth()


    async function handleLogout() {

        try {
            await logout()
            navigate("/loginAdmin")
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        fetch('https://feedsys-server.netlify.app/.netlify/functions/api/getForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                formId: id
            })
        }).then((res) => {
            return res.json()
        }).then((data) => {
            setFormData(data.data)
        })
    }, [id])

    useEffect(() => {
        formData !== undefined ? setLoading(false) : setLoading(true)
    }, [formData])

    function deleteForm() {
        setDeleting(true)
        fetch(`https://feedsys-server.netlify.app/.netlify/functions/api/removeForm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                formId: id
            })
        }).then((res) => {
            return res.json()
        }).then((data) => {
            if (data.err) {
                console.log('deleting failed')
            } else {
                setDeleting(false)
                setDeleted(true)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    function copyLink() {
        let url = window.location.href;
        const base_url_array = url.split('/').filter((string, index) => {
            return (index < (url.split('/').length - 3)) ? true : false
        })
        const baseUrl = base_url_array.join("/")
        const shareLink = `${baseUrl}/form/${id}`

        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareLink).then(() => {
            })
        } else {
            console.log('clipboard api is not available');
        }
    }

    return (
        <>
            {
                !deleted ? (
                    loading ? <div className={styles.loadingScreen}><SpinnerDotted size={37} thickness={150} speed={100} color="rgb(238, 244, 237)" /></div> : (
                        <>
                            <section className={styles.header}>
                                <div className={styles.headerTitle}>
                                    <h2>{`Form`}</h2>
                                    <div className={styles.goToDashboard}>
                                        <Link to='/dashboard'><MdKeyboardArrowLeft />Dashboard</Link>
                                    </div>
                                </div>
                                <div className={`${styles.headerCta}`}>
                                    <Link className={`${styles.headerCtaLinkDesktop}`} to={`/dashboard/form/responses/${id}`}>See responses</Link>
                                    <button onClick={handleLogout}>Logout</button>
                                </div>
                            </section>
                            <section className={styles.formContent}>
                                <div className={styles.formMetaData}>
                                    <h1 className={styles.formTitle}>
                                        {formData.title}
                                    </h1>
                                    <h2 className={styles.formDesc}>
                                        {formData.desc}
                                    </h2>
                                </div>
                                <div className={styles.questions}>{
                                    formData.questions.length >= 1 ? (
                                        formData.questions.map((question, index) => {
                                            return (
                                                <div key={index} className={styles.question}>
                                                    <div className={styles.quesNumber}>Q:- {index + 1}</div>
                                                    <div className={styles.questionText}>
                                                        {question.QuestionText}
                                                    </div>
                                                    <div className={styles.inputContainer}>
                                                        <div className={styles.inputs}>
                                                            {question.Option.length > 0 ? (
                                                                question.Option.map((option, index) => {
                                                                    return (question.type === 'multipleChoice') ? <label key={index}><input type='checkbox' value={option.OptionText} name={question._id} />{option.OptionText}<br /></label> : <label key={index}><input type='radio' value={option.OptionText} name={question._id} />{option.OptionText}<br /></label>
                                                                })
                                                            ) : (
                                                                question.type === 'text' && <input type='text' placeholder='Type your answer' />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <p>{`No questions!    `}<Link to={`/dashboard/form/addQues/${id}`}>Add questions</Link></p>
                                    )
                                }</div>
                                <div className={styles.deleteOrSubmitBtn}>
                                    <button onClick={() => deleteForm()} disabled={deleting ? true : false}>
                                        Delete form
                                        {
                                            deleting ? <SpinnerDotted size={18} thickness={150} speed={100} color="rgb(0, 0, 0)" /> : ''
                                        }
                                    </button>
                                    <button disabled={formData.questions.length >= 1 ? false : true} onClick={copyLink}>Copy Link</button>
                                </div>
                                <div className={`${styles.headerCtaLinkMobile}`}>
                                    <Link to={`/dashboard/form/responses/${id}`}>See responses</Link>
                                </div>
                            </section>
                        </>
                    )
                ) : (
                    <div className={styles.formDeletedOrSubmittedMsg}>
                        <p>Form Successfully Deleted</p>
                        <Link to='/dashboard'>Go to Dashboard</Link>
                    </div>
                )
            }
        </>
    )
}

export default Form