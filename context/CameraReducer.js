// reducers.js
import { combineReducers } from 'redux';
import { Dimensions} from 'react-native';

const { height, width } = Dimensions.get('window');
const initialState = {
  isRatioSet: false,
  ratio: '4:3',
  designedHeight: height,
};

// 处理 isRatioSet 的 reducer
const isRatioSetReducer = (state = initialState.isRatioSet, action) => {
  switch (action.type) {
    case 'SET_IS_RATIO_SET':
       return action.isSet;
    default:
      return state;
  }
};

// 处理 ratio 的 reducer
const ratioReducer = (state = initialState.ratio, action) => {
  switch (action.type) {
    case 'SET_RATIO':
      return action.ratio;
    default:
      return state;
  }
};

// 处理 designedHeight 的 reducer
const designedHeightReducer = (state = initialState.designedHeight, action) => {
  switch (action.type) {
    case 'SET_DESIGNED_HEIGHT':
      return action.designedHeight;
    default:
      return state;
  }
};

// 合并多个 reducer
const rootReducer = combineReducers({
  isRatioSet: isRatioSetReducer,
  ratio: ratioReducer,
  designedHeight: designedHeightReducer,
  // 可以添加其他 reducer
});

export default rootReducer;
