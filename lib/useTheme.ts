'use client'
import{useEffect,useState}from'react'
export function useTheme(){
  const[theme,setTheme]=useState<'light'|'dark'>('light')
  useEffect(()=>{const s=localStorage.getItem('theme')as'light'|'dark'|null;if(s)setTheme(s)},[])
  function toggle(){const n=theme==='light'?'dark':'light';setTheme(n);localStorage.setItem('theme',n);document.documentElement.setAttribute('data-theme',n)}
  return{theme,toggle}
}
