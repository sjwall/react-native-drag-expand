# react-native-drag-expand

<h3 align="center">
  Bring your own UI drag expand view.
</h3>

<div align="center">
  <img alt="NPM downloads" src="https://img.shields.io/npm/dw/react-native-drag-expand?logo=npm&label=NPM%20downloads&cacheSeconds=3600"/>
</div>

<br />
<br />

## Installing react-native-drag-expand

To install react-native-drag-expand:

```bash
npm install react-native-drag-expand
```

Next, add the view:

```tsx
import {DragExpandView} from 'react-native-drag-expand'
import {Text, View} from 'react-native'

export default function App() {
  return (
    // Styled view container
    <View>
      <DragExpandView>
        <DragExpandView.Collapsed>
          <View>
            <Text>Your collapsed content</Text>
          </View>
        </DragExpandView.Collapsed>
        <DragExpandView.Expanded>
          <View>
            <Text>Your expanded content</Text>
          </View>
        </DragExpandView.Expanded>
        <DragExpandView.Knob>
          <View>
            <Text>Your drag hold point view</Text>
          </View>
        </DragExpandView.Knob>
      </DragExpandView>
    </View>
  )
}
```
