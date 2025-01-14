import 'react-native-gesture-handler'
import React, {
  forwardRef,
  useImperativeHandle,
  type PropsWithChildren,
} from 'react'
import {type ViewProps} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'

export type KnobContainerProps = PropsWithChildren<{
  accessibilityHint?: ViewProps['accessibilityHint']
  accessibilityLabel?: ViewProps['accessibilityLabel']
  expanded: SharedValue<boolean>
  heightCollapsed: SharedValue<number>
  heightExpanded: SharedValue<number>
  yTranslation: SharedValue<number>
  onLayout: ViewProps['onLayout']
  onMove: (value?: number | 'end', animate?: boolean) => void
  pressed: SharedValue<boolean>
}>

export type KnobContainerRef = {
  open: () => void
  close: () => void
  toggle: () => void
  isExpanded: () => boolean
}

const KnobContainer = forwardRef<KnobContainerRef, KnobContainerProps>(
  (
    {
      accessibilityHint,
      accessibilityLabel,
      children,
      expanded,
      heightCollapsed,
      heightExpanded,
      yTranslation,
      onLayout,
      onMove,
      pressed,
    },
    ref,
  ) => {
    const base = useSharedValue<number>(0)

    const pan = Gesture.Pan()
      .onBegin(() => {
        pressed.value = true
        base.value = yTranslation.value !== 0 ? yTranslation.value : 0
      })
      .onChange((event) => {
        const maxDragDistance = heightExpanded.value! - heightCollapsed.value!
        onMove(
          base.value +
            (expanded.value
              ? Math.min(Math.max(event.translationY, -maxDragDistance), 0)
              : Math.min(Math.max(0, event.translationY), maxDragDistance)),
          false,
        )
      })
      .onFinalize(() => {
        const maxDragDistance = heightExpanded.value! - heightCollapsed.value!
        const toggleLimit = maxDragDistance / 2
        expanded.value = +yTranslation.value > toggleLimit
        onMove()
        pressed.value = false
      })

    const handleTapEnd = () => {
      expanded.value = !expanded.value
      onMove()
    }

    const tap = Gesture.Tap().onEnd(handleTapEnd)

    const animatedStyles = useAnimatedStyle(
      () => ({
        transform: [{translateY: yTranslation.value}],
      }),
      [yTranslation],
    )

    useImperativeHandle(ref, () => ({
      open: () => !expanded.value && handleTapEnd(),
      close: () => expanded.value && handleTapEnd(),
      toggle: handleTapEnd,
      isExpanded: () => expanded.value,
    }))

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
  },
)

KnobContainer.displayName = 'KnobContainer'

export default KnobContainer
