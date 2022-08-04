import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { login } from "../redux/action";

import Button from '../components/button'
import AlertDialog from '../components/alertDialog'
import '../css/styles.css';
import '../css/login-styles.css';

import { createUser, fetchUsers } from '../client'

function CustomSpan({text}) {
    return <span className="focus-input-nickname" data-placeholder={text}/>
}

function Login(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    console.log('rendered : LoginPage')
    const [nickname, setTextValue] = useState('');
    const [focused, setFocusValue] = useState(false);
    const [placeholder, setHolderValue] = useState('Nickname');
    const [alertOpen, setAlertOpen] = useState(false);
    
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
    
    const loginPostwork = (userId) => {
        var user = {id : userId, nickname : nickname};
        dispatch(login(user));
        console.log('login success ', nickname);
        navigate(`/main`, {replace : false, state : { user : nickname}});
        props.HandleLocation(`/main`);
    }

    const clickLoginButton = () => {
        if (nickname === '')
        {
            setAlertOpen(true);
        }
        else {
             fetchUsers().then((users) => {
                var userId = null;
                if (users) {
                    users.some(function(element){
                        if(element.nickname === nickname)
                        {
                            userId = element._id;
                            return true;
                        }
                        else
                          return false;
                      })
                } 
                if (userId === null)
                    createUser(nickname).then((res) => {loginPostwork(res._id)});
                else
                    loginPostwork(userId);
            });
        }
    }

    return(
        <div className='div-login-container'>
            <div className='div-wrap-login'>
                <div className='div-form-login'>
                    <AlertDialog title={'ID Error'} Discription={'입력된 ID가 없습니다.'} isOpen={alertOpen} visibleOKButton={true}/>
                    <span className="login-form-title p-b-26">Welcome</span>
                    <div className='div-wrap-login-validate-input'>
                        <input className="input-normal" type="text" name='nickname' 
                     onChange={(e)=>handleSetValue(e)} onFocus={(e)=>handleFocusValue(true)} onBlur={(e)=>handleFocusValue(false)}/>
                        <CustomSpan text={placeholder}/>
                    </div>
                    <div className='div-login-container-form-btn'>
                     <Button type="button btn-2" id="btn-login" text="Login" onClick={clickLoginButton} width={150} height={50} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;