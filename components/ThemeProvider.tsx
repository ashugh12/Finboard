'use client';

import { useEffect } from "react";
import { useThemeStore } from "@/stores/themeStore";

export function ThemeProvider({children,}:{children:React.ReactNode;}){
    const theme=useThemeStore((s)=>s.theme);

    useEffect(()=>{
        document.documentElement.dataset.theme=theme;
    }, [theme]);

    return <>{children}</>
}