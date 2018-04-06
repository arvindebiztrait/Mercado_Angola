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
  NetInfo,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constant from 'Domingo/Src/Screens/GeneralClass/Constant';
import Events from 'react-native-simple-events';
import ws from 'Domingo/Src/Screens/GeneralClass/webservice';
import  Rating from 'react-native-easy-rating'
import LS from 'Domingo/Src/Screens/GeneralClass/LocalizationStrings';

export const STATUSBAR_HEIGHT  = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;


type Props = {};
export default class ReviewScreen extends Component<Props> {

  constructor(props) {
    super(props)
    this.state = {
        fullDetail:this.props.navigation.state.params.fullDetail,
        isShowHud:false,
        Ratings:0,
        description:'',
        userDetail:{},
    };
  }

  componentDidMount() {
    Events.remove('receiveResponse','receiveResponseReviewScreen')
    Events.on('receiveResponse', 'receiveResponseReviewScreen', this.onReceiveResponse.bind(this))

      AsyncStorage.getItem("USERDETAIL").then((value1) => {
      console.log("user signup",value1)
      userDetail = JSON.parse(value1)

      this.setState({
          userDetail:userDetail,
      })
      }).done();
  }

  onReceiveResponse (responceData) {

    if (responceData.methodName == 'AssingReview') {
        console.log('responceData:=',responceData)
        this.setState({isShowHud: false,isDisable:false})

        if (responceData.Status == true) {
          Events.trigger("reloadProfessionalData",'')
          alert(responceData.Results.Message)
          this.props.navigation.pop()
        }
        else{
           alert(responceData.ErrorMessage)
        }
    }
  }

  onWebServiceCallingForReviewScreen() {
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log(isConnected)
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));

      if(isConnected) {
            var param = {
              'UserId':this.state.userDetail.UserID,
              'ProfessionalID':this.state.fullDetail.UserID,
              'Ratings':this.state.Ratings,
              'Discription':this.state.description,
            }
            console.log("param is ",param);
            this.setState({
              isShowHud : true
            })
            ws.callWebservice('AssingReview',param,'')
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
      <View style = {{
        position:'absolute',
        top:0,
        zIndex:0,
        left:0,
        height:'100%',
        width:'100%'
      }}>
      {/* HeaderView */}
        <View style={{
          // flex:240,
          height:64,
          backgroundColor:'rgba(0,165,235,1)',
          flexDirection:'row',
          justifyContent:'center',
          alignItems:'center',
          width:'100%',
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
          }}>{LS.LString.giveReviewTitle}</Text>
          <TouchableWithoutFeedback style={{
                }} onPress={this.onClickFilter.bind(this)}>
            <Image style={{
                position:'relative',
                // backgroundColor:'white',
                width:40,
                height:40,
                marginTop:Platform.OS === 'ios' ? 20 : 0,
                marginRight:10,
                opacity:0,
              }}
              source={require('Domingo/Src/images/filter.png')}
              resizeMethod='resize'
              resizeMode='contain'
              />
          </TouchableWithoutFeedback>
        </View>

        {/* ContentView */}

        <View style = {{
          position:'relative',
          // height:'100%',
          width:'100%',
          flex:2118+242,
          // backgroundColor:'red',
        }}>
          <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}>
            <Text style={{
              marginVertical:10,
              marginHorizontal:20,
              fontSize:15,
            }}>{LS.LString.ratingsCaptionText}</Text>

            <Rating
                    style = {{
                      paddingTop:0,
                      paddingBottom:0,
                      marginHorizontal:20,
                      marginVertical:10,
                    }}
                    rating={this.state.Ratings}
                    max={5}
                    iconWidth={40}
                    iconHeight={40}
                    iconSelected={require('Domingo/Src/images/star.png')}
                    iconUnselected={require('Domingo/Src/images/blackstar.png')}
                    onRate={(rating) => this.setState({Ratings: rating})}
                    editable={true}
                    />

            <Text style={{
              marginVertical:10,
              marginHorizontal:20,
              fontSize:15,
            }}>{LS.LString.descriptionCaptionText}:</Text>

            <View style={{
              borderWidth:1,
              borderColor:'grey',
              marginHorizontal:20,
              height:120,
              borderRadius:5,
            }}>
              <TextInput style={{
                // paddingBottom:Platform.ios === 'ios' ? 0 : 5,
                height:'95%', //Platform.ios === 'ios' ? 23 : 32,
                paddingHorizontal:0,
                paddingTop:0,
                margin:5,
              }}
                placeholder= {LS.LString.descriptionPlaceholderText}
                allowFontScaling={false}
                ref='userName'
                keyboardType='default'
                returnKeyType='next'
                placeholderTextColor='rgba(79,90,105,1)'
                underlineColorAndroid='transparent'
                value={this.state.description}
                autoCapitalize='none'
                onChangeText={(text) => this.setState({description:text})}
                onSubmitEditing={(event) => console.log('onSubmitEditing')}
                multiline={true}
                // onBlur= {this.onBlurTextInput.bind(this)}
                />
            </View>

            <View style={{
              justifyContent:'center',
              alignItems:'center',
              marginTop:20,
            }}>
            <TouchableWithoutFeedback style={{
                }} onPress={this.onClickSubmit.bind(this)}>
              <Text style={{
                padding:5,
                fontSize:18,
                backgroundColor:'rgba(0,165,235,1)',
                color:'white',
                borderRadius:15,
                overflow:'hidden',
                width:150,
                textAlign:'center',
              }}>{LS.LString.SubmitCapText}</Text>
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
        </View>
      </View>
    );
  }

  onClickMenu() {
    console.log("onClickMenu clicked")
    this.props.navigation.pop()
  }
  onClickFilter() {
    console.log("onClickFilter clicked")
  }

  onClickSubmit() {
    console.log("onClickSubmit")
    if (this.state.Ratings == 0) {
      alert(LS.LString.vRatingsText)
      return
    }
    this.onWebServiceCallingForReviewScreen()
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 2560,
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor:'rgba(242,243,245,1)',
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
