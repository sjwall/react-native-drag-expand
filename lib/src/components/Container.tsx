import React, {
  Children,
  cloneElement,
  useMemo,
  useRef,
  type FC,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
} from 'react'
import {StyleSheet} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import Knob, {type KnobProps} from './Knob'
import Collapsed from './Collapsed'
import Expanded from './Expanded'
import SectionContainer from './SectionContainer'
import KnobContainer from './KnobContainer'

export type ContainerProps = PropsWithChildren

const Container: FC<ContainerProps> = ({children}) => {
  const [
    knobChildren,
    collapsedChildren,
    expandedChildren,
    knobAccessibilityLabel,
    knobAccessibilityHint,
  ] = useMemo(() => {
    let knobChildren: ReactNode | undefined
    let knobAccessibilityLabel: string | undefined
    let knobAccessibilityHint: string | undefined
    let collapsedChildren: ReactNode | undefined
    let expandedChildren: ReactNode | undefined

    const clone = (child: ReactElement) => {
      const element = cloneElement(child)
      const displayName = (
        element.type as typeof Knob | typeof Collapsed | typeof Expanded
      ).displayName
      if (displayName === Knob.displayName) {
        const {props: knobProps} = element as ReactElement<KnobProps>
        knobChildren = knobProps.children
        knobAccessibilityLabel = knobProps.accessibilityLabel
        knobAccessibilityHint = knobProps.accessibilityHint
      } else if (displayName === Collapsed.displayName) {
        collapsedChildren = element.props.children
      } else if (displayName === Expanded.displayName) {
        expandedChildren = element.props.children
      }
      return element
    }

    Children.forEach(children, (child) => {
      if (typeof child === 'object' && child !== null) {
        clone(child as ReactElement)
      }
    })
    return [
      knobChildren,
      collapsedChildren,
      expandedChildren,
      knobAccessibilityLabel,
      knobAccessibilityHint,
    ]
  }, [children])

  const heightCollapsed = useRef<number>(50)
  const heightExpanded = useRef<number>(50)
  const heightKnob = useRef<number>(50)
  const height = useSharedValue<number>(50)
  const heightOffset = useSharedValue<number>(0)
  const pressed = useSharedValue<boolean>(false)
  const expanded = useSharedValue<boolean>(false)

  const animateHeightStyles = useAnimatedStyle(() => ({
    height:
      (expanded.value ? heightExpanded.current : heightCollapsed.current) +
      heightKnob.current +
      heightOffset.value,
  }))

  const animateCollapsedStyles = useAnimatedStyle(() => {
    if (heightOffset.value === 0) {
      return {
        opacity: expanded.value ? 0 : 1,
      }
    }
    const heightDiff = heightExpanded.current - heightCollapsed.current
    const diff = (1 / heightDiff) * Math.abs(heightOffset.value)
    return {
      opacity: expanded.value ? diff : 1 - diff,
    }
  })

  const updateHeight = () => {
    if (!pressed.value) {
      height.value =
        (expanded.value ? heightExpanded.current : heightCollapsed.current) +
        heightKnob.current
    }
  }

  return (
    <GestureHandlerRootView>
      <Animated.View style={[styles.wrapper, animateHeightStyles]}>
        {expandedChildren && (
          <SectionContainer
            style={styles.containerExpanded}
            onLayout={(e) => {
              heightExpanded.current = e.nativeEvent.layout.height
              updateHeight()
            }}>
            {expandedChildren}
          </SectionContainer>
        )}
        {collapsedChildren && (
          <SectionContainer
            style={animateCollapsedStyles}
            onLayout={(e) => {
              heightCollapsed.current = e.nativeEvent.layout.height
              updateHeight()
            }}>
            {collapsedChildren}
          </SectionContainer>
        )}
        {knobChildren && (
          <KnobContainer
            accessibilityHint={knobAccessibilityHint}
            accessibilityLabel={knobAccessibilityLabel}
            heightOffset={heightOffset}
            heightCollapsed={heightCollapsed}
            heightExpanded={heightExpanded}
            heightKnob={heightKnob}
            onLayout={(e) => {
              heightKnob.current = e.nativeEvent.layout.height
              updateHeight()
            }}
            pressed={pressed}
            expanded={expanded}>
            {knobChildren}
          </KnobContainer>
        )}
      </Animated.View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  containerExpanded: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  wrapper: {
    overflow: 'hidden',
  },
})

Container.displayName = 'DragExpandView'

export default Container
