import React, { Component } from 'react';
import {
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 0.4 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {
  static defaultProps = {
    onSwipeRight: () => {},
    onSwipeLeft: () => {},
    renderNoMoreCards: () => {},
  };

  constructor(props) {
    super(props);
    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (e, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe(1);
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe(-1);
        } else {
          this.resetPosition();
        }
      },
    });
    this.position = position;
    this.panResponder = panResponder;
    this.state = { index: 0 };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({ index: 0 });
    }
  }

  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }
  forceSwipe(direction) {
    Animated.timing(this.position, {
      toValue: { x: SCREEN_WIDTH * direction, y: 0 },
      duration: SWIPE_OUT_DURATION,
    }).start(() => this.onSwipeComplete(direction));
  }

  onSwipeComplete(direction) {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const item = data[this.state.index];
    direction === 1 ? onSwipeRight(item) : onSwipeLeft(item);
    this.position.setValue({ x: 0, y: 0 });
    this.setState({ index: this.state.index + 1 });
  }

  resetPosition() {
    Animated.spring(this.position, { toValue: { x: 0, y: 0 } }).start();
  }

  getCardStyle() {
    const rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg'],
    });
    return {
      ...this.position.getLayout(),
      transform: [{ rotate }],
    };
  }

  renderCards() {
    if (this.state.index >= this.props.data.length) {
      return this.props.renderNoMoreCards(styles.cardStyle.marginTop);
    }

    const cards = this.props.data.map((item, cardIndex) => {
      if (cardIndex < this.state.index) {
        return null;
      }
      if (cardIndex === this.state.index) {
        return (
          <Animated.View
            key={item.id}
            style={[this.getCardStyle(), styles.cardStyle]}
            {...this.panResponder.panHandlers}
          >
            {this.props.renderCard(item)}
          </Animated.View>
        );
      }
      return (
        <Animated.View
          key={item.id}
          style={[
            styles.cardStyle,
            { top: 10 * (cardIndex - this.state.index) },
          ]}
        >
          {this.props.renderCard(item)}
        </Animated.View>
      );
    });
    return [...cards].reverse();
  }
  render() {
    return <Animated.View>{this.renderCards()}</Animated.View>;
  }
}
const styles = {
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    zIndex: 1,
    marginTop: SCREEN_HEIGHT / 4,
  },
};
export default Deck;
