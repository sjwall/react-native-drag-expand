import {DragExpandView, DragExpandViewRef} from 'react-native-drag-expand'
import {View, Text, StyleSheet, TouchableOpacity, Button} from 'react-native'
import {useRef} from 'react'

export default function HomeScreen() {
  const ref = useRef<DragExpandViewRef>(null)
  return (
    <View style={styles.wrapper}>
      <DragExpandView ref={ref}>
        <DragExpandView.Collapsed>
          <View style={styles.collapsedContainer}>
            <Button
              onPress={() => ref.current?.toggle()}
              title="Press me to toggle."
            />
            <Text>A</Text>
            <Text>A</Text>
            <Text>A</Text>
          </View>
        </DragExpandView.Collapsed>
        <DragExpandView.Expanded>
          <View style={styles.expandedContainer}>
            <Text>B</Text>
            <Text>B</Text>
            <Text>B</Text>
            <Text>B</Text>
            <Text>B</Text>
            <Text>B</Text>
            <Text>B</Text>
            <Text>B</Text>
            <Text>B</Text>
            <Text>B</Text>
            <Text>B</Text>
            <Text>B</Text>
          </View>
        </DragExpandView.Expanded>
        <DragExpandView.Knob>
          <View
            style={styles.knobContainer}
            pointerEvents={'box-none'}>
            <TouchableOpacity
              style={styles.knob}
              testID={`knob`}
            />
          </View>
        </DragExpandView.Knob>
      </DragExpandView>
      <Text>Content below</Text>
      <Button
        onPress={() => ref.current?.toggle()}
        title="Press me to toggle."
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
  },
  expandedContainer: {
    backgroundColor: 'aliceblue',
  },
  collapsedContainer: {
    backgroundColor: 'orange',
  },
  knobContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    height: 24,
    justifyContent: 'center',
  },
  knob: {
    backgroundColor: 'grey',
    borderRadius: 3,
    height: 4,
    width: 40,
  },
})
