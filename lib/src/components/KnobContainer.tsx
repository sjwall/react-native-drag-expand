import 'react-native-gesture-handler'
import React, {type FC, type PropsWithChildren} from 'react'
import {type ViewProps} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withClamp,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'

export type KnobContainerProps = PropsWithChildren<{
  accessibilityHint?: ViewProps['accessibilityHint']
  accessibilityLabel?: ViewProps['accessibilityLabel']
  expanded: SharedValue<boolean>
  heightCollapsed: SharedValue<number>
  heightExpanded: SharedValue<number>
  heightKnob: SharedValue<number>
  heightOffset: SharedValue<number>
  onLayout?: ViewProps['onLayout']
  pressed: SharedValue<boolean>
}>

const KnobContainer: FC<KnobContainerProps> = ({
  accessibilityHint,
  accessibilityLabel,
  children,
  expanded,
  heightCollapsed,
  heightExpanded,
  heightOffset,
  onLayout,
  pressed,
}) => {
  const offset = useSharedValue<number>(0)
  const base = useSharedValue<number>(0)

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true
      base.value = offset.value !== 0 ? offset.value : 0
    })
    .onChange((event) => {
      const maxDragDistance = heightExpanded.value! - heightCollapsed.value!
      offset.value =
        base.value +
        (expanded.value
          ? Math.min(Math.max(event.translationY, -maxDragDistance), 0)
          : Math.min(Math.max(0, event.translationY), maxDragDistance))
      heightOffset.value = expanded.value
        ? offset.value - heightCollapsed.value!
        : offset.value
    })
    .onFinalize(() => {
      const maxDragDistance = heightExpanded.value! - heightCollapsed.value!
      const toggleLimit = maxDragDistance / 2
      expanded.value = +offset.value > toggleLimit
      offset.value = withClamp(
        {min: 0, max: maxDragDistance},
        withSpring(expanded.value ? maxDragDistance : 0),
      )
      heightOffset.value = withClamp(
        {min: -maxDragDistance, max: 0},
        withSpring(0, undefined, (finished) => {
          pressed.value = !finished
        }),
      )
    })

  const handleTapEnd = () => {
    const maxDragDistance = heightExpanded.value! - heightCollapsed.value!
    expanded.value = !expanded.value
    offset.value = withClamp(
      {min: 0, max: maxDragDistance},
      withSpring(expanded.value ? maxDragDistance : 0),
    )
  }

  const tap = Gesture.Tap().onEnd(handleTapEnd)

  const animatedStyles = useAnimatedStyle(
    () => ({
      transform: [
        {translateY: offset.value},
        // {scale: withTiming(pressed.value ? 1.2 : 1)},
      ],
    }),
    [offset],
  )

  return (
    <GestureDetector gesture={Gesture.Exclusive(tap, pan)}>
      <Animated.View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel ?? 'Knob'}
        accessibilityHint={accessibilityHint}
        accessibilityActions={[{name: 'toggle', label: 'Toggle'}]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'toggle') {
            handleTapEnd()
          }
        }}
        style={animatedStyles}
        onLayout={onLayout}>
        {children}
      </Animated.View>
    </GestureDetector>
  )
}

KnobContainer.displayName = 'KnobContainer'

export default KnobContainer
