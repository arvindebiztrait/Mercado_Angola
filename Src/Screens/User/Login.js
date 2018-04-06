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
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
  NetInfo,
  TouchableWithoutFeedback,
  
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constant from 'Domingo/Src/Screens/GeneralClass/Constant';
import Modal from 'react-native-modal';
import { NavigationActions } from 'react-navigation';
import ws from 'Domingo/Src/Screens/GeneralClass/webservice'; 
import Events from 'react-native-simple-events';
import LS from 'Domingo/Src/Screens/GeneralClass/LocalizationStrings';
import ActionSheet from 'react-native-actionsheet';

export const STATUSBAR_HEIGHT  = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 0

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class Login extends Component<Props> {

  constructor(props) {
    super(props)
    this.state = {
        email:'',
        password:'',
        isShowHud: false,
        promptVisible:false,
        forgotPassEmail:'',
        isForgotPassword:false,
        isShowHud:false,
        deviceToken:'',
        languageId:'pt',
        arrLanguageType:[LS.LString.cancelText,'portuguese','English'],
    };
  }

  componentDidMount (){
    console.log("componentDidMount")    
    this.getDeviceToken()
    Events.on('receiveResponse', 'receiveResponseLogin', this.onReceiveResponse.bind(this)) 
    Events.on('readDeviceToken', 'readDeviceTokenLogin', this.getDeviceToken.bind(this))

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

  getDeviceToken() {
    AsyncStorage.getItem("DEVICETOKENFCM").then((value1) => {
      console.log("DEVICETOKENFCM:=",value1) 
      this.state.deviceToken = value1
      // this.setState({                            
      //     deviceToken:value1,
      // }) 

    }).done();
  }

  onReceiveResponse (responceData) {        
    if (responceData.methodName == 'Login') {
        console.log('responceData:=',responceData)
        this.setState({isShowHud: false,isDisable:false})
        
        if (responceData.Status == true) {
            obj = JSON.stringify(responceData.Results)               
            AsyncStorage.setItem("SIGNINSTATUS", "1");
            AsyncStorage.setItem("USERDETAIL",obj);

            if (responceData.Results.UsersTypeId === 1) {
              // Reset Navigation 
                const resetAction = NavigationActions.reset({
                  index: 0,
                  actions: [                                               
                      NavigationActions.navigate({ routeName: 'home' })
                  ]
              });
              this.props.navigation.dispatch(resetAction);
            }
            else if (responceData.Results.UsersTypeId === 2) {
              // Reset Navigation 
                const resetAction = NavigationActions.reset({
                  index: 0,
                  actions: [                                               
                      NavigationActions.navigate({ routeName: 'profileVendor' })
                  ]
              });
              this.props.navigation.dispatch(resetAction);
            }
          
        }
        else{
           alert(responceData.ErrorMessage)
        }
    }
    else if (responceData.methodName == 'ForgotPassword') {
      
      if (responceData.Status == true) {
        // alert(responceData.Results.Message)
        this.setState({ isForgotPassword: false, isShowHud : false})
        this.ShowAlertWithDelay(responceData.Results.Message)
      }
      else {
        this.setState({isShowHud : false})
        alert(responceData.ErrorMessage)
      }
    }
  }

  onWebServiceCallingForLogin() {
      NetInfo.isConnected.fetch().then(isConnected => {
          console.log(isConnected)
          console.log('First, is ' + (isConnected ? 'online' : 'offline'));
          
            if(isConnected) {
                var param = {
                    'Email':this.state.email,
                    'password':this.state.password,
                    'DeviceType':Platform.OS === 'ios' ? 1 : 2,
                    'DeviceToken':this.state.deviceToken,
                }
                console.log("param is ",param);
                this.setState({
                  isShowHud : true
                })
                ws.callWebservice('Login',param,'')
                  //  ws.callGlobalWebservice("bardetail",param);
            }
            else {
                alert(Constant.NETWORK_ALERT)
            }
      });
  }

  onWebServiceCallingForForgotPassword() {
       NetInfo.isConnected.fetch().then(isConnected => {
          console.log(isConnected)
          console.log('First, is ' + (isConnected ? 'online' : 'offline'));
            
            if(isConnected)
            {
                    var param = {
                        'EmailId':this.state.forgotPassEmail,
                    }
                    console.log("param is ",param);
                    this.setState({
                      isShowHud : true
                    })
                    ws.callWebservice('ForgotPassword',param,'')
                  //  ws.callGlobalWebservice("bardetail",param);
            }
            else
            {
                alert(Constant.NETWORK_ALERT)
            }
      });
  }

  ShowAlertWithDelay=(strMessage)=>{
 
    setTimeout(function(){
 
      //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
      alert(strMessage)
 
    }, 1000);
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
          <Image style = {{
            position:'relative',
            width:'100%',
            resizeMode:'cover',
            height:Constant.DEVICE_HEIGHT - 0,
          }} source={require('Domingo/Src/images/background.png')}/>
      </View>  
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}>   
        <View style = {{
          height:Constant.DEVICE_HEIGHT - STATUSBAR_HEIGHT,
          flexDirection:'column',
        }}>
        
        <View style={{
            flex:196
        }}>
        </View>
        <View style={{
            flex:320,
            justifyContent:'center',
            alignItems:'center'
        }}>
          <Image style={{
            // backgroundColor:'yellow',
            flex:320,
            // width:100
          }}
          source={require('Domingo/Src/images/logo.png')}
          resizeMode='contain'
          />
        </View>
        
        {/* <View style={{
            flex:92,
            justifyContent:'center',
            alignItems:'center'
        }}>
          <Text style={{
            color:'rgba(18,58,100,1)',
            alignItems:'center',
            justifyContent:'center',
            fontSize:24
          }}>Mercado_Angola</Text>
        </View>
        
        <View style={{
            flex:68,
            justifyContent:'center',
            alignItems:'center'
        }}>
          <Text style={{
            color:'rgba(236,104,57,1)',
            alignItems:'center',
            justifyContent:'center',
            fontSize:17
          }}>Encontra aqui! Vende Aqui! $</Text>
        </View> */}
        
        <View style={{
            flex:150
        }}>
        </View>
        <View style={{
            flex:974,
            alignItems:'center',            
        }}>
          <View style={{
            backgroundColor:'white',
            flex:974,
            width:'70%',
            borderWidth:2,
            borderColor:'grey',
            borderRadius:10,
            overflow:'hidden'
          }}>
            <View style={{
                flex:72
            }}>
            </View>
            <View style={{
                flex:70,
                justifyContent:'center',
                alignItems:'center'
            }}>
              <Text style={{
                color:'rgba(0,42,82,1)',
                alignItems:'center',
                justifyContent:'center',
                fontSize:20
              }}>
                {LS.LString.LoginTitle}
              </Text>
            </View>
            <View style={{
                flex:172
            }}>
            </View>
            <View style={{
                flex:90
            }}>
              <TextInput style={{
                borderBottomColor:'grey',
                borderBottomWidth:1,
                marginLeft:10,
                marginRight:10,
                paddingBottom:Platform.ios === 'ios' ? 0 : 5,
                height:Platform.ios === 'ios' ? 23 : 32,
                paddingLeft:0,
                paddingRight:0,
              }}
                            placeholder= {LS.LString.emailText}
                            allowFontScaling={false}
                            ref='email'   
                            keyboardType='email-address'
                            returnKeyType='next'
                            placeholderTextColor='rgba(79,90,105,1)'
                            underlineColorAndroid='transparent'
                            value={this.state.email}
                            autoCapitalize='none'
                            onChangeText={(text) => this.setState({email:text})} 
                            onSubmitEditing={(event) => this.refs['password'].focus()}  
                           // onBlur= {this.onBlurTextInput.bind(this)} 
                            />
            </View>
            <View style={{
                flex:90
            }}>
            </View>
            <View style={{
                flex:90
            }}>
              <TextInput style={{
                borderBottomColor:'rgba(120,120,120,1)',
                borderBottomWidth:1,
                marginLeft:10,
                marginRight:10,
                paddingBottom:Platform.ios === 'ios' ? 0 : 5,
                height:Platform.ios === 'ios' ? 23 : 32,
                // backgroundColor:'red',
                paddingLeft:0,
                paddingRight:0,
              }}
                            placeholder= {LS.LString.passwordText}
                            allowFontScaling={false}
                            ref='password'   
                            keyboardType='default'
                            returnKeyType='done'
                            placeholderTextColor='rgba(79,90,105,1)'
                            underlineColorAndroid='transparent'
                            value={this.state.password}
                            autoCapitalize='none'
                            secureTextEntry = {true}
                            onChangeText={(text) => this.setState({password:text})} 
                            onSubmitEditing={(event) => console.log('Submit clicked')}  
                           // onBlur= {this.onBlurTextInput.bind(this)} 
                            />
            </View>
            <View style={{
                flex:62
            }}>
            </View>
            <View style={{
                flex:62,
                alignItems:'center',
                justifyContent:'center'
            }}>
              <TouchableHighlight onPress={this.onClickForgotPassword.bind(this)} style={{
                  
                }}>
                <Text textColor='rgba(79,90,105,1)'>{LS.LString.fPasswordText}</Text>
              </TouchableHighlight>
            </View>
            <View style={{
                flex:62
            }}>
            </View>
            <View style={{
                flex:110,
                alignItems:'center'
            }}>
                <TouchableHighlight onPress={this.onClickSignIn.bind(this)} style={{
                  backgroundColor:'rgba(0,164,235,1)',
                  flex:110,
                  width:'50%',
                  alignItems:'center',
                  justifyContent: 'center',
                  borderRadius:20
                }}>
                <Text style={{
                  color:'white',
                  alignItems:'center',
                  justifyContent:'center',
                  fontSize:15,
                }}>
                  {LS.LString.signInText}
                </Text>
              </TouchableHighlight>
            </View>
            <View style={{
                flex:94
            }}>
            </View>
          </View>
        </View>
        <View style={{
            flex:68
        }}>
        </View>
        <View style={{
            flex:54,
            alignItems:'center',
            flexDirection:'row',
            justifyContent:'center'
        }}>
          <Text style={{
            color:'black',
            alignItems:'center',
            justifyContent:'center',
            fontSize:13
          }}>
            {LS.LString.dontHaveAccText} {' '}
          </Text>
          <TouchableHighlight onPress={this.onClickSignUp.bind(this)}>
            <Text style={{
              color:'white',
              alignItems:'center',
              justifyContent:'center',
              fontSize:13
            }}>
              {LS.LString.signUpText}
            </Text>
          </TouchableHighlight>
        </View>
        <View style={{
            flex:268
        }}>
        </View>
        
        {this.loadForgotPasswordView()}
        { isShowHud == true ? <ActivityIndicator
                    color={'rgba(0,165,235,1)'}    //rgba(254,130,1,0.5)'
                    size={'large'}
                    style={styles.loaderStyle}
                    />: null
                }
        </View>
        {Platform.OS === 'ios' ? 
          <TouchableHighlight style={{position:'absolute'}}onPress={this.onClickLanguage.bind(this)}>
            <View style={{
              height:25,
              width:80,
              // backgroundColor:'grey',
              position:'absolute',
              zIndex:50,
              marginTop:35,
              marginLeft:20,
              alignItems:'center',
              borderColor:'gray',
              borderWidth:1,
              borderRadius:10,
              justifyContent:'center'
            }}>
              <Text>
                Language
              </Text>
            </View>
          </TouchableHighlight>
        :      
          // <TouchableHighlight style={{position:'absolute'}}onPress={this.onClickLanguage.bind(this)}>
            <View style={{
              height:25,
              width:80,
              // backgroundColor:'grey',
              position:'absolute',
              zIndex:50,
              marginTop:15,
              marginLeft:15,
              alignItems:'center',
              borderColor:'gray',
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
              }}>
                Language
              </Text>
              </TouchableWithoutFeedback>
            </View>
    
        }
        

        <ActionSheet
            ref='laguageSheet'
            options={this.state.arrLanguageType}
            cancelButtonIndex={CANCEL_INDEX}
            onPress={this.onLanguageSelection.bind(this)}/>
        </KeyboardAwareScrollView>
        
      </View>
    );
  }

  loadForgotPasswordView() {
    return(<Modal isVisible={this.state.isForgotPassword}>
      <View style={{alignItems : 'center', padding:10, backgroundColor: '#fff', height:Platform.OS === 'ios' ? 170 : 200, borderRadius:10}}>
        <Text style={{fontSize:20}}> {LS.LString.fPasswordText} </Text>
        <View style ={[{borderColor:'#fbcdc5',flexDirection:'row',borderColor:'grey',
            borderBottomWidth:1, marginTop:15, marginLeft:5, marginRight:5}]}>
          {/* <Image style={{
            backgroundColor:'yellow',
            height:35,
            width:'15%',
            marginBottom:5
          }}></Image> */}
          <TextInput
            style={[{left:0, width:'85%', paddingBottom:10, marginTop:15, paddingHorizontal:0}]}
            // onBlur={ () => this.onBlurUser() }
            value={this.state.for}
            underlineColorAndroid = 'transparent'
            autoCorrect={false}
            keyboardType={'email-address'}
            placeholder={LS.LString.emailAddressText}
            maxLength={140}
            autoCapitalize={'none'}
            onSubmitEditing={() => {
              console.log('Submit')
            }}
            returnKeyType={ "done" }
            ref={ input => {
                  // this.inputs['one'] = input;
            }}
            onChangeText={(forgotemail) => this.setState({forgotPassEmail:forgotemail})}
          />
        </View>
        <View style={{flexDirection: 'row', height: 40, justifyContent:'center', alignItems:'center', marginTop:20}}>
        <TouchableOpacity
          onPress={()=> this.setState({ isForgotPassword:  false})}
          style={{
            margin:10,
            width:'40%',
            justifyContent:'center',
            alignItems:'center',
            height:40,
            borderWidth:1,
            borderColor:'grey',
            borderRadius:5
          }}>
          <Text style={{color :'black', fontSize : 15, padding:5}}>
          {LS.LString.cancelText}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=> this.onClickSubmitForgotPassword()}
          style={{
            margin:10,
            width:'40%',
            justifyContent:'center',
            alignItems:'center',
            height:40,
            borderWidth:1,
            borderColor:'grey',
            borderRadius:5
          }}> 
          <Text style={{color :'black', fontSize : 15, padding:5}}>
          {LS.LString.SubmitText}
          </Text>
        </TouchableOpacity>
        </View>
      </View>
  </Modal>)
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
    }
    else if (selected === 2) {
      LS.LString.setLanguage('en')
      this.setState({
        languageId:'en'
      })
      AsyncStorage.setItem('languageId','en')
    }
  }

  onClickSignUp() {
    console.log("onClickSignUp clicked");
    this.props.navigation.navigate('signup')
    
  }
  onClickSignIn() {
    
    // NetInfo.isConnected.fetch().then(connectionChange => {
    //   console.log(connectionChange)
    //   console.log('First, is ' + (connectionChange ? 'online' : 'offline'));

    //   if(connectionChange){

    //   }
    //   else {
    //     alert(Constant.NETWORK_ALERT)
    //   }
    // });

    // console.log("ws.isConnectedGlobal:=",ws.isConnectedGlobal)

    // return;


    console.log("onClickSignIn clicked");
    // Reset Navigation 
  //   const resetAction = NavigationActions.reset({
  //     index: 0,
  //     actions: [                                               
  //         NavigationActions.navigate({ routeName: 'home' })
  //     ]
  //  });
  //  this.props.navigation.dispatch(resetAction);

    if (this.validateData()) {
      this.onWebServiceCallingForLogin()
    }
  }
  onClickForgotPassword() {
    console.log("onClickForgotPassword clicked");
    this.setState({
      promptVisible:true,
      isForgotPassword:true
    })
  }
  onClickSubmitForgotPassword() {
    console.log("onClickSubmitForgotPassword clicked");
    if (this.validateDataForgotPasswordData()) {
      this.onWebServiceCallingForForgotPassword()
    }
  }

  validateDataForgotPasswordData() {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;

    if (this.state.forgotPassEmail == '') {
      alert('Please enter email')
      return false
    }
    else if (reg.test(this.state.forgotPassEmail) === false) {
      alert('Please enter valid email')
      return false
    }
    return true
  }

  validateData() {

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;

    if (this.state.email == '') {
      alert(LS.LString.enterEmailText)
      return false
    }
    else if (reg.test(this.state.email) === false) {
      alert(LS.LString.enterValidEmailText)
      return false
    }
    else if (this.state.password == '') {
      alert(LS.LString.enterPasswordText)
      return false
    }
    return true
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 2042,
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
