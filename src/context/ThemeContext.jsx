/**
 * @fileoverview ThemeContext — application-wide dark/light mode state.
 *
 * Persists the user's theme preference to `localStorage` under the key
 * `tradazone_theme` and applies/removes the `dark` class on
 * `document.documentElement` so Tailwind's `dark:` variants work globally.
 *
 * ## Why this is separate from AuthContext
 * Theme preference is a UI concern that is independent of authentication and
 * wallet state. Keeping it here avoids polluting AuthContext with unrelated
 * state and lets any component toggle the theme without touching auth logic.
 *
 * @module ThemeContext
 */

import { createContext, useContext, useEffect, useState } from "react";

const THEME_KEY = "tradazone_theme";

const ThemeContext = createContext(null);

/**
 * @typedef {Object} ThemeContextValue
 * @property {boolean}    isDark     - `true` when dark mode is active.
 * @property {() => void} toggleTheme - Toggles between dark and light mode.
 */

/**
 * ThemeProvider
 *
 * Wraps the application with theme state. Must be an ancestor of any
 * component that calls {@link useTheme}.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(() => {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored) return stored === "dark";
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
        localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    }, [isDark]);

    const toggleTheme = () => setIsDark((prev) => !prev);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * useTheme
 *
 * Returns the {@link ThemeContextValue} from the nearest `ThemeProvider`.
 * Throws if called outside of a `ThemeProvider` tree.
 *
 * @returns {ThemeContextValue}
 * @throws {Error} If called outside a `ThemeProvider`.
 *
 * @example
 * const { isDark, toggleTheme } = useTheme();
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
}
