import {DragExpandView} from 'react-native-drag-expand'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'

export default function HomeScreen() {
  return (
    <View style={styles.wrapper}>
      <DragExpandView>
        <DragExpandView.Collapsed>
          <View style={styles.collapsedContainer}>
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
