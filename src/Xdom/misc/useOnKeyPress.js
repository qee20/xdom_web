import { useCallback, useEffect } from "react"


export const useOnKeyPress = () => {
    useEffect(() => {
        const keyPressHandler = (event)=>{
            if(event.key === target){
                useCallback()
            }
        }
      window.addEventListener('keydown', keyPressHandler)
      return () =>{
        window.removeEventListener('keydown', keyPressHandler)
      }
    }, [])
    
}