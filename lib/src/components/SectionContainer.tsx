import type {FC, PropsWithChildren} from 'react'
import {type AccessibilityProps, type ViewProps} from 'react-native'
import Animated from 'react-native-reanimated'

export type SectionContainerProps = PropsWithChildren<
  {
    onLayout: ViewProps['onLayout']
    style: ViewProps['style']
  } & Pick<AccessibilityProps, 'aria-hidden'>
>

const SectionContainer: FC<SectionContainerProps> = ({
  'aria-hidden': ariaHidden,
  children,
  onLayout,
  style,
}) => {
  return (
    <Animated.View
      aria-hidden={ariaHidden}
      onLayout={onLayout}
      style={style}>
      {children}
    </Animated.View>
  )
}

SectionContainer.displayName = 'SectionContainer'

export default SectionContainer
