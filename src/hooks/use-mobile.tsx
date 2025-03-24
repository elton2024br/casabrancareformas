
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const handleChange = () => {
      setIsMobile(mql.matches)
      if (!isInitialized) setIsInitialized(true)
    }
    
    // Modern approach with addEventListener
    mql.addEventListener("change", handleChange)
    
    // Initial check
    handleChange()
    
    return () => mql.removeEventListener("change", handleChange)
  }, [isInitialized])

  // Prevent hydration mismatch by returning false on server/first render
  return isInitialized ? isMobile : false
}
