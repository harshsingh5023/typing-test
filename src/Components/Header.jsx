import React from 'react';
import AccountIcon from './AccountIcon';
import CompareButton from './CompareButton';

const Header = () => {
    return (
        <div className='header'>
            <div className='logo' style={{display: 'flex'}}>
                <span style={{display: 'block', marginRight: '6px', cursor: "pointer"
                ,fontSize:'24px', fontWeight:'700', border:'2px solid', padding: '.5rem'}}>
                TypinBuddy...
                </span>
                <CompareButton />
            </div>
            <div className='icons'>
                {/* login */}
                <AccountIcon />
                
            </div>
        </div>
    );
}

export default Header;
