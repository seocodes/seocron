import { useEffect, useRef } from 'react'

export function useDocumentTitle(title: string) {
  const initialTitle = useRef(document.title)

  useEffect(() => {
    document.title = title
  }, [title])

  useEffect(
    () => () => {
      document.title = initialTitle.current
    },
    [],
  )
}
