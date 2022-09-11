import { createContext, useContext, useState } from 'react';

import type { PropsWithChildren } from 'react';

type Theme = {
  dracula: 'cupcake';
  cupcake: 'dracula';
};

type ThemeContextProps = {
  theme: keyof Theme;
  toggleTheme: () => void;
};

const ThemeToggler: Theme = {
  dracula: 'cupcake',
  cupcake: 'dracula',
};

function newTheme(prev: keyof Theme): keyof Theme {
  return ThemeToggler[prev];
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'cupcake',
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeContextProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<keyof Theme>('cupcake');

  const toggleTheme = () => {
    setTheme((current) => newTheme(current));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
