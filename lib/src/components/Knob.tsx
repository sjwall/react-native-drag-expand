import type {PropsWithChildren} from 'react'
import createContainer from '../utils/createContainer'
import type {ViewProps} from 'react-native'

export type KnobProps = PropsWithChildren<
  Pick<ViewProps, 'accessibilityLabel' | 'accessibilityHint'>
>

const Knob = createContainer()

Knob.displayName = 'DragExpandView.Knob'

export default Knob
