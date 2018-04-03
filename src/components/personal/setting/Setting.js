import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,NativeModules
} from 'react-native';

import {
    mainBackgroundColor, titleTextColor, contentTextColor, placeholderTextColor, mainColor
} from '../../../constraint/Colors';
import {ic_right_arrows} from "../../../constraint/Image";
import {connect} from 'react-redux';
import TitleBar from '../../../widgets/TitleBar';
import {goBack, goto} from "../../../reducers/RouterReducer";
import TipDialog from "../../../widgets/dialog/TipDialog";
import {clearShoppingCart, clearShoppingCartProductTotalCount} from "../../../reducers/ShoppingCartReducer";
import {clearToken} from "../../../reducers/LoginReducer";
import {clearUser} from "../../../reducers/UserInfoReducer";
import {CommonStyles} from "../../../styles/CommonStyles";
import {getHost} from "../../../common/CommonRequest";

class Setting extends Component {

    //退出登录
    _logout() {
        let {dispatch} = this.props;
        dispatch(clearShoppingCartProductTotalCount());
        dispatch(clearToken());
        dispatch(clearUser());
        dispatch(clearShoppingCart());
        dispatch(goBack());
        if(NativeModules.GFCJPushModule) {
            NativeModules.GFCJPushModule.clearAlias()
        }
    }

    render() {
        return (
            <View style={{backgroundColor: mainBackgroundColor, flex: 1}}>
                <TitleBar title={'设 置'}/>
                <ScrollView style={{flex: 1}}>
                    <View style={styles.container}>
                        <View style={{marginHorizontal: 15}}>
                            {this.setItem('昵称', false, this.props.userInfo.name,()=>{this.props.dispatch(goto('ModifyNickname'))})}
                            <View style={styles.line}/>
                            {this.setItem('更改手机号码', false, this.props.userInfo.phone,()=>{this.props.dispatch(goto('ModifyPhone'))})}
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View style={{marginHorizontal: 15}}>
                            {this.setItem('修改登录密码', false, '',()=>{this.props.dispatch(goto('ModifyPassword'))})}
                            <View style={styles.line}/>
                            {this.setItem('支付密码', false, '',()=>{this.props.dispatch(goto('ResetPaymentPsw'))})}
                            <View style={styles.line}/>
                            {this.setItem('法律声明及隐私权政策', false, '', () => {
                                this.props.dispatch(goto('Agreement', {title: '法律声明及隐私权政策', url: getHost() + 'main/legislation_protocol.html'}))
                            })}
                            <View style={styles.line}/>
                            {this.setItem('关于我们', false, '',()=>{this.props.dispatch(goto('AboutUs'))})}
                        </View>
                        {this.setItem('安全退出', true, '',()=>{this.refs.LogoutDialog.showDialog()})}
                    </View>
                    <View>
                        <TipDialog
                            ref='LogoutDialog'
                            // show={this.state.showLogoutDialog}
                            dialogMessage={'确定要退出登录吗?'}
                            onClickConfirm={this._logout.bind(this)}/>
                    </View>
                </ScrollView>
            </View>
        )
    }

    setItem(setName, isUserInfo, userInfo,func) {
        let view = isUserInfo ? (<Text style={styles.value} numberOfLines={1}>{userInfo}</Text>) :
            (<Image source={ic_right_arrows} style={CommonStyles.rightArrowsStyle}/>);
        return setName === '安全退出' ? (<TouchableOpacity
            activeOpacity={0.7}
            style={{
                borderBottomLeftRadius: 3,
                borderBottomRightRadius: 3,
                height: 60,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: mainColor
            }}
            onPress={() => {if(func)func()}}>
            <Text style={{color: 'white', fontSize: 16,}}>{setName}</Text>
        </TouchableOpacity>) : (setName === '昵称' || setName === '更改手机号码') ? (<TouchableOpacity
            activeOpacity={isUserInfo ? 1 : 0.7}
            style={{flexDirection: 'row', height: 60, alignItems: 'center'}}
            onPress={() => {if(func)func()}}>
            <Text style={{color: titleTextColor, fontSize: 15}}>{setName}</Text>
            <View style={{flex: 1}}/>
            <Text style={styles.value} numberOfLines={1}>{userInfo}</Text>
            {/*<View style={{flex: 1}}/>*/}
            {view}
        </TouchableOpacity>) : (<TouchableOpacity
            activeOpacity={isUserInfo ? 1 : 0.7}
            style={{flexDirection: 'row', height: 60, alignItems: 'center'}}
            onPress={() => {if(func)func()}}>
            <Text style={{color: titleTextColor, fontSize: 15}}>{setName}</Text>
            <View style={{flex: 1}}/>
            {view}
        </TouchableOpacity>)


            ;
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginHorizontal: 10,
        backgroundColor: 'white',
        shadowOpacity: 0.2,
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        elevation: 2,
        borderRadius: 3
    },
    value: {
        color: contentTextColor,
        fontSize: 16,
        marginRight: 10,
        textAlign: 'left',
    },
    line: {
        backgroundColor: placeholderTextColor,
        height: 0.5
    }
});

selector = (state) => {
    return {
        userInfo: state.userInfoStore.userInfo
    }
};

export default connect(selector)(Setting)

