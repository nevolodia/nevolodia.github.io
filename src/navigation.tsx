import { createContext, useContext } from "react";

type Navigation = {
    navigate: (url: URL) => void;
    prepare: (url: URL) => void;
};

export const NavigationContext = createContext<Navigation | null>(null);
export const PageActiveContext = createContext(true);
export function useNavigation() { return useContext(NavigationContext); }
export function usePageActive() { return useContext(PageActiveContext); }
