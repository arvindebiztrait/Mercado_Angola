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
  AsyncStorage,
  Alert,
  NetInfo,
  ActivityIndicator,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constant from 'Domingo/Src/Screens/GeneralClass/Constant';
import { NavigationActions } from 'react-navigation';
import Events from 'react-native-simple-events';
import ws from 'Domingo/Src/Screens/GeneralClass/webservice'; 
import LS from 'Domingo/Src/Screens/GeneralClass/LocalizationStrings';
import ActionSheet from 'react-native-actionsheet';
import Share, {ShareSheet, Button} from 'react-native-share';

export const STATUSBAR_HEIGHT  = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 0

type Props = {};
export default class MenuScreen extends Component<Props> {

  constructor(props) {
    super(props)
    this.state = {
        userName:'Person Name',
        email:'sample@example.com',
        userType:1,
        userDetail:{},
        imgUrl:'',
        isShowHud:false,
        languageId:'pt',
        arrLanguageType:[LS.LString.cancelText,'portuguese','English'],
    };
  }

  componentDidMount() {
    this.updateMenuDetails()
    Events.on('updateMenuDetails', 'updateMenuDetailsMenuScreen', this.updateMenuDetails.bind(this)) 
    Events.on('receiveResponse', 'receiveMenuScreen', this.onReceiveResponse.bind(this)) 
    
    AsyncStorage.getItem("languageId").then((value1) => {
      console.log("languageId:=",value1) 
      if(value1 == null) {
          console.log("languageId Null")
          LS.LString.setLanguage('pt')
          AsyncStorage.setItem('languageId','pt')
          this.setState({
            languageId:'pt'
          })
      }
      else {
          LS.LString.setLanguage(value1)
          console.log("languageId Not Null")
          this.setState({
            languageId:value1
          })
      } 
    }).done();

  }

  onReceiveResponse (responceData) { 
       
    if (responceData.methodName == 'SwitchUser') {
      console.log('responceData:=',responceData)
      this.setState({isShowHud: false,isDisable:false})
      if (responceData.Status == true) {        
        
        var userData = JSON.stringify(responceData.Results.Data)
        AsyncStorage.setItem('USERDETAIL',userData)
        this.proceedToChangeUserType()
        // Events.trigger("updateMenuDetails",'')
        // alert(responceData.Results.Message)
      }
      else {
        alert(responceData.ErrorMessage)
      }
    }
    else if (responceData.methodName == 'Logout') {
      console.log('responceData:=',responceData)
      this.setState({isShowHud: false,isDisable:false})
      if (responceData.Status == true) {        
        alert(responceData.Results.Message)
        AsyncStorage.removeItem('SIGNINSTATUS',this.navigateToLogin())
      }
      else {
        alert(responceData.ErrorMessage)
      }
    }
  }

