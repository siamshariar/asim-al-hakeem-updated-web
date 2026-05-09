import { useState, useEffect, useRef } from 'react'

const useOnScreen = (ref, options = {}) => {
    const [isIntersecting, setIntersecting] = useState(false)
    const observerRef = useRef(null)

    useEffect(() => {
        // Cleanup previous observer
        if (observerRef.current) {
            observerRef.current.disconnect()
        }

        if (!ref?.current || typeof IntersectionObserver === "undefined") {
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIntersecting(entry.isIntersecting)
            },
            {
                root: options.root || null,
                rootMargin: options.rootMargin || '0px',
                threshold: options.threshold || 0,
            }
        )

        observer.observe(ref.current)
        observerRef.current = observer

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
                observerRef.current = null
            }
        }
    }, [ref.current, options.rootMargin, options.threshold])

    return isIntersecting
}

export default useOnScreen