import {persistStore, persistCombineReducers,createMigrate} from 'redux-persist'
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import storage from 'redux-persist/es/storage' // default: localStorage if web, AsyncStorage if react-native
import reducers from '../reducers/index' // where reducers is an object of reducers

//白名单 在这里添加的reducers的state都将加入Store存储
const whiteList = [
    'loginStore',
    'shoppingCartStore',
    'userInfoStore',
    'searchStore',
    'productStore',
];

const NOW_VERSION = 5;

const migrations = {
    // 1: (state) => {
    //     console.warn(JSON.stringify(state));
    //     return {...state}
    // },
};

//缓存配置
const config = {
    key: 'root',
    storage,
    whitelist: whiteList,
    version: NOW_VERSION,
    migrate:createMigrate(migrations),
};
const logger = store => next => action => {
    if (typeof action === 'function') console.log('=====dispatching a function');
    else console.log('=====dispatching', action);
    let result = next(action);
    console.log('=====next state', store.getState());
    return result;
};
let middleware = [
    thunkMiddleware,// 允许我们 dispatch() 函数
    //logger, // loggerMiddleware // 一个很便捷的 middleware，用来打印 action 日志
];

export function configureStore() {
    let store = createStore(
        persistCombineReducers(config, reducers),
        applyMiddleware(...middleware),
    );
    let persistor = persistStore(store);
    return {persistor, store}
}
