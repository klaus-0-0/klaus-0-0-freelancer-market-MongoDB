import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(()=> localStorage.getItem("theme") === "true"); // if "true" === "false" returns = false(boolian) compairing string either true or false

    useEffect(() => {
        localStorage.setItem("theme", isDarkMode);
    }, [isDarkMode])

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    const value = {
        isDarkMode,
        setIsDarkMode,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};