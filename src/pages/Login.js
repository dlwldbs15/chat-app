import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/button'
import '../css/styles.css';
import '../css/login-styles.css';

import { login } from '../client'

function CustomSpan({text}) {
    return <span className="focus-input-nickname" data-placeholder={text}/>
}

function Login(props) {
    console.log('rendered : Login')
    const [nickname, setTextValue] = useState('');
    const [focused, setFocusValue] = useState(false);
    const [placeholder, setHolderValue] = useState('Nickname');
    const navigate = useNavigate();
    useEffect(()=>{
        if (focused === true || nickname !== '') {
            if (placeholder !== '')
                setHolderValue('');
        }
        else {
            if (placeholder !== 'Nickname')
                setHolderValue('Nickname');
        }
    }, [focused, nickname, placeholder]);
    const handleSetValue = (e) => {
        if (nickname !== e.target.value)
            setTextValue(e.target.value);
    }
    const handleFocusValue = (value) => {
        if (focused !== value)
            setFocusValue(value);
    }
    
    const loginButtonClick = () => {
        let success = login(nickname);
        if (success)
        {
            console.log('login success ', nickname);
            navigate(`/main`, {replace : false, state : { user : nickname}});
            props.HandleLocation(`/main`);
        }
    }

    return(
        <div className='div-login-container'>
            <div className='div-wrap-login'>
                <div className='div-form-login'>
                    <span className="login-form-title p-b-26">Welcome</span>
                    <div className='div-wrap-login-validate-input'>
                        <input className="input-normal" type="text" name='nickname' 
                     onChange={(e)=>handleSetValue(e)} onFocus={(e)=>handleFocusValue(true)} onBlur={(e)=>handleFocusValue(false)}/>
                        <CustomSpan text={placeholder}/>
                    </div>
                    <div className='div-login-container-form-btn'>
                     <Button type="button btn-2" id="btn-login" text="Login" onClick={loginButtonClick} width={150} height={50} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;