  onWebServiceCallingForSwitchUser() {
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log(isConnected)
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));        
      if(isConnected) {
        var param = {
            'UserId': this.state.userDetail.UserID,
            'UsersTypeId': this.state.userType == 1 ? 2 : 1
        }
        console.log("param is ",param);
        this.setState({
          isShowHud : true
        })
        ws.callWebservice('SwitchUser',param,'')
        //  ws.callGlobalWebservice("bardetail",param);
      }
      else {
        alert(Constant.NETWORK_ALERT)
      }
    });
  }

  onWebServiceCallingForLogout() {
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log(isConnected)
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));        
      if(isConnected) {
        var param = {
            'UserId': this.state.userDetail.UserID,
        }
        console.log("param is ",param);
        this.setState({
          isShowHud : true
        })
        ws.callWebservice('Logout',param,'')
        //  ws.callGlobalWebservice("bardetail",param);
      }
      else {
        alert(Constant.NETWORK_ALERT)
      }
    });
  }

  updateMenuDetails() {
    AsyncStorage.getItem("USERDETAIL").then((value) => {
      console.log("user signup",value) 
      userDetail = JSON.parse(value)      
         this.setState({
              userType:userDetail.UsersTypeId,
              userName:userDetail.UserName,
              email:userDetail.Email,
              userDetail:userDetail,
              imgUrl:userDetail.UserImagePath,
          })

     }).done();
  }

  render() {
    var isShowHud = this.state.isShowHud;
    imgUri = this.state.imgUrl
    return (
      <View style={styles.container}>
        {/* HeaderView */}
        <View style={{
          flex:820,
          // backgroundColor:'red'
        }}>
          <View style={{
              flex:130,
              // backgroundColor:'green'
            }}>
          </View>
          
          <View style={{
              flex:400,
              // backgroundColor:'red',
              alignItems:'center',
              overflow:'hidden',
            }}>
            {this.state.imgUrl === '' ? <Image style={{
                  // backgroundColor:'rgba(0,165,235,1)',
                  // flex:1,
                  width:90,
                  height:90,
                  borderRadius:45,
                  overflow:'hidden',
                }}
                source={require('Domingo/Src/images/user-icon.png')}
            /> 
            :
            <Image style={{
                // backgroundColor:'rgba(0,165,235,1)',
                // flex:1,
                width:90,
                height:90,
                borderRadius:45,
                overflow:'hidden',
              }}
              source={{ uri: imgUri}}
              resizeMode='cover'
            />
            }
            {/* <Image style={{
                  // backgroundColor:'rgba(0,165,235,1)',
                  // flex:1,
                  width:100,
                  height:100,
                  borderRadius:50,
                  overflow:'hidden',
                }}
                source={this.state.imgUrl === '' ? require('Domingo/Src/images/user-icon.png') : this.state.imgUrl}
            /> */}
          </View>
          <View style={{
              flex:60,
              // backgroundColor:'white'
            }}>
            
          </View>
          <View style={{
              flex:95,
              // backgroundColor:'green',
              alignItems:'center',
              justifyContent:'center'
            }}>
            <Text style={{
              fontSize:19,
              color:'white'
            }}>{this.state.userName}</Text>  
          </View>
          <View style={{
              flex:80,
              // backgroundColor:'white',
              alignItems:'center',
              justifyContent:'center'
            }}>
            <Text style={{
              fontSize:15,
              color:'white'
            }}>{this.state.email}</Text>
          </View>
          <View style={{
              flex:55,
              // backgroundColor:'red'
            }}>
          </View>
        </View>

        {/* OptionView */}
        <View style={{
          flex:1425,
          // backgroundColor:'yellow'
        }}>
          <TouchableWithoutFeedback onPress={this.onClickSwitch.bind(this)}>
            <View style={{
              flex:220,
              // backgroundColor:'red',
              borderBottomWidth:1,
              borderBottomColor:'white',
              marginRight:'12%',
              flexDirection:'row',
              alignItems:'center',
              paddingLeft:20
            }}>
                <Image style={{
                    // backgroundColor:'white',
                    // flex:1,
                    width:40,
                    height:40,
                  }}
                  source={require('Domingo/Src/images/switch.png')}
                />
                <Text style={{
                fontSize:21,
                color:'white',
                marginLeft:15
              }}>{LS.LString.switchText}</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.onClickProfile.bind(this)}>
            <View style={{
              flex:220,
              // backgroundColor:'green',
              borderBottomWidth:1,
              borderBottomColor:'white',
              marginRight:'12%',
              flexDirection:'row',
              alignItems:'center',
              paddingLeft:20
            }}>
              <Image style={{
                    // backgroundColor:'white',
                    // flex:1,
                    width:40,
                    height:40,
                  }}
                  source={require('Domingo/Src/images/profile.png')}
                  />
                <Text style={{
                fontSize:21,
                color:'white',
                marginLeft:15
              }}>{LS.LString.profileText}</Text>
            </View>
          </TouchableWithoutFeedback>

            {this.state.userType === 1 ? <TouchableWithoutFeedback onPress={this.onClickHome.bind(this)}>
          
          <View style={{
            flex:220,
            // backgroundColor:'red',
            borderBottomWidth:1,
            borderBottomColor:'white',
            marginRight:'12%',
            flexDirection:'row',
            alignItems:'center',
            paddingLeft:20
          }}>
            <Image style={{
                  // backgroundColor:'white',
                  // flex:1,
                  width:40,
                  height:40,
                }}
                source={require('Domingo/Src/images/home.png')}
                />
              <Text style={{
              fontSize:21,
              color:'white',
              marginLeft:15
            }}>{LS.LString.homeText}</Text>
          </View>
        </TouchableWithoutFeedback> : 
        <TouchableWithoutFeedback onPress={this.onClickSettings.bind(this)}>
          
          <View style={{
            flex:220,
            // backgroundColor:'red',
            borderBottomWidth:1,
            borderBottomColor:'white',
            marginRight:'12%',
            flexDirection:'row',
            alignItems:'center',
            paddingLeft:20
          }}>
            <Image style={{
                  // backgroundColor:'white',
                  // flex:1,
                  width:40,
                  height:40,
                }}
                source={require('Domingo/Src/images/settings.png')}
              />
              <Text style={{
              fontSize:21,
              color:'white',
              marginLeft:15
            }}>{LS.LString.settingsText}</Text>
          </View>
        </TouchableWithoutFeedback>
      }
          <TouchableWithoutFeedback onPress={this.onClickAboutUs.bind(this)}>
          
            <View style={{
              flex:220,
              // backgroundColor:'green',
              borderBottomWidth:1,
              borderBottomColor:'white',
              marginRight:'12%',
              flexDirection:'row',
              alignItems:'center',
              paddingLeft:20
            }}>
              <Image style={{
                    // backgroundColor:'white',
                    // flex:1,
                    width:40,
                    height:40,
                  }}
                  source={require('Domingo/Src/images/about.png')}
                />
                <Text style={{
                fontSize:21,
                color:'white',
                marginLeft:15
              }}>{LS.LString.aboutUsText}</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.onClickHelp.bind(this)}>
          
            <View style={{
              flex:220,
              // backgroundColor:'red',
              // borderBottomWidth:1,
              // borderBottomColor:'white',
              // marginRight:'12%',
              flexDirection:'row',
              alignItems:'center',
              paddingLeft:20
            }}>
              <Image style={{
                    // backgroundColor:'white',
                    // flex:1,
                    width:40,
                    height:40,
                  }}
                  source={require('Domingo/Src/images/help.png')}
                />
                <Text style={{
                fontSize:21,
                color:'white',
                marginLeft:15
              }}>{LS.LString.helpText}</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={{
            flex:220,
            flexDirection:'row',
            alignItems:'center',
            paddingLeft:20
          }}>
          </View>
          <View style={{
            flex:105,
            // backgroundColor:'red'
          }}></View>
        </View>
        {/* Footer View */}
        <View style={{
          flex:315,
          // backgroundColor:'red',
          flexDirection:'row',
        }}>
          <View style={{height:'100%',width:15}}></View>

          {'isGuestUser' in this.state.userDetail ? 
            <TouchableWithoutFeedback onPress={this.onClickLogout.bind(this)}>
            
              <View style={{
                height:'100%',
                width:80, 
                // backgroundColor:'pink', 
                // flex:1, 
                flexDirection:'column',
                alignItems:'center'
              }}>
                <Image style={{
                      // backgroundColor:'rgba(0,165,235,1)',
                      // flex:1,
                      width:40,
                      height:40,
                    }}
                    // source={require('Domingo/Src/images/logout.png')}
                    />
                <Text style={{
                  fontSize:21,
                  color:'white'
                }}>{LS.LString.loginTextSmall}</Text>  
              </View>
            </TouchableWithoutFeedback>
          :
            <TouchableWithoutFeedback onPress={this.onClickLogout.bind(this)}>
            
              <View style={{
                height:'100%',
                width:80, 
                // backgroundColor:'pink', 
                // flex:1, 
                flexDirection:'column',
                alignItems:'center'
              }}>
                <Image style={{
                      // backgroundColor:'rgba(0,165,235,1)',
                      // flex:1,
                      width:40,
                      height:40,
                    }}
                    source={require('Domingo/Src/images/logout.png')}
                    />
                <Text style={{
                  fontSize:21,
                  color:'white'
                }}>{LS.LString.logoutText}</Text>  
              </View>
            </TouchableWithoutFeedback>
        } 

          <View style={{
            height:'100%',
            width:Constant.DEVICE_WIDTH-15-80-85, 
            // backgroundColor:'green'
          }}></View>
          <TouchableWithoutFeedback onPress={this.onClickClose.bind(this)}>
          
            <View style={{
              height:'100%',
              width:85, 
              // backgroundColor:'rgba(0,165,235,1)',
              justifyContent:'flex-end',
              alignItems:'flex-end',
            }}>
              <Image style={{
                    // backgroundColor:'rgba(0,165,235,1)',
                    // flex:1,
                    width:'100%',
                    height:'100%',
                    borderColor:'white',
                    // borderWidth:1
                  }}
                  source={require('Domingo/Src/images/close.png')}
                />
            </View>
          </TouchableWithoutFeedback>
        </View>
        { isShowHud == true ? <ActivityIndicator
                    color={'rgba(0,165,235,1)'}    //rgba(254,130,1,0.5)'
                    size={'large'}
                    style={styles.loaderStyle}
                    />: null
                }

        {Platform.OS === 'ios' ? 
          <TouchableHighlight style={{position:'absolute'}}onPress={this.onClickLanguage.bind(this)}>
          <View style={{
            height:25,
            width:80,
            // backgroundColor:'grey',
            position:'absolute',
            zIndex:5,
            marginTop:35,
            marginLeft:20,
            alignItems:'center',
            borderColor:'white',
            borderWidth:1,
            borderRadius:10,
            justifyContent:'center'
          }}>
            <Text style={{
              color:'white'
            }}>
              Language
            </Text>
          </View>
        </TouchableHighlight>
        :
          <View style={{
            height:25,
            width:80,
            // backgroundColor:'grey',
            position:'absolute',
            zIndex:50,
            marginTop:15,
            marginLeft:15,
            alignItems:'center',
            borderColor:'white',
            borderWidth:1,
            borderRadius:10,
            justifyContent:'center'
          }}>
            <TouchableWithoutFeedback style={{
              position:'absolute',
              height:'100%',  
              width:'100%',
            }}onPress={this.onClickLanguage.bind(this)}>
            <Text style={{
              textAlign:'center',
              color:'white'
            }}>
              Language
            </Text>
            </TouchableWithoutFeedback>
          </View>
      
        }
        
        {Platform.OS === 'ios' ? 
          <TouchableHighlight style={{position:'absolute'}}onPress={this.onClickShareButton.bind(this)}>
            <View style={{
              height:40,
              width:40,
              // backgroundColor:'grey',
              position:'absolute',
              zIndex:5,
              marginTop:35,
              marginLeft: Constant.DEVICE_WIDTH - 60,
              alignItems:'center',
              // borderColor:'white',
              // borderWidth:1,
              borderRadius:10,
              justifyContent:'center'
            }}>
              <Image style={{
                  position:'relative',
                  // backgroundColor:'red',
                  width:40,
                  height:40,
                  // marginTop:Platform.OS === 'ios' ? 4 : 0,
                  marginRight:10
                }}
                source={require('Domingo/Src/images/share-icon.png')}
                // resizeMethod='resize'
                resizeMode='contain'
              />
            </View>
          </TouchableHighlight>  
          :
          
            <View style={{
              height:40,
              width:40,
              // backgroundColor:'grey',
              position:'absolute',
              zIndex:5,
              marginTop:20,
              marginLeft: Constant.DEVICE_WIDTH - 60,
              alignItems:'center',
              // borderColor:'white',
              // borderWidth:1,
              borderRadius:10,
              justifyContent:'center'
            }}>

              <TouchableHighlight style={{
                position:'absolute',
                height:'100%',  
                width:'100%',
              }} onPress={this.onClickShareButton.bind(this)}>

                <Image style={{
                    position:'relative',
                    // backgroundColor:'red',
                    width:40,
                    height:40,
                    // marginTop:Platform.OS === 'ios' ? 4 : 0,
                    marginRight:10
                  }}
                  source={require('Domingo/Src/images/share-icon.png')}
                  // resizeMethod='resize'
                  resizeMode='contain'
                />

              </TouchableHighlight>
            </View>
          
        }

        <ActionSheet
            ref='laguageSheet'
            options={this.state.arrLanguageType}
            cancelButtonIndex={CANCEL_INDEX}
            onPress={this.onLanguageSelection.bind(this)}/>
        
      </View>
    );
  }

  onClickShareButton() {
    console.log("onClickShareButton")
    var strMsg = ""
    
    if (Platform.OS === 'ios') {
      strMsg = "Mercado Angola Application For IOS Link: " + "https://itunes.apple.com/us/app/mercado-angola/id1380062670?ls=1&mt=8" + " Android Link: " + "https://play.google.com/store/apps/details?id=com.domingo"
    }
    else {
      strMsg = "Mercado Angola Application For Android Link:" + "https://play.google.com/store/apps/details?id=com.domingo" + " IOS Link: " + "https://itunes.apple.com/us/app/mercado-angola/id1380062670?ls=1&mt=8"
    }
    
    let shareOptions = {
      title: "Mercado Angola",
      message: strMsg,
      url: Platform.OS === 'ios' ? "https://itunes.apple.com/us/app/mercado-angola/id1380062670?ls=1&mt=8"  : "https://play.google.com/store/apps/details?id=com.domingo", //Platform.OS === 'ios' ? "https://itunes.apple.com/us/app/mercado-angola/id1380062670?ls=1&mt=8" : "https://play.google.com/store/apps/details?id=com.domingo",
      subject: "Share Mercado Angola" //  for email
    };

    Share.open(shareOptions);
  }

  onClickLanguage() {
    this.refs['laguageSheet'].show()
    console.log("language Id:=", this.state.languageId)
    /*
    if (this.state.languageId == 'en') {
      LS.LString.setLanguage('pt')
      this.setState({
        languageId:'pt'
      })
      AsyncStorage.setItem('languageId','pt')
    }
    else {
      LS.LString.setLanguage('en')
      this.setState({
        languageId:'en'
      })
      AsyncStorage.setItem('languageId','en')
    }
    */
  }

  onLanguageSelection(selected) {
    console.log("onLanguageSelection clicked:=",selected);
    if(selected === 0) {
      
    }
    else if (selected === 1) {
      LS.LString.setLanguage('pt')
      this.setState({
        languageId:'pt'
      })
      AsyncStorage.setItem('languageId','pt')
      Events.trigger('updateUI')
    }
    else if (selected === 2) {
      LS.LString.setLanguage('en')
      this.setState({
        languageId:'en'
      })
      AsyncStorage.setItem('languageId','en')
      Events.trigger('updateUI')
    }
  }

  onClickSwitch() {
    console.log('onClickSwitch:=',)

    if ('isGuestUser' in this.state.userDetail) {
      Alert.alert(
        'Guest User',
        'You are guest user, Please login to access this features',
        [
          {text: LS.LString.cancelText, onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: LS.LString.okText, onPress: () => this.onClickLoginForGuest()},
        ],
        { cancelable: false }
      )
    }
    else {
      var msg = ''

      if (this.state.userType == 1) {
        msg = LS.LString.vSwitchUserText
      }
      else {
        msg = LS.LString.vSwitchVendorText
      }

      Alert.alert(
        LS.LString.userTypeChText,
        msg,
        [
          {text: LS.LString.cancelText, onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: LS.LString.okText, onPress: () => this.onWebServiceCallingForSwitchUser()},
        ],
        { cancelable: false }
      )
    }
    return 
  }

  proceedToChangeUserType() {
      if (this.state.userType === 1) {
        // Events.trigger("removeFuseLocation",'')
        AsyncStorage.setItem("userType", "2");
        this.state.userType=2
        this.setState({
          userType:2
        },)      
        this.props.navigation.navigate('DrawerClose')
        this.props.navigation.navigate('profileVendor');
      }
      else {
        AsyncStorage.setItem("userType", "1");
        this.state.userType=1
        this.setState({
          userType:1
        },)      
        this.props.navigation.navigate('DrawerClose')
        this.props.navigation.navigate('home');
      }
  }

  onResetHome() {
    this.props.navigation.navigate('DrawerClose')
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
          NavigationActions.navigate({ routeName: 'home' })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  onResetProfileVendor() {
    this.props.navigation.navigate('DrawerClose')
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
          NavigationActions.navigate({ routeName: 'profileVendor' })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  onClickProfile() {
    // this.props.navigation.navigate('profile')
    if (this.state.userType == 1) {
      if ('isGuestUser' in this.state.userDetail) {
        Alert.alert(
          'Guest User',
          'You are guest user, Please login to access this feature',
          [
            {text: LS.LString.cancelText, onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: LS.LString.okText, onPress: () => this.onClickLoginForGuest()},
          ],
          { cancelable: false }
        )
      }
      else {
        this.props.navigation.navigate('DrawerClose');
        this.props.navigation.push('profile');
      }
    }
    else {
      this.props.navigation.navigate('DrawerClose');
      this.props.navigation.navigate('profileVendor');
    }
  }

  onClickLoginForGuest() {
    AsyncStorage.removeItem('SIGNINSTATUS')
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
          NavigationActions.navigate({ routeName: 'login' })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  onClickHome() {
    this.props.navigation.navigate('home')
  }

  onClickSettings() {
    this.props.navigation.navigate('DrawerClose');
    this.props.navigation.push('settings')
  }

  onClickAboutUs() {
    this.props.navigation.navigate('aboutUs',{'isForAboutUs':1})
  }

  onClickHelp() {
    this.props.navigation.navigate('help',{'isForAboutUs':0})
  }

  onClickLogout() {
    // AsyncStorage.removeItem('SIGNINSTATUS',this.navigateToLogin())
    if ('isGuestUser' in this.state.userDetail) {
      this.onClickLoginForGuest()
    }
    else {
      this.onWebServiceCallingForLogout()
    }
  }

  navigateToLogin() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
          NavigationActions.navigate({ routeName: 'login' })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  onClickClose() {
    this.props.navigation.navigate('DrawerClose');
  }

  onClickMenu() {
    console.log("onClickMenu clicked")
  }

  onClickSave() {
    console.log("onClickSignUp clicked");
  }

  onClickBack() {
    console.log("onClickBack clicked");
  }

  onUserTypeSelection(selected) {
    console.log("onUserTypeSelection clicked:=",selected);
    if(selected === 0){
      this.setState({
          userType: ''
      })
    }else{
      this.setState({
        userType: this.state.arrUserType[selected]
      })
    }
  }

  onIndustrySelection(selected) {
    console.log("onIndustrySelection clicked:=",selected);
    if(selected === 0){
      this.setState({
          industry: ''
      })
    }else{
      this.setState({
        industry: this.state.arrIndustry[selected]
      })
    }
  }
}

const styles = StyleSheet.create({
  
  container: {
    flex: 2560,
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'rgba(23,24,25,0.9)',
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
