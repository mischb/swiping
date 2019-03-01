import React from 'react';
import { Deck } from './src';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Button } from 'react-native-elements';
import DATA from './dummyData';
export default class App extends React.Component {
  renderCard(item) {
    return (
      <Card key={item.id} image={{ uri: item.uri }}>
        <Text style={{ marginBottom: 10 }}>{item.text}</Text>
        <Button
          icon={{ name: 'code' }}
          backgroundColor="#04A9F4"
          title="View Now!"
        />
      </Card>
    );
  }

  renderNoMoreCards(marginTop) {
    console.log(marginTop);
    return (
      <View style={{ marginTop }}>
        <Card title="No More!">
          <Text style={{ marginBottom: 10 }}>No more cards!</Text>
          <Button backgroundColor="#04A9F4" title="Get More" />
        </Card>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Deck
          data={DATA}
          renderCard={this.renderCard}
          renderNoMoreCards={this.renderNoMoreCards}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
