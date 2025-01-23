import 'react-native-gesture-handler'
import React, {
  forwardRef,
  useImperativeHandle,
  type PropsWithChildren,
} from 'react'
import type {AccessibilityProps, ViewProps} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'

export type KnobContainerProps = PropsWithChildren<
  {
    expanded: SharedValue<boolean>
    heightCollapsed: SharedValue<number>
    heightExpanded: SharedValue<number>
    yTranslation: SharedValue<number>
    onLayout: ViewProps['onLayout']
    onMove: (value?: number | 'end' | true | false, animate?: boolean) => void
    pressed: SharedValue<boolean>
  } & Pick<
    AccessibilityProps,
    'aria-label' | 'aria-expanded' | 'accessibilityHint'
  >
>

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
      'aria-label': ariaLabel,
      'aria-expanded': ariaExpanded,
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
      .onFinalize((_, success) => {
        if (success) {
          const maxDragDistance = heightExpanded.value! - heightCollapsed.value!
          const toggleLimit = maxDragDistance / 2
          onMove(+yTranslation.value > toggleLimit)
        }
        pressed.value = false
      })

    const handleTapEnd = () => {
      'worklet'
      onMove(!expanded.value)
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
          aria-label={ariaLabel}
          aria-expanded={ariaExpanded}
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
