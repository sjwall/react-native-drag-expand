import type {FC, PropsWithChildren} from 'react'

export type ContainerProps = PropsWithChildren

export default function createContainer(): FC<ContainerProps> {
  return ({children}) => {
    return children
  }
}
