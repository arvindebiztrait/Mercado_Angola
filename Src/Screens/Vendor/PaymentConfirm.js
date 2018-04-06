/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TextInput,
  StatusBar,
  TouchableWithoutFeedback,
  ListView,
  TouchableOpacity,
  NetInfo,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constant from 'Domingo/Src/Screens/GeneralClass/Constant';
import ActionSheet from 'react-native-actionsheet';
import Modal from 'react-native-modal';
import CheckBox from 'react-native-checkbox';
import Events from 'react-native-simple-events';
import ws from 'Domingo/Src/Screens/GeneralClass/webservice';
import LS from 'Domingo/Src/Screens/GeneralClass/LocalizationStrings';

export const STATUSBAR_HEIGHT  = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 0

const countryTitle = 'Select Country'
const deliveryTitle = 'Select Deliveryarea'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const dsYear = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});


export default class PaymentConfirm extends Component {

  constructor(props) {
    super(props)

    this.state = {
        referenceNumber:'',
        referenceId:'',
        referenceDetail:{},
        subscriptionPlanData:this.props.navigation.state.params.data,
        // paymentDetail:this.props.navigation.state.params.paymentDetail,
        userDetail:{},
        isShowHud: false,
        isDisable: false,
    };
  }

  componentDidMount() {

    Events.remove('receiveResponse', 'receiveResponsePaymentConfirm')
    Events.on('receiveResponse', 'receiveResponsePaymentConfirm', this.onReceiveResponse.bind(this))

    this.setState({isShowHud: true,isDisable:true})
    AsyncStorage.getItem("USERDETAIL").then((value1) => {
      console.log("user USERDETAIL:=",value1)
      userDetail = JSON.parse(value1)
      this.setState({
        distance : userDetail.FromDistanse,
        userDetail : userDetail
      },this.onWebServiceCallingForGenerateReference())

    }).done();
  }

  onReceiveResponse (responceData) {

    if (responceData.methodName == 'GenerateReference') {
      console.log('responceData:=',responceData)
      this.setState({isShowHud: false,isDisable:false})

      if (responceData.Status == true) {
        var data = responceData.Results;

        this.setState({
          referenceNumber : data.reference.number,
          referenceId : data.reference.id,
          referenceDetail : data
        })
      }
      else {
          alert(responceData.ErrorMessage)
      }
    }
    else if (responceData.methodName == 'ConfirmPayment') {
      console.log('responseData:=',responceData)
      this.setState({isShowHud: false,isDisable:false})
      if (responceData.Status == true) {
        var userData = JSON.stringify(responceData.Results.ProfessionalObj)
        AsyncStorage.setItem('USERDETAIL',userData)
        alert(responceData.Results.Message)
        this.props.navigation.popToTop()
      }
      else {
        alert(responceData.ErrorMessage)
      }
    }
  }

