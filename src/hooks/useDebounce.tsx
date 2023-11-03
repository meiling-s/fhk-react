import  { useEffect, useState } from 'react'

const useDebounce = (value:string,delay:number) => {
  const [debouncedValue,setDebouncedValue] = useState(value)
  
  useEffect(()=>{
     const id = setTimeout(()=>{
        setDebouncedValue(value)
        console.log('hi')
     },delay)

     return()=>{
        clearTimeout(id);
        console.log('hello');
     }
  },[value,delay])
  
  return debouncedValue;
}

export default useDebounce