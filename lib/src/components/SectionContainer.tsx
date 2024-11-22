import type {FC, PropsWithChildren} from 'react'
import {type ViewProps} from 'react-native'
import Animated from 'react-native-reanimated'

export type SectionContainerProps = PropsWithChildren<{
  onLayout: ViewProps['onLayout']
  style: ViewProps['style']
}>

const SectionContainer: FC<SectionContainerProps> = ({
  children,
  onLayout,
  style,
}) => {
  return (
    <Animated.View
      onLayout={onLayout}
      style={style}>
      {children}
    </Animated.View>
  )
}

SectionContainer.displayName = 'SectionContainer'

export default SectionContainer
