import React from 'react';
import Select from 'react-select';
import { themeOptions } from '../Styles/Theme';
import { useTheme } from '../Context/ThemeContext';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
    const { theme ,setTheme, defaultTheme } = useTheme();

    const handleThemeChange = (e) => {
        setTheme(e.value);
        localStorage.setItem('theme',JSON.stringify(e.value));
    }

    return (
        <div className='footer'>
            <div className='instructions'>
                <div className='hint'>
                    Press <kbd>Tab</kbd> to open commands
                </div>
            </div>
        <div className='actual-footer'>
            <div className='footer-links'>
                <a className='link' href='https://github.com/harshsingh5023/typing-test' target='_blank' style={{textDecoration : 'none', color: theme.title }} rel="noreferrer">
                <GitHubIcon style={{
                    display: "block",
                    transform: "scale(1.5)",
                    cursor: "pointer",
                }}/>
                </a>
                <a className='link' href='https://www.linkedin.com/in/harsh-tomar-14020a204' target='_blank' style={{textDecoration : 'none', color: theme.title }} rel="noreferrer">
                <LinkedInIcon style={{
                    display: "block",
                    transform: "scale(1.5)",
                    cursor: "pointer",
                }}/>
                </a>
                
            </div>
            <div className='theme-options'>
                <Select 
                    options={themeOptions}
                    menuPlacement='top'
                    onChange={handleThemeChange}
                    defaultValue={{value:defaultTheme,label:defaultTheme.label}}
                    styles={{
                        control: (styles) => ({...styles, backgroundColor: theme.background, color: theme.title}),
                        menu: (styles) => ({...styles, backgroundColor: theme.background, color: theme.title}),
                        singleValue: (provided, state) => ({
                            ...provided,
                            color: state.data.color,
                            fontSize: state.selectProps.myFontSize
                          })
                    }}
                />
            </div>
        </div>

        </div>
    );
}

export default Footer;