  onWebServiceCallingForGenerateReference() {
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log(isConnected)
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));

      if(isConnected) {
            var param = {
              'UserID': this.state.userDetail.UserID,
              // 'contactName': this.state.paymentDetail.contactName,
              // 'email': this.state.paymentDetail.email,
              // 'countryCode': this.state.paymentDetail.countryCode,
              // 'phoneNo': this.state.paymentDetail.phoneNo,
              'SubscriptionPlanId': this.state.subscriptionPlanData.SubscriptionID,
              'amount': this.state.subscriptionPlanData.Price,
            }
            console.log("param is ",param);
            this.setState({
              isShowHud : true
            })
            ws.callWebservice('GenerateReference',param,'')
            //  ws.callGlobalWebservice("bardetail",param);
      }
      else {
          alert(Constant.NETWORK_ALERT)
      }
    });
  }

  onWebserviceCallingForConfirmPayment() {
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log(isConnected)
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));

      if(isConnected) {
        var param = {
          'UserID': this.state.userDetail.UserID,
          'ReferenceNumber': this.state.referenceNumber,
          'ReferenceId': this.state.referenceId,
        }
        console.log("param is ",param);
        this.setState({
          isShowHud : true
        })
        ws.callWebservice('ConfirmPayment',param,'')
        //  ws.callGlobalWebservice("bardetail",param);
      }
      else {
        alert(Constant.NETWORK_ALERT)
      }
    });
  }

  render() {
    var isShowHud = this.state.isShowHud;
    return (
      <View style={styles.container}>

      {/* HeaderView */}
      <View style={{
          // flex:240,
          backgroundColor:'rgba(0,165,235,1)',
          flexDirection:'row',
          justifyContent:'center',
          alignItems:'center',
          width:'100%',
          height:64,
        }}>
          <TouchableWithoutFeedback style={{ backgroundColor:'red'
                }} onPress={this.onClickMenu.bind(this)}>
            <Image style={{
                position:'relative',
                // backgroundColor:'white',
                width:40,
                height:40,
                marginTop:Platform.OS === 'ios' ? 20 : 0,
                marginLeft:0,
                marginRight:10,
              }}
              source={require('Domingo/Src/images/back-white.png')}
              resizeMethod='resize'
              resizeMode='center'
            />
          </TouchableWithoutFeedback>
            <Text style={{
              fontSize:20,
              color:'white',
              width:Constant.DEVICE_WIDTH - 50 - 50,
              marginTop:Platform.OS === 'ios' ? 20 : 0,
              justifyContent:'center',
              textAlign:'center',
              alignItems:'center',
              fontFamily:'Oswald-Regular',
          }}>{LS.LString.paymentConfirmTitle}</Text>
          <TouchableWithoutFeedback style={{
                }} onPress={this.onClickMenu.bind(this)}>
            <Image style={{
                position:'relative',
                // backgroundColor:'white',
                width:40,
                height:40,
                marginTop:Platform.OS === 'ios' ? 20 : 0,
                marginRight:10,
                opacity:0
              }}
              source={require('Domingo/Src/images/edit-icon.png')}
              resizeMethod='resize'
              resizeMode='center'
            />
          </TouchableWithoutFeedback>
        </View>

        {/* Content View */}
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}>
          <View style = {{
            // height:Constant.DEVICE_HEIGHT - STATUSBAR_HEIGHT,
            // height:790,
            flexDirection:'column',
            // flex:2186,
            // backgroundColor:'red',
          }}>
            <View style={{
              marginTop:10,
              alignContent:'center',
              justifyContent:'center',
              alignItems:'center',
            }}>
              <Text style = {{
                margin:15,
                fontSize:14,
            }}>{LS.LString.paymentText1}</Text>

              <Text style = {{
                marginTop:10,
                fontSize:24
              }}>{this.state.referenceNumber == '' ? '###########' : this.state.referenceNumber}</Text>

              <Text style = {{
                margin:15,
                fontSize:14,
            }}>{LS.LString.paymentText2}</Text>

              <Text style = {{
                margin:15,
                fontSize:10,
            }}>{LS.LString.paymentText3}</Text>
            </View>
          </View>
          <View style={{
          flexDirection:'row',
          // backgroundColor:'green',
          height:60,
          marginHorizontal:10,
          marginTop:60,
          justifyContent:'space-around',
          alignItems:'center',
        }}>
        <TouchableWithoutFeedback style={{
                }} onPress={this.onClickBack.bind(this)}>
          <Text style={{
            fontSize:18,
            color:'white',
            backgroundColor:'rgba(0,165,235,1)',
            width:'42%',
            textAlign:'center',
            padding:8,
            borderRadius:20,
            overflow:'hidden',
        }}>{LS.LString.backText}</Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback style={{
                }} onPress={this.onClickConfirm.bind(this)}>
          <Text style={{
            fontSize:18,
            color:'white',
            backgroundColor:'rgba(0,165,235,1)',
            width:'42%',
            textAlign:'center',
            padding:8,
            marginLeft:10,
            borderRadius:20,
            overflow:'hidden',
        }}>{LS.LString.confirmText}</Text>
        </TouchableWithoutFeedback>
        </View>
        </KeyboardAwareScrollView>
        { isShowHud == true ? <ActivityIndicator
                    color={'rgba(0,165,235,1)'}    //rgba(254,130,1,0.5)'
                    size={'large'}
                    style={styles.loaderStyle}
                    />: null
                }
      </View>
    );
  }

  onClickMenu() {
    console.log("onClickMenu clicked")
    this.props.navigation.pop()
  }

  onClickBack() {
    this.props.navigation.pop()
  }

  onClickConfirm() {
    // this.props.navigation.popToTop()
    this.onWebserviceCallingForConfirmPayment()
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 2048,
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  demo: Platform.select({
    ios:{
      textAlign: 'left',
      marginTop: 10,
    },
    android:{
      textAlign: 'right',
      marginTop: 10,
    }
  }),
  loaderStyle:{
      height:'10%',
      width:'20%',
      position:'absolute',
      left:'40%',
      top:'45%',
      justifyContent:'center',
  },
});
