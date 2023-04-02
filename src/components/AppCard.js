import React from 'react';
import './AppCard.css';

//

function AppCard({id, name, username, email, address, phone, website, company, expand, onPress}) {
    let test = false;
    if (expand===id) test = true;
    return (
        <>
            <button className='button' onClick={onPress}>
                <ul className='list'>
                    <li className='nL'>Name: {name}</li>
                    <li className='uL'>Username: {username}</li>
                </ul>
            </button>
            {test ? 
                <>
                <ul className='eList'>
                    <li className='uL'>Email: {email}</li>
                    <li className='aL'>Address: {address.street}, {address.suite}, {address.city}, {address.zipcode}</li>
                    <li className='pL'>Phone: {phone}</li>
                    <li className='wL'>Website: <a href={website}>{website}</a></li>
                    <li className='cL'>Company: {company.name} - {company.catchPhrase}</li>
                </ul>
                </> : <></>}
        </>
    );
}

export default AppCard;