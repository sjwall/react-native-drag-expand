import Collapsed, {type CollapsedProps} from './components/Collapsed'
import Expanded, {type ExpandedProps} from './components/Expanded'
import Knob, {type KnobProps} from './components/Knob'
import Container, {
  type ContainerProps,
  type ContainerRef,
} from './components/Container'
import type {ForwardRefExoticComponent} from 'react'

export type {CollapsedProps, ExpandedProps, KnobProps}

export type DragExpandViewProps = ContainerProps
export type DragExpandViewRef = ContainerRef

export const DragExpandView = Object.assign(
  Container as ForwardRefExoticComponent<
    DragExpandViewProps & React.RefAttributes<DragExpandViewRef>
  >,
  {
    Collapsed,
    Expanded,
    Knob,
  },
)
