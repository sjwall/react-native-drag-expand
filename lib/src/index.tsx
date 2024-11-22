import {type FC} from 'react'
import Collapsed, {type CollapsedProps} from './components/Collapsed'
import Expanded, {type ExpandedProps} from './components/Expanded'
import Knob, {type KnobProps} from './components/Knob'
import Container, {type ContainerProps} from './components/Container'

export type {CollapsedProps, ExpandedProps, KnobProps}

export type DragExpandViewProps = ContainerProps

export const DragExpandView: FC<DragExpandViewProps> & {
  Collapsed: FC<CollapsedProps>
  Expanded: FC<ExpandedProps>
  Knob: FC<KnobProps>
} = Object.assign(Container, {
  Collapsed,
  Expanded,
  Knob,
})
