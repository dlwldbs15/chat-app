import React from 'react';

function Button({type, id, text, onClick, width, height}){
    return <button className={type} id={id} onClick={onClick} width={width} height={height}>{text}</button>;
}

export default Button;