import React, { useState, useEffect } from 'react';

interface CaptionsProps {
    show: boolean,
    fadeOut: boolean,
    textToShow: string;
}

const Captions: React.FC<CaptionsProps> = ({ show, fadeOut, textToShow }) => {


    return (

            <div className={`captions text-2xl text-center text-white pt-48 ${fadeOut ? 'fadeOut' : show ? '' : 'hidden'}`}>
                {textToShow}
            </div>

    );
}

export default Captions;
