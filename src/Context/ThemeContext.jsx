import { useState } from "react";
import { createContext, useContext } from "react";
import { themeOptions } from "../Styles/Theme";

const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const defaultTheme = JSON.parse(localStorage.getItem('theme'))  || themeOptions[0].value;

  const [theme, setTheme] = useState(defaultTheme);
  const values = {
    theme,
    setTheme,
    defaultTheme
  };

  return (
    <ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>
  );
};
export const useTheme = () => useContext(ThemeContext);
