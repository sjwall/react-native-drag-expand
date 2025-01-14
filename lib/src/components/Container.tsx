import React, {
  Children,
  cloneElement,
  forwardRef,
  useCallback,
  useMemo,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
} from 'react'
import {StyleSheet} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import Knob, {type KnobProps} from './Knob'
import Collapsed from './Collapsed'
import Expanded from './Expanded'
import SectionContainer from './SectionContainer'
import KnobContainer, {
  type KnobContainerProps,
  type KnobContainerRef,
} from './KnobContainer'

export type ContainerProps = PropsWithChildren

export type ContainerRef = KnobContainerRef

const Container = forwardRef<ContainerRef, ContainerProps>(
  ({children}, ref) => {
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

    const heightCollapsed = useSharedValue<number>(0)
    const heightExpanded = useSharedValue<number>(0)
    const heightKnob = useSharedValue<number>(0)
    const knobYTranslation = useSharedValue<number>(0)
    const pressed = useSharedValue<boolean>(false)
    const expanded = useSharedValue<boolean>(false)
    const animationDuration = useSharedValue<number>(0)

    const enableAnimation = useCallback(() => {
      const maxDragDistance = heightExpanded.value - heightCollapsed.value
      const maxDuration = 240
      animationDuration.value =
        expanded.value && knobYTranslation.value === 0
          ? maxDuration
          : (1 / maxDragDistance) * knobYTranslation.value * maxDuration
    }, [])

    const moveToEndPosition = useCallback(() => {
      const maxDragDistance = heightExpanded.value! - heightCollapsed.value!
      const newValue = expanded.value ? maxDragDistance : 0
      knobYTranslation.value = withTiming(newValue, {
        duration: animationDuration.value,
      })
    }, [])

    const onKnobMove = useCallback<KnobContainerProps['onMove']>(
      (value = 'end', animate = true) => {
        if (animate) {
          enableAnimation()
        }
        if (value === 'end') {
          moveToEndPosition()
        } else {
          knobYTranslation.value = value
        }
      },
      [enableAnimation, moveToEndPosition],
    )

    const animateHeightStyles = useAnimatedStyle(
      () => ({
        height:
          heightCollapsed.value + heightKnob.value + knobYTranslation.value ||
          undefined,
      }),
      [knobYTranslation, heightCollapsed, heightKnob],
    )

    const animateCollapsedStyles = useAnimatedStyle(() => {
      const maxDragDistance = heightExpanded.value - heightCollapsed.value
      const diff = (1 / maxDragDistance) * knobYTranslation.value
      return {
        opacity: 1 - diff,
      }
    }, [knobYTranslation, heightExpanded, heightCollapsed])

    return (
      <GestureHandlerRootView>
        <Animated.View style={[styles.wrapper, animateHeightStyles]}>
          {expandedChildren && (
            <SectionContainer
              style={styles.containerExpanded}
              onLayout={(e) => {
                heightExpanded.value = e.nativeEvent.layout.height
              }}>
              {expandedChildren}
            </SectionContainer>
          )}
          {collapsedChildren && (
            <SectionContainer
              style={animateCollapsedStyles}
              onLayout={(e) => {
                heightCollapsed.value = e.nativeEvent.layout.height
              }}>
              {collapsedChildren}
            </SectionContainer>
          )}
          {knobChildren && (
            <KnobContainer
              ref={ref}
              accessibilityHint={knobAccessibilityHint}
              accessibilityLabel={knobAccessibilityLabel}
              heightCollapsed={heightCollapsed}
              heightExpanded={heightExpanded}
              yTranslation={knobYTranslation}
              onLayout={(e) => {
                heightKnob.value = e.nativeEvent.layout.height
              }}
              onMove={onKnobMove}
              pressed={pressed}
              expanded={expanded}>
              {knobChildren}
            </KnobContainer>
          )}
        </Animated.View>
      </GestureHandlerRootView>
    )
  },
)

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
