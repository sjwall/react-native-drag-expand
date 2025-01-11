# react-native-drag-expand

<h3 align="center">
  Bring your own UI, headless drag expand view.
</h3>

[![npm version](https://badge.fury.io/js/react-native-drag-expand.svg)][npm]
[![npm downloads](https://img.shields.io/npm/dw/react-native-drag-expand?logo=npm&label=NPM%20downloads&cacheSeconds=3600)][npm]
[![GitHub license](https://img.shields.io/github/license/sjwall/react-native-drag-expand)][license]
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)][pr]

<br />
<br />

![Demo](./demo.gif)

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

<!-- Definitions -->

[license]: https://github.com/sjwall/react-native-drag-expand/blob/main/LICENSE

[npm]: https://www.npmjs.com/package/react-native-drag-expand

[pr]: http://makeapullrequest.com
