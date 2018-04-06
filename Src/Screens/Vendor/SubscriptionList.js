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
  Dimensions,
  NetInfo,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constant from 'Domingo/Src/Screens/GeneralClass/Constant';
import Carousel from 'react-native-snap-carousel';
import Events from 'react-native-simple-events';
import ws from 'Domingo/Src/Screens/GeneralClass/webservice';
import LS from 'Domingo/Src/Screens/GeneralClass/LocalizationStrings';

export const STATUSBAR_HEIGHT  = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

//Cover flow Dynamic Data
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}
const slideHeight = viewportHeight * 0.3;    //changed 0.4 to 0.3
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

export default class SubscriptionList extends Component {

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
        dataSource:ds,
        arrSubscriptionList:[],
        isShowHud:false,
    };
  }

  componentDidMount() {
    // this.setState({
    //     dataSource:this.state.dataSource.cloneWithRows(this.getStaticData()),
    // });

    Events.on('receiveResponse', 'receiveResponseSubscription', this.onReceiveResponse.bind(this))
    this.onWebServiceCallingForSubscriptionList()
  }

  // getStaticData() {
  //   var arrData = [{'index':'1', 'title':'Beauty', 'image':'Domingo/Src/images/static_img/Beauty.png'},
  //   {'index':'2', 'title':'Painter', 'image':'Domingo/Src/images/static_img/Beauty.png'},
  //   {'index':'3', 'title':'Lawn Care', 'image':'Domingo/Src/images/static_img/Beauty.png'},
  //   {'index':'4', 'title':'Childcare', 'image':'Domingo/Src/images/static_img/Beauty.png'},
  //   {'index':'5', 'title':'Construction', 'image':'Domingo/Src/images/static_img/Beauty.png'}]
  //   return arrData
  // }

  onReceiveResponse (responceData) {
    if (responceData.methodName == 'SubscriptionPlanList') {
      console.log('responceData:=',responceData)
      this.setState({isShowHud: false,isDisable:false})
      if (responceData.Status == true) {
        var arrCategory = responceData.Results.SubscriptionPlan_List;
        this.setState({
          arrSubscriptionList : arrCategory,
          dataSource:this.state.dataSource.cloneWithRows(arrCategory),
        })
      }
      else {
          alert(responceData.ErrorMessage)
      }
    }
  }

  onWebServiceCallingForSubscriptionList() {
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log(isConnected)
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));

      if(isConnected) {
          var param = {
            'Page_Number':1,
            'Page_Size':1000,
          }
          console.log("param is ",param);
          this.setState({
            isShowHud : true
          })
          ws.callWebservice('SubscriptionPlanList',param,'')
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
          }}>{LS.LString.subscriptionTitle}</Text>
          <TouchableWithoutFeedback style={{

                }} onPress={this.onClickMenu.bind(this)}>
            <Image style={{
                position:'relative',
                backgroundColor:'white',
                width:40,
                height:40,
                marginTop:Platform.OS === 'ios' ? 20 : 0,
                marginRight:10,
                opacity:0
              }}
              source={require('Domingo/Src/images/static_img/Beauty.png')}
              >
            </Image>
          </TouchableWithoutFeedback>
        </View>
      {/* Content View */}
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}>
        <View style = {{
          height:Constant.DEVICE_HEIGHT - STATUSBAR_HEIGHT - 64,
          // height:850,
          flexDirection:'column',
          // flex:2186,
        }}>

        <Carousel
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            firstItem={0}
            inactiveSlideScale={0.94}
            inactiveSlideOpacity={0.6}
            enableMomentum={false}
            containerCustomStyle={styles.slider}
            contentContainerCustomStyle={styles.sliderContainer}
            showsHorizontalScrollIndicator={false}
            snapOnAndroid={true}
            removeClippedSubviews={false}
          //  scrollEventThrottle={900}
          //  onScroll={this.drinkScrollEnd.bind(this)}
            onSnapToItem={this.onItemSelected.bind(this)}
        >
            {Object.keys(this.state.arrSubscriptionList).map((key,index) => {
                console.log("key:=",key,index)
                let obj = this.state.arrSubscriptionList[index]

                var strMembership = ''
                if (obj.ForMonths > 11) {
                  if (obj.ForMonths%12 === 0) {
                    if (obj.ForMonths/12 > 1) {
                      strMembership = 'For a ' + Math.floor(obj.ForMonths/12) + ' years Membership'
                    }
                    else {
                      strMembership = 'For a ' + Math.floor(obj.ForMonths/12) + ' year Membership'
                    }
                  }
                  else {
                    if(obj.ForMonths%12 > 1) {
                      strMembership = 'For a ' + Math.floor(obj.ForMonths/12) + ' year ' + obj.ForMonths%12 + ' months  Membership'
                    }
                    else {
                      strMembership = 'For a ' + Math.floor(obj.ForMonths/12) + ' year ' + obj.ForMonths%12 + ' month  Membership'
                    }
                  }
                }
                else {
                  strMembership = 'For a ' + obj.ForMonths + ' month Membership'
                }

                return (<TouchableHighlight underlayColor = {'transparent'} onPress={this.onClickSubscription.bind(this,index)}>
                        <View style={{
                          width:itemWidth,
                          height: '90%',
                          paddingHorizontal:itemHorizontalMargin,
                          paddingBottom:18,
                          backgroundColor:'rgba(0,49,89,1)',
                          alignItems:'center',
                          // justifyContent:'center',
                          marginTop:40,
                          borderRadius:12
                          }}>

                          <Image style={{
                            height:'20%',
                            width:'30%',
                            // backgroundColor:'yellow',
                            marginTop:40,
                          }}
                          source={require('Domingo/Src/images/package.png')}
                          resizeMethod='resize'
                          resizeMode='contain'
                          />

                          <Text style={{
                            color:'white',
                            fontSize:22,
                            marginTop:15,
                            fontWeight:'bold',
                          }}>
                            {/* PREMIUM */}
                            {obj.SubscriptionName}
                          </Text>

                          <Text style={{
                            color:'white',
                            fontSize:15,
                            marginTop:15,
                            textAlign:'center',
                          }}>
                            {/* Lorem Ipsum is simply dummy text of the printing and type setting industry. */}
                            {obj.Discription}
                          </Text>

                          <Text style={{
                            color:'white',
                            fontSize:25,
                            marginTop:20,
                          }}>
                            {/* $280.00 */}
                            {'$'+obj.Price}
                          </Text>

                          <Text style={{
                            color:'white',
                            fontSize:17,
                            marginTop:10,
                          }}>

                            {/* For a year Membership */}
                            {strMembership}

                          </Text>

                        <TouchableHighlight underlayColor = {'transparent'} onPress={this.onClickPayNow.bind(this,index)}>
                          <Text style={{
                            color:'rgba(0,49,89,1)',
                            fontSize:21,
                            marginTop:45,
                            padding:5,
                            backgroundColor:'white',
                            width:180,
                            textAlign:'center',
                            borderRadius:20,
                            overflow:'hidden',
                        }}>{LS.LString.payNowText}</Text>
                        </TouchableHighlight>
                        </View>
                  </TouchableHighlight>)
                })}

        </Carousel>
        </View>
        { isShowHud == true ? <ActivityIndicator
                    color={'rgba(0,165,235,1)'}    //rgba(254,130,1,0.5)'
                    size={'large'}
                    style={styles.loaderStyle}
                    />: null
                }
        </KeyboardAwareScrollView>
      </View>
    );
  }

  onItemSelected() {

  }
  onClickSubscription(index) {

  }
  onClickPayNow(index) {
    // this.props.navigation.push('payment',{data:this.state.arrSubscriptionList[index]})
    this.props.navigation.push('paymentConfirm',{data:this.state.arrSubscriptionList[index]})
  }

  onClickMenu() {
    console.log("onClickMenu clicked")
    // this.props.navigation.navigate('DrawerOpen');
    this.props.navigation.pop()
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
  //corocel view
  slider: {
      marginBottom: 15
  },
  sliderContainer: {
  },
  cocktailName:
    {
        // fontFamily:'OpenSans-Bold',
        fontSize:14,
        marginTop:10,
        marginBottom:16,
        color:'#111111'
        // marginLeft:20,
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
