import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styles from '../styles/ClientForm.module.scss'

import { SpinnerDotted } from 'spinners-react/lib/esm/SpinnerDotted'

const { nanoid } = require('nanoid')

const ClientForm = () => {

    const { id } = useParams()
    const [formData, setFormData] = useState()
    const [loading, setLoading] = useState(true)
    const [submitted, setSubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)

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

    function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true)

        const responses = []

        function pushResponses(typeValue, textValue, qid) {
            responses.push({
                qID: qid,
                resId: nanoid(14),
                resText: textValue,
                resType: typeValue
            })
        }
        
        document.querySelectorAll(`#${e.target.id} .questions .question .inputs`).forEach((field) => {
            const questionID = field.dataset.qid;
            const checkboxTexts = []

            document.querySelectorAll(`.input-${questionID} input`).forEach((input, index) => {
                if (input.type === 'text') {
                    pushResponses(input.type, [input.value], questionID)
                } else if (input.type === 'checkbox') {
                    if (input.checked === true) {
                        checkboxTexts.push(input.value)
                    }
                    if (index === (document.querySelectorAll(`.input-${questionID} input`).length - 1)) {
                        pushResponses(input.type, checkboxTexts, questionID)
                    }

                } else if (input.type === 'radio') {
                    if (input.checked === true) {
                        pushResponses(input.type, [input.value], questionID)
                    }
                }
            })
        })

        fetch(`https://feedsys-server.netlify.app/.netlify/functions/api/addResponse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                formId: id,
                responses: responses
            })
        }).then((res) => {
            return res.json()
        }).then((data) => {
            setSubmitting(false)
            setSubmitted(true)
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <>
            {
                !submitted ?
                    (loading ? <div className={styles.loadingScreen}><SpinnerDotted size={37} thickness={150} speed={100} color="rgb(238, 244, 237)" /></div> : (
                        <form className={`formdata ${styles.formContent}`} id='formData' onSubmit={(e) => handleSubmit(e)}>
                            <div className={styles.formMetaData}>
                                <h1 className={`formTitle ${styles.formTitle}`}>
                                    {formData.title}
                                </h1>
                                <h2 className={`formDesc ${styles.formDesc}`}>
                                    {formData.desc}
                                </h2>
                            </div>
                            <div className={`questions ${styles.questions}`}>{
                                formData.questions.length >= 1 ? (
                                    formData.questions.map((question, index) => {
                                        return (
                                            <div key={index} className={`question ${styles.question}`}>
                                                <div className={`quesNumber ${styles.quesNumber}`}>Q:- {index + 1}</div>
                                                <div className={`questionText ${styles.questionText}`}>
                                                    {question.QuestionText}
                                                </div>
                                                <div className={styles.inputContainer}>
                                                    <div className={`${styles.inputs} ${`inputs input-${question._id}`}`} data-qid={question._id}>
                                                        {question.Option.length > 0 ? (
                                                            question.Option.map((option, index) => {
                                                                return (question.type === 'multipleChoice') ? <label key={index}><input type='checkbox' value={option.OptionText} name={question._id} />{option.OptionText}<br /></label> : <label key={index}><input type='radio' value={option.OptionText} name={question._id} />{option.OptionText}<br /></label>
                                                            })
                                                        ) : (
                                                            question.type === 'text' && <input type='text' name={question._id} placeholder='Type your answer' />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <p>{'No questions'}</p>
                                )
                            }</div>

                            <button className={styles.deleteOrSubmitBtn} disabled={submitting ? true : false}>
                                Submit
                                {
                                    submitting ? <SpinnerDotted size={18} thickness={150} speed={100} color="rgb(0, 0, 0)" /> : ''
                                }
                            </button>
                        </form>
                    )) : (
                        <p className={styles.formDeletedOrSubmittedMsg}>Your form has been successfully submitted! Thank You!</p>
                    )
            }
        </>
    )
}

export default ClientForm