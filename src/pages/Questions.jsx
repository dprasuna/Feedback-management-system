import { useState } from "react";
import React from "react";
import { useNavigate, Link, useParams } from 'react-router-dom'
import { useAuth } from "../contexts/AuthContext";

import styles from '../styles/Questions.module.scss'

import { SpinnerDotted } from 'spinners-react'
import { MdKeyboardArrowLeft } from 'react-icons/md'

function Questions() {

    const [err, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false)
    const { id } = useParams()

    // const [formId, setFormId] = useState("");

    const navigate = useNavigate()
    const { logout } = useAuth()

    async function handleLogout() {
        setErrMsg("")

        try {
            await logout()
            navigate("/loginAdmin")
        } catch (e) {
            console.error(e)
            setErrMsg("Failed to log out")
        }
    }

    // useEffect(() => {
    //     let url_string = window.location.href;
    //     let url = new URL(url_string);
    //     let formId = url.searchParams.get("id");
    //     setFormId(formId)
    // }, [])

    const [question, setQuestion] = useState([{
        QuestionText: "Question",
        type: "",
        option: [{ OptionText: "Option 1" }]
    }]);


    const QuesType = (text, index) => {
        var changeQuesType = [...question];
        changeQuesType[index].type = text;
        setQuestion(changeQuesType);
    }

    const addOption = (index) => {
        var choices = [...question];

        choices[index].option.push({ OptionText: "Option " + (choices[index].option.length + 1) });

        setQuestion(choices);
    }

    const addQues = (index) => {

        if (question[index].QuestionText === "Question" || question[index].QuestionText === "") {
            setErr(true);
            setErrMsg("Please Fill All Required Fields");
        } else {
            setLoading(true)
            fetch(`https://feedsys-server.netlify.app/.netlify/functions/api/addQues`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    formId: id,
                    question: question[0]
                })
            }).then((res) => {
                return res.json()
            }).then((data) => {
                setErr(false);
                setLoading(false)
                setSuccess("Successfully Added");
            })
        }
    }

    const quesText = (text, index) => {
        var changeQuesText = [...question];
        changeQuesText[index].QuestionText = text;
        setQuestion(changeQuesText);
    }

    const optionText = (text, index, indexs) => {
        var optionsOfQuestion = [...question];
        optionsOfQuestion[index].option[indexs].OptionText = text;
        setQuestion(optionsOfQuestion);
    }

    const setUserResponse = (text, index) => {

        console.log("Hello");

    }

    return (
        <>
            <section className={styles.header}>
                <div className={styles.headerTitle}>
                    <h2>{`Questions`}</h2>
                    <div className={styles.goToDashboard}>
                        <Link to='/dashboard'><MdKeyboardArrowLeft />Dashboard</Link>
                    </div>
                </div>
                <div className={styles.headerCta}>
                    <Link className={`${styles.headerCtaLinkDesktop}`} to={`/dashboard/form/${id}`}>Go to form</Link>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </section>
            <section className={styles.questionArea}>
                <h2>Add Question</h2>
                {question.map((element, index) => {
                    return (
                        <div key={index} className={styles.addquesContain}>
                            <div className={`container ${styles.quesTextInputContain}`}>
                                <div className={`question`}>
                                    <textarea className={styles.inputQues} value={element.QuestionText} rows="3" cols="35" onChange={(e) => { quesText(e.target.value, index) }} />
                                </div>
                            </div>

                            <div className={`selectType ${styles.quesTypeContain}`}>
                                <label htmlFor='type'>Select Type of Question :</label>
                                <select name='question' onChange={(e) => { QuesType(e.target.value, index) }}>
                                    <option></option>
                                    <option value="singleChoice">Single Choice</option>
                                    <option value="multipleChoice">Multiple Choice</option>
                                    <option value="text">Single Line</option>
                                </select>
                            </div>
                            {element.type === "singleChoice" ? <div className={styles.optionContain}>
                                {element.hasOwnProperty('option') ?
                                    console.log("Already Excisting")
                                    : element.option = [{ OptionText: "Option 1" }]
                                }
                                {element.option.map((options, indexs) => {
                                    return (
                                        <>
                                            <div className={`options ${styles.options}`}>
                                                <input type="radio" value={element.option[indexs].OptionText} name={element.type} />
                                                <textarea value={element.option[indexs].OptionText} rows="1" cols="7" onChange={(e) => { optionText(e.target.value, index, indexs) }} />
                                            </div>
                                            {element.option.length - 1 === indexs ? <div className='addOption'>
                                                <button onClick={() => { addOption(index) }}>Add Option</button>
                                            </div> : null}
                                        </>
                                    )
                                })}
                            </div> : null}

                            {element.type === "multipleChoice" ? <div className={styles.optionContain}>
                                {element.hasOwnProperty('option') ?
                                    console.log("Already Excisting")
                                    : element.option = [{ OptionText: "Option 1" }]
                                }
                                {element.option.map((options, indexs) => {
                                    return (
                                        <>
                                            <div className={`options ${styles.options}`} key={indexs}>
                                                <input type="checkbox" value={element.option[indexs].OptionText} name={element.type} />
                                                <textarea value={element.option[indexs].OptionText} rows="1" cols="7" onChange={(e) => { optionText(e.target.value, index, indexs) }} />
                                            </div>
                                            {element.option.length - 1 === indexs ? <div className='addOption'>
                                                <button className={styles.addOptionBtn} onClick={() => { addOption(index) }}>Add Option</button>
                                            </div> : null}
                                        </>
                                    )
                                })}
                            </div> : null}

                            {element.type === "text" ? <div className={styles.optionContain}>

                                {delete element.option}

                                <div className={`options ${styles.options}`}>
                                    <input type="text" placeholder="Enter Your Response" onChange={(e) => { setUserResponse(e.target.value, index) }} />
                                </div>


                            </div> : null}

                            {question.length - 1 === index ? <div className={`addQuestion ${styles.quesAddBtnContain}`}>
                                <button className={styles.addQuesBtn} onClick={() => { addQues(index) }} disabled={loading ? true : false}>
                                    Add question
                                    {
                                        loading ? <SpinnerDotted size={18} thickness={150} speed={100} color="rgb(0, 0, 0)" /> : ''
                                    }
                                </button>
                            </div> : null}
                        </div>
                    )
                })}
                <div className={`${styles.headerCtaLinkMobile}`}>
                    <Link to={`/dashboard/form/${id}`}>Go to form</Link>
                </div>

            </section>
            <section className="error">
                <p className={err ? "errorMsg" : "successMsg"}>{err ? errMsg : success}
                </p>
            </section>
        </>
    )
}

export default Questions