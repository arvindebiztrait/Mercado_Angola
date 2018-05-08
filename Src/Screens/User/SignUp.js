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
  NetInfo,
  ActivityIndicator,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constant from 'Domingo/Src/Screens/GeneralClass/Constant';
import ws from 'Domingo/Src/Screens/GeneralClass/webservice'; 
import ActionSheet from 'react-native-actionsheet';
import EventEmitter from "react-native-eventemitter";
import Events from 'react-native-simple-events';
import ImagePicker from 'react-native-image-picker';
import Permissions from 'react-native-permissions';
import LS from 'Domingo/Src/Screens/GeneralClass/LocalizationStrings';

export const STATUSBAR_HEIGHT  = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 0

const countryTitle = 'Select Country'
const deliveryTitle = 'Select Deliveryarea'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class SignUp extends Component<Props> {

  constructor(props) {
    super(props)
    this.state = {
        userType:'',
        businessName:'',
        name:'',
        address:'',
        email:'',
        industry:'',
        industryIds:'',
        contact:'',
        password:'',
        confirmPassword:'',
        arrUserType:[LS.LString.cancelText,LS.LString.userText,LS.LString.vendorText],
        arrIndustry:[LS.LString.cancelText,'A','B','C'],
        arrImageOption:[LS.LString.cancelText,LS.LString.takePhoto,LS.LString.cfLibrary],
        
        fullAddress:'',
        city:'',
        street:'',
        country:'',
        block_no:'',
        zipCode:'',
        areaName:'',
        latitude:'',
        longitude:'',
        isShowHud:false,
        arrCategory:[],
        selectedIndexOfCatgeory:-1,
        userImage:null,
        photoResponse:null,
    };
  }

  componentDidMount (){
      console.log("componentDidMount")
      EventEmitter.removeAllListeners("addressSelected");
      EventEmitter.on("addressSelected", (value)=>{
        console.log("addressSelected", value);
        this.setState({
          fullAddress : value.fullAddress,
          address : value.fullAddress,
          city : value.city,
          street : value.street,
          country : value.country,
          block_no : value.block_no,
          zipCode : value.zipCode,
          areaName: value.areaName,
          latitude : value.latitude,
          longitude : value.longitude,
        })
      });
      
      Events.on('receiveResponse', 'receiveResponseSignUp', this.onReceiveResponse.bind(this)) 
      Events.on('selectedCategory', 'selectedCategorySignUp', this.onSelectedCategory.bind(this)) 
      // this.onWebServiceCallingForCategoryList()

      // if (Platform.OS === 'ios') {

      // }
      // else {
      //   Geolocation.requestAuthorization();

      //   Geolocation.getCurrentPosition(
      //     (position) => {
      //       this.setState({
      //         coordinate: { 
      //           latitude: position.coords.latitude,
      //           longitude: position.coords.longitude,
      //         },
      //         region: {
      //           latitude: position.coords.latitude,
      //           longitude: position.coords.longitude,
      //           latitudeDelta: 0.0922,
      //           longitudeDelta: 0.0421,
      //         },
      //       },this.loadAddressFromMap());
      //     },
      //     (error) => console.log(error.error),
      //     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },);
      // }
  }

  onSelectedCategory(data) {
    console.log("onSelectedCategory:=",data)
    this.setState({
      industry:data.categoryName,
      industryIds:data.categoryId
    })
  }

  onReceiveResponse (responceData) { 
       
    if (responceData.methodName == 'CategoryListing') {
        console.log('responceData:=',responceData)
        this.setState({isShowHud: false,isDisable:false})
        
        if (responceData.Status == true) {
          var arrCatTitle = []
          arrCatTitle= []
          arrCatTitle.push('Cancel');
          let arrCategory = responceData.Results.Category_List;
          for(var i=0; i < arrCategory.length; i++) {
              category = arrCategory[i];
              // console.warn(order);
              country_name = category.CategoryName;
              arrCatTitle.push(country_name);
              
              this.setState({
                arrIndustry : arrCatTitle,
                arrCategory : arrCategory,
              })
          }
          console.log('responceData:=',arrCatTitle)
        }
        else{
           alert(responceData.ErrorMessage)           
        }
    }
    else if (responceData.methodName == 'SignUp') {
        console.log('responceData:=',responceData)
        this.setState({isShowHud: false,isDisable:false})
        
        if (responceData.Status == true) {
          alert(responceData.Results.Message)
          this.props.navigation.pop()
        }
        else{
          alert(responceData.ErrorMessage)
        }
    }
  }

  onWebServiceCallingForCategoryList()
    {
         NetInfo.isConnected.fetch().then(isConnected => {
            console.log(isConnected)
            console.log('First, is ' + (isConnected ? 'online' : 'offline'));
             
              if(isConnected)
              {
                     var param = {
                         'Page_Number':1,
                         'Page_Size':50,
                        //  'methodName':'CategoryListing',
                     }
                     console.log("param is ",param);
                     this.setState({
                       "isShowHud" : true
                     })
                     ws.callWebservice('CategoryListing',param,'')
                    //  ws.callGlobalWebservice("bardetail",param);
              }
              else
              {
                  alert(Constant.NETWORK_ALERT)
              }
        });
    }

    onWebServiceCallingForSignUp()
    {
         NetInfo.isConnected.fetch().then(isConnected => {
            console.log(isConnected)
            console.log('First, is ' + (isConnected ? 'online' : 'offline'));
             
              if(isConnected)
              {
                     var param = {
                         'UserName': this.state.name,
                         'BusinessName': this.state.businessName,
                         'Address': this.state.address,
                         'Phone': this.state.contact,
                         'UsersTypeId': this.state.userType === 'Vendor' ? 2 : 1,
                         'Password': this.state.password,
                         'Email': this.state.email,
                         'Industry': this.state.userType === 'Vendor' ? this.state.industryIds : '',
                         'City': this.state.city,
                         'AreaName':this.state.areaName,
                         'StateName': this.state.street,
                         'CountryName': this.state.country,
                         'Latitude': this.state.latitude,
                         'Longitude': this.state.longitude,
                        //  'image': null,
                         'image':this.state.photoResponse != null ?  this.state.userImage : null
                     }
                     console.log("param is ",param);
                     this.setState({
                       isShowHud : true
                     })
                     ws.callWebservicewithImage('SignUp',param,'')
                    //  ws.callGlobalWebservice("bardetail",param);
              }
              else 
              {
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
          <Image style = {{
            position:'relative',
            width:'100%',
            resizeMode:'cover',
            height:Constant.DEVICE_HEIGHT - 0,
          }} 
          source={require('Domingo/Src/images/background.png')}
          />
      </View>  
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}>   
        <View style = {{
          height:Constant.DEVICE_HEIGHT - STATUSBAR_HEIGHT,
          flexDirection:'column',
        }}>
        <TouchableWithoutFeedback style={{
                
              }} onPress={this.onClickProfilePic.bind(this)}>
        <View style={{
            height:100,
            width:100,
            position:'absolute',
            backgroundColor:'rgba(0,164,235,1)',
            zIndex:100,
            marginLeft:((Constant.DEVICE_WIDTH-100)/2),
            marginTop:30,
            borderRadius:50,
            overflow:'hidden',
        }}>
        
          <Image style = {{
            position:'relative',
            width:'100%',
            height:'100%',
            resizeMode:'cover',
            // height:Constant.DEVICE_HEIGHT - 0,
            overflow:'hidden',
            borderRadius:50,
          }} 
          source={this.state.userImage == null ? require('Domingo/Src/images/user-icon.png') : this.state.userImage}
          />        
        </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback style={{
                
            }} onPress={this.onClickBack.bind(this)}>
          <Image style={{
              position:'absolute',
              // backgroundColor:'yellow',
              width:30,
              height:30,
              marginTop:20,
              marginLeft:10,
              zIndex:2,
            }}
            source={require('Domingo/Src/images/back.png')}
            resizeMode='center'
            />
        </TouchableWithoutFeedback>
        <View style={{
            flex:325
        }}>
        </View>
        
        <View style={{
            flex:2102,
            alignItems:'center',            
        }}>
          <View style={{
            backgroundColor:'white',
            flex:2102,
            width:'75%',
            borderWidth:2,
            borderColor:'grey',
            borderRadius:10,
            overflow:'hidden'
          }}>
            <View style={{
                flex:240
            }}>
            </View>
            
            {/* userType */}
            <TouchableWithoutFeedback style={{
                flex:100,
                flexDirection:'row',
            }} onPress={this.onClickUserType.bind(this)}>
            <View style={{
                flex:100,
                marginLeft:15,
                marginRight:15,
                borderColor:'grey',
                borderBottomWidth:1,
                flexDirection:'row',
                justifyContent:'center',
                alignItems:'center'
            }}>
              <Text style={{width:'90%'}}>{this.state.userType ? this.state.userType : LS.LString.userTypeText}</Text>
              <Image style={{
                  // backgroundColor:'yellow',
                  flex:1,
                  width:'10%',
                  height:'100%'
                }}
                source={require('Domingo/Src/images/dropdown.png')}
                resizeMode='center'
                />
            </View>
            </TouchableWithoutFeedback>
            
            <View style={{
                flex:76,
            }}>
            </View>

            {/* Business Name */}
            <View style={{
                flex:100,
                marginLeft:15,
                marginRight:15,
                borderColor:'grey',
                borderBottomWidth:1,
                // flexDirection:'row',
                // justifyContent:'center',
                // alignItems:'center'
            }}>
              <TextInput style={{
                // borderBottomColor:'grey',
                // borderBottomWidth:1,
                // marginLeft:10,
                // marginRight:10,
                paddingBottom:Platform.ios === 'ios' ? 0 : 5,
                height:Platform.ios === 'ios' ? 23 : 32, 
                paddingHorizontal:0,
              }}
                placeholder= {LS.LString.businessText}
                allowFontScaling={false}
                ref='bName'   
                keyboardType='default'
                returnKeyType='next'
                placeholderTextColor='rgba(79,90,105,1)'
                underlineColorAndroid='transparent'
                value={this.state.businessName}
                autoCapitalize='none'
                onChangeText={(text) => this.setState({businessName:text})} 
                onSubmitEditing={(event) => this.refs['name'].focus()}  
                // onBlur= {this.onBlurTextInput.bind(this)} 
                />
            </View>
            
            <View style={{
                flex:76,
            }}>
            </View>

            {/* Name */}
            <View style={{
                flex:100,
                marginLeft:15,
                marginRight:15,
                borderColor:'grey',
                borderBottomWidth:1,
                // flexDirection:'row',
                // justifyContent:'center',
                // alignItems:'center'
            }}>
              <TextInput style={{
                // borderBottomColor:'grey',
                // borderBottomWidth:1,
                // marginLeft:10,
                // marginRight:10,
                paddingBottom:Platform.ios === 'ios' ? 0 : 5,
                height:Platform.ios === 'ios' ? 23 : 32,
                paddingHorizontal:0,
              }}
                placeholder= {LS.LString.nameText}
                allowFontScaling={false}
                ref='name'   
                keyboardType='default'
                returnKeyType='next'
                placeholderTextColor='rgba(79,90,105,1)'
                underlineColorAndroid='transparent'
                value={this.state.name}
                autoCapitalize='none'
                onChangeText={(text) => this.setState({name:text})} 
                onSubmitEditing={(event) => this.refs['address'].focus()}  
                // onBlur= {this.onBlurTextInput.bind(this)} 
                />
            </View>
            
            <View style={{
                flex:76,
            }}>
            </View>

            {/* Address */}
            {/* <View style={{
                flex:100,
                marginLeft:15,
                marginRight:15,
                borderColor:'grey',
                borderBottomWidth:1,
            }}>
              <TextInput style={{
                paddingBottom:Platform.ios === 'ios' ? 0 : 5,
                height:Platform.ios === 'ios' ? 23 : 32,
                paddingHorizontal:0,
              }}
                placeholder= {'Address'}
                allowFontScaling={false}
                ref='address'   
                keyboardType='default'
                returnKeyType='next'
                placeholderTextColor='rgba(79,90,105,1)'
                underlineColorAndroid='transparent'
                value={this.state.address}
                autoCapitalize='none'
                onChangeText={(text) => this.setState({address:text})} 
                onSubmitEditing={(event) => this.refs['email'].focus()}  
                // onBlur= {this.onBlurTextInput.bind(this)} 
                />
            </View> */}

            <TouchableWithoutFeedback style={{
                flex:100,
                flexDirection:'row',
            }} onPress={this.onClickAddress.bind(this)}>
            <View style={{
                flex:100,
                marginLeft:15,
                marginRight:15,
                borderColor:'grey',
                borderBottomWidth:1,
                flexDirection:'row',
                justifyContent:'center',
                alignItems:'center',
                overflow:'hidden',
            }}>
              <Text
              numberOfLines={1}  
              style={{width:'90%', alignContent:'center', alignItems:'center', justifyContent:'center'}}>{this.state.address ? this.state.address : LS.LString.addressText}</Text>
              <Image style={{
                  // backgroundColor:'yellow',
                  flex:1,
                  width:'10%',
                  height:'100%'
                }}
                source={require('Domingo/Src/images/map.png')}
                resizeMode='contain'
                />
            </View>
            </TouchableWithoutFeedback>
            
            <View style={{
                flex:76,
            }}>
            </View>
            
            {/* Email */}
            <View style={{
                flex:100,
                marginLeft:15,
                marginRight:15,
                borderColor:'grey',
                borderBottomWidth:1,
            }}>
              <TextInput style={{
                paddingBottom:Platform.ios === 'ios' ? 0 : 5,
                height:Platform.ios === 'ios' ? 23 : 32,
                paddingHorizontal:0,
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
                onSubmitEditing={(event) => this.refs['contact'].focus()}  
                // onBlur= {this.onBlurTextInput.bind(this)} 
                />
            </View>
            
            <View style={{
                flex:76,
            }}>
            </View>

            {/* Industry */}
            {this.state.userType === LS.LString.vendorText ?
            <View style= {{
              flex:176,
            }}>
              <TouchableWithoutFeedback style={{
                flex:100,
                flexDirection:'row',
            }} onPress={this.onClickIndustry.bind(this)}>
            <View style={{
                flex:100,
                marginLeft:15,
                marginRight:15,
                borderColor:'grey',
                borderBottomWidth:1,
                flexDirection:'row',
                justifyContent:'center',
                alignItems:'center'
            }}>
              <Text style={{width:'90%', }} numberOfLines={1}>{this.state.industry ? this.state.industry : LS.LString.industryText}</Text>
              <Image style={{
                  // backgroundColor:'yellow',
                  flex:1,
                  width:'10%',
                  height:'100%'
                }}                
                source={require('Domingo/Src/images/dropdown.png')}
                resizeMode='center'
                />
            </View>
            </TouchableWithoutFeedback>

            <View style={{
              flex:76,
            }}>
            </View>
            </View>
            : undefined }
            

            {/* Contact */}
            <View style={{
                flex:100,
                marginLeft:15,
                marginRight:15,
                borderColor:'grey',
                borderBottomWidth:1,
            }}>
              <TextInput style={{
                paddingBottom:Platform.ios === 'ios' ? 0 : 5,
                height:Platform.ios === 'ios' ? 23 : 32,
                paddingHorizontal:0,
              }}
                placeholder= {LS.LString.contactText}
                allowFontScaling={false}
                ref='contact'   
                keyboardType='number-pad'
                returnKeyType='next'
                placeholderTextColor='rgba(79,90,105,1)'
                underlineColorAndroid='transparent'
                value={this.state.contact}
                autoCapitalize='none'
                secureTextEntry = {false}
                onChangeText={(text) => this.setState({contact:text})} 
                onSubmitEditing={(event) => this.refs['password'].focus()}  
                // onBlur= {this.onBlurTextInput.bind(this)} 
                />
            </View>
            
            <View style={{
                flex:76,
            }}>
            </View>

            {/* Password */}
            <View style={{
                flex:100,
                marginLeft:15,
                marginRight:15,
                borderColor:'grey',
                borderBottomWidth:1,
            }}>
              <TextInput style={{
                paddingBottom:Platform.ios === 'ios' ? 0 : 5,
                height:Platform.ios === 'ios' ? 23 : 32,
                paddingHorizontal:0,
              }}
                placeholder= {LS.LString.passwordText}
                allowFontScaling={false}
                ref='password'   
                keyboardType='default'
                returnKeyType='next'
                placeholderTextColor='rgba(79,90,105,1)'
                underlineColorAndroid='transparent'
                value={this.state.password}
                autoCapitalize='none'
                secureTextEntry = {true}
                onChangeText={(text) => this.setState({password:text})} 
                onSubmitEditing={(event) => this.refs['cPassword'].focus()}  
                // onBlur= {this.onBlurTextInput.bind(this)} 
                />
            </View>
            
            <View style={{
                flex:76,
            }}>
            </View>

            {/* Confirm Password */}
            <View style={{
                flex:100,
                marginLeft:15,
                marginRight:15,
                borderColor:'grey',
                borderBottomWidth:1,
            }}>
              <TextInput style={{
                paddingBottom:Platform.ios === 'ios' ? 0 : 5,
                height:Platform.ios === 'ios' ? 23 : 32,
                paddingHorizontal:0,
              }}
                placeholder= {LS.LString.cPasswordText}
                allowFontScaling={false}
                ref='cPassword'   
                keyboardType='default'
                returnKeyType='done'
                placeholderTextColor='rgba(79,90,105,1)'
                underlineColorAndroid='transparent'
                value={this.state.confirmPassword}
                autoCapitalize='none'
                secureTextEntry = {true}
                onChangeText={(text) => this.setState({confirmPassword:text})} 
                onSubmitEditing={(event) => console.log('Submit clicked')}  
                // onBlur= {this.onBlurTextInput.bind(this)} 
                />
            </View>
            
            <View style={{
                flex:76,
            }}>
            </View>

            <View style={{
                flex:110,
                alignItems:'center'
            }}>
                <TouchableHighlight onPress={this.onClickSignUp.bind(this)} style={{
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
                  {LS.LString.signUpText}
                </Text>
              </TouchableHighlight>
            </View>
            <View style={{
                flex:55
            }}>
            </View>
          </View>
        </View>
        <View style={{
            flex:126
        }}>
        </View>        
        </View>

        <ActionSheet
          ref='imgPickerSheet'
          options={this.state.arrImageOption}
          cancelButtonIndex={CANCEL_INDEX}
          onPress={this.onImageOptionSelection.bind(this)}/>

        <ActionSheet
            ref='userTypeSheet'
            options={this.state.arrUserType}
            cancelButtonIndex={CANCEL_INDEX}
            onPress={this.onUserTypeSelection.bind(this)}/>

        <ActionSheet
          ref='industrySheet'
          options={this.state.arrIndustry}
          cancelButtonIndex={CANCEL_INDEX}
          onPress={this.onIndustrySelection.bind(this)}/>

        

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
    openImagePicker(buttonIndex)
    {
        console.log('open image picker called')
        const options = {
            quality: 0.6,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
            skipBackup: true  
            }
        }

        if(buttonIndex == 0)
        {
            console.log('open 0')
            ImagePicker.launchCamera(options, (response)  => {
                // Same code as in above section!
                console.log('image getting responce is',response)
              
                if (response.didCancel) {
                    console.log('User cancelled photo picker');
                }
                else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                }
                else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                }
                else {
                    
                    console.log("source is",response.uri)
                    // let source =response.uri;
                    // var ext = response.uri.substring(response.uri.lastIndexOf(".")+1);
                    let source = { uri: response.uri };
                  
                    this.setState({
                        userImage:source,      //source,
                        photoResponse:response,
                    });
                    
                }

            });
        }
        else if (buttonIndex == 1)
        {
            console.log('open 1')
            ImagePicker.launchImageLibrary(options, (response)  => {
                // Same code as in above section!
                console.log('image getting responce is',response)
              
                if (response.didCancel) {
                    console.log('User cancelled photo picker');
                }
                else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                }
                else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                }
                else {
                    
                    console.log("source is",response.uri)
                    // let source =response.uri;
                    // var ext = response.uri.substring(response.uri.lastIndexOf(".")+1);
                    let source = { uri: response.uri };
                  
                    this.setState({
                        userImage:source,      //source,
                        photoResponse:response,
                    });
                    
                }

            });
        }
        else{

        }
    }

  onImageOptionSelection(selected) {
    console.log("onImageOptionSelection clicked:=",selected);
    if(selected === 0){
      //Cancel

    } else if (selected === 1) {
      //Camera
      this.porcessCamera()
    }
    else if (selected === 2) {
      //Photo
      this.processGallery()
    }
  }

  porcessCamera() {
    console.log('inside the camera method')
    Permissions.check('camera')
    .then(response => {
            //response is an object mapping type to permission
            console.log('responce of the permission is',response)
            if(response=='undetermined')
            {
                
                    Permissions.request('camera').then(response => {
                        // Returns once the user has chosen to 'allow' or to 'not allow' access
                        // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
                        if(response=='authorized')
                        {
                            console.log('ask authorised')
                                this.openImagePicker(0)
                        }
                    })
              
            }
            else if(response=='authorized')
            {
                console.log('authorised')
                    this.openImagePicker(0)
            }
            else
            {
                console.log('called error part')
                Alert.alert(
                    Constant.APP_NAME,
                    LS.LString.cameraPermissionText,
                    Platform.OS == 'ios' ? 
                    [
                        {text: 'Cancel', onPress: () => console.log('cancel')},
                        {text: 'Okay', onPress: () => {Permissions.openSettings()}}, 
                    ] : [{text: 'Okay', onPress: () => console.log('cancel')}],
                    { cancelable: false }
                )
            }
    })
  }

  processGallery() {
    console.log('inside the photo method')
      Permissions.check('photo')
      .then(response => {
              //response is an object mapping type to permission
              console.log('responce of the permission is',response)
              if(response=='undetermined')
              {  
                Permissions.request('photo').then(response => {
                  // Returns once the user has chosen to 'allow' or to 'not allow' access
                  // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
                  if(response=='authorized')
                  {
                      console.log('ask authorised')
                      this.openImagePicker(1)
                  }
                })
                
              }
              else if(response =='authorized')
              {
                    console.log('authorised')
                    this.openImagePicker(1)
              }
              else
              {
                    console.log('called error part')
                    Alert.alert(
                        Constant.APP_NAME,
                        LS.LString.galleryPermissionText,
                        Platform.OS == 'ios' ? 
                        [
                            {text: 'Cancel', onPress: () => console.log('cancel')},
                            {text: 'Okay', onPress: () => {Permissions.openSettings()}}, 
                        ] : [{text: 'Okay', onPress: () => console.log('cancel')}],
                        { cancelable: false }
                    )
              }
      })
  }

  onClickSignUp() {
    if (this.validateData()) {
      this.onWebServiceCallingForSignUp()
    }
    // return
    // console.log("onClickSignUp clicked");
    // this.props.navigation.pop()
  }
  onClickSignIn() {
    console.log("onClickSignIn clicked");
  }
  onClickUserType() {
    console.log("onClickUserType clicked");
    this.refs['userTypeSheet'].show()
  }
  onClickAddress() {
    console.log("onClickAddress clicked");
    this.props.navigation.navigate('mapScreen')
  }
  onClickIndustry() {
    // console.log("onClickIndustry clicked");
    // this.refs['industrySheet'].show()
    this.props.navigation.navigate('category')
  }
  onClickBack() {
    console.log("onClickBack clicked");
    this.props.navigation.pop()
  }

  onClickProfilePic() {
    console.log("onClickProfilePic clicked");
    this.refs['imgPickerSheet'].show()
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
    } else {
      this.setState({
        industry: this.state.arrIndustry[selected],
        selectedIndexOfCatgeory: selected-1,
      })
    }
  }

  validateData() {

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    let regPassword = /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/ ;
    if (this.state.userType == '') {
      alert(LS.LString.vUserTypeText)
      return false
    }
    else if (this.state.businessName == '') {
      alert(LS.LString.vBNameText)
      return false
    }
    else if (this.state.name == '') {
      alert(LS.LString.vNameText)
      return false
    }
    else if (this.state.userType === 'Vendor' && this.state.address == '') {
      alert(LS.LString.vAddressText)
      return false
    }
    else if (this.state.email == '') {
      alert(LS.LString.vEmailText)
      return false
    }
    else if (reg.test(this.state.email) === false) {
      alert(LS.LString.vvEmailText)
      return false
    }
    else if (this.state.userType === 'Vendor' && this.state.industry == '') {
      alert(LS.LString.vIndustryText)
      return false
    }
    else if (this.state.userType === 'Vendor' && this.state.contact == '') {
      alert(LS.LString.vContactText)
      return false
    }
    else if (this.state.userType === 'Vendor' && this.state.contact.length < 9) {
      alert(LS.LString.vvContactText)
      return false
    }
    else if (this.state.contact.length > 0 && this.state.contact.length < 9) {
      alert(LS.LString.vvContactText)
      return false
    }
    else if (this.state.password == '') {
      alert(LS.LString.vPasswordText)
      return false
    }
    else if (this.state.password.length < 6) {
      alert(LS.LString.vvPasswordText)
      return false
    }
    // else if (regPassword.test(this.state.password) === false) {
    //   alert('Password must be 6 to 16 character long and atleast one special character and digit contains')
    //   return false
    // }
    else if (this.state.confirmPassword == '') {
      alert(LS.LString.vCPassword)
      return false
    }
    else if (this.state.password != this.state.confirmPassword) {
      alert(LS.LString.vPCPText)
      return false
    }
    return true
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 2560,
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
