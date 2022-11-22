import React from 'react';
import Select from 'react-select';
import { themeOptions } from '../Styles/Theme';
import { useTheme } from '../Context/ThemeContext';

const Footer = () => {
    const { theme ,setTheme, defaultTheme } = useTheme();

    const handleThemeChange = (e) => {
        setTheme(e.value);
        localStorage.setItem('theme',JSON.stringify(e.value));
    }

    return (
        <div className='footer'>
            <div className='footer-links'>
                Links
            </div>
            <div className='theme-options'>
                <Select 
                    options={themeOptions}
                    menuPlacement='top'
                    onChange={handleThemeChange}
                    defaultValue={{value:defaultTheme,label:defaultTheme.label}}
                    styles={{
                        control: (styles) => ({...styles, backgroundColor: theme.background}),
                        menu: (styles) => ({...styles, backgroundColor: theme.background}),
                    }}
                />
            </div>
        </div>
    );
}

export default Footer;
