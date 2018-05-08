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
  ActivityIndicator,
  NetInfo,
  AsyncStorage,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constant from 'Domingo/Src/Screens/GeneralClass/Constant';
import Events from 'react-native-simple-events';
import ws from 'Domingo/Src/Screens/GeneralClass/webservice'; 
import EventEmitter from "react-native-eventemitter";
import ImagePicker from 'react-native-image-picker';
import Permissions from 'react-native-permissions';
import ActionSheet from 'react-native-actionsheet';
import LS from 'Domingo/Src/Screens/GeneralClass/LocalizationStrings';

export const STATUSBAR_HEIGHT  = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 0

type Props = {};
export default class Profile extends Component<Props> {

  constructor(props) {
    super(props)
    this.state = {
        name:'',
        address:'',
        password:'',
        confirmPassword:'',
        fullDetail:{},
        isShowHud:false,
        userDetail:{},
        city:'',
        street:'',
        country:'',
        block_no:'',
        zipCode:'',
        areaName:'',
        latitude:'',
        longitude:'',
        userImage:null,
        photoResponse:null,
        arrImageOption:['Cancel','Take Photo','Choose from Library'],
        isEditable:false,
    };
  }

  componentDidMount() {
    console.log("componentDidMount:Profile")
    Events.on('receiveResponse', 'receiveResponseProfile', this.onReceiveResponse.bind(this)) 

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

      AsyncStorage.getItem("USERDETAIL").then((value1) => {
      console.log("user signup",value1) 
      userDetail = JSON.parse(value1)
      
      this.setState({                            
          userDetail:userDetail,
      }) 
        this.onWebServiceCallingForGetProfeesionalFullDetail()
      }).done();

      // var that = this;
      // setTimeout(function() {
          
      // }, 1000);
  }

  onReceiveResponse (responceData) { 
       
    if (responceData.methodName == 'getFullDetailOfProfessional') {
        console.log('responceData:=',responceData)
        this.setState({isShowHud: false,isDisable:false})
        
        if (responceData.Status == true) {
          this.setState({
            fullDetail : responceData.Results,
            name: responceData.Results.UserName,
            address:responceData.Results.Address,
            city:responceData.Results.City,
            street:responceData.Results.StateName,
            country:responceData.Results.CountryName,
            latitude:responceData.Results.Latitude,
            longitude:responceData.Results.Longitude,
            areaName:responceData.Results.AreaName,
          })
        }
        else{
           alert(responceData.ErrorMessage)           
        }
    }
    else if (responceData.methodName == 'UpdateProfile') {
      console.log('responceData:=',responceData)
      this.setState({isShowHud: false,isDisable:false})
      if (responceData.Status == true) {        
        var userData = JSON.stringify(responceData.Results.Data)
        AsyncStorage.setItem('USERDETAIL',userData)
        Events.trigger("updateMenuDetails",'')
        alert(responceData.Results.Message)
      }
      else {
        alert(responceData.ErrorMessage)
      }
    }
  }

  onWebServiceCallingForGetProfeesionalFullDetail() {
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log(isConnected)
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));
        
      if(isConnected) {
            var param = {
                'ProfessionalID': this.state.userDetail.UserID,
            }
            console.log("param is ",param);
            this.setState({
              isShowHud : true
            })
            ws.callWebservice('getFullDetailOfProfessional',param,'')
            //  ws.callGlobalWebservice("bardetail",param);
      }
      else {
          alert(Constant.NETWORK_ALERT)
      }
    });
  }

  onWebserviceCallingForUpdateProfile() {
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log(isConnected)
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));
        
      if(isConnected) {
        var param = {
          'UserID': this.state.userDetail.UserID,
          'UserName': this.state.name,
          'Address':this.state.address,
          'Password':this.state.password,
          'City': this.state.city,
          'AreaName':this.state.areaName,
          'StateName': this.state.street,
          'CountryName': this.state.country,
          'Latitude': this.state.latitude,
          'Longitude': this.state.longitude,
          'image':this.state.photoResponse != null ?  this.state.userImage : null,
          'photoResponse':this.state.photoResponse != null ? this.state.photoResponse : null,
        }
        console.log("param is ",param);
        this.setState({
          isShowHud : true
        })
        ws.callWebservicewithImage('UpdateProfile',param,'')
      }
      else {
        alert(Constant.NETWORK_ALERT)
      }
    });
  }

  render() {
    var isShowHud = this.state.isShowHud;
    var imgProfilePicUrl = ''
    console.log("this.state.fullDetail",this.state.fullDetail)
    if ("UserImagePath" in this.state.fullDetail) {
      imgProfilePicUrl = this.state.fullDetail.UserImagePath
    } 
    console.log('imgProfilePicUrl:=',imgProfilePicUrl)
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
                marginRight:10
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
            }}>{LS.LString.profileCapText}</Text>
          <TouchableWithoutFeedback style={{
                }} onPress={this.onClickEdit.bind(this)}>
            <Image style={{
                position:'relative',
                // backgroundColor:'white',
                width:40,
                height:40,
                marginTop:Platform.OS === 'ios' ? 20 : 0,
                marginRight:10
              }}
            source={require('Domingo/Src/images/edit-icon.png')}
            resizeMethod='resize'
            resizeMode='center'
            />
          </TouchableWithoutFeedback>
        </View>
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}>   
        <View style = {{
          height:Constant.DEVICE_HEIGHT - STATUSBAR_HEIGHT-64,
          flexDirection:'column',
          flex:2360,
        }}>
        <TouchableWithoutFeedback style={{
                
              }} onPress={this.onClickProfilePic.bind(this)}>
        <View pointerEvents={this.state.isEditable ? 'auto' : 'none'} style={{
            height:120,
            width:120,
            position:'absolute',
            backgroundColor:'rgba(0,164,235,1)',
            zIndex:1,
            marginLeft:((Constant.DEVICE_WIDTH-120)/2),
            marginTop:40,
            borderRadius:60,
            overflow:'hidden',
        }}
        pointerEvents={this.state.isEditable ? 'auto' : 'none'}
        >
          <Image style = {{
            position:'relative',
            width:'100%',
            height:'100%',
            resizeMode:'cover',
            // height:Constant.DEVICE_HEIGHT - 0,
            overflow:'hidden',
          }} 
          // source={require('Domingo/Src/images/user-icon.png')}
          source={this.state.userImage == null ? (imgProfilePicUrl.length > 0 ? {uri: imgProfilePicUrl} : require('Domingo/Src/images/user-icon.png')) : this.state.userImage}
          />
        </View>
        </TouchableWithoutFeedback>
        <View style={{
            flex:392
        }}>
        </View>
        
        <View style={{
            flex:1558,
            alignItems:'center',            
        }}>
          <View style={{
            backgroundColor:'white',
            flex:2102,
            width:'75%',
            borderWidth:2,
            borderColor:'rgba(198,199,201,1)',
            borderRadius:10,
            overflow:'hidden',
          }}>
            <View style={{
                flex:320
            }}>
            </View>

            {/* Username */}
            <View pointerEvents={this.state.isEditable ? 'auto' : 'none'} style={{
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
                paddingTop:0
              }}
                placeholder= {'Name'}
                allowFontScaling={false}
                ref='userName'   
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
                flex:126,
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
                paddingTop:0,
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
                onSubmitEditing={(event) => this.refs['password'].focus()}  
                // onBlur= {this.onBlurTextInput.bind(this)} 
                />
            </View> */}

            <TouchableWithoutFeedback style={{
                flex:100,
                flexDirection:'row',
            }} onPress={this.onClickAddress.bind(this)}>
            <View pointerEvents={this.state.isEditable ? 'auto' : 'none'} style={{
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
              style={{width:'90%', alignContent:'center', alignItems:'center', justifyContent:'center'}}>{this.state.address ? this.state.address : 'Address'}</Text>
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
                flex:126,
            }}>
            </View>
            

            {/* Password */}
            <View pointerEvents={this.state.isEditable ? 'auto' : 'none'} style={{
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
                paddingTop:0,
              }}
                placeholder= {'Password'}
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
                flex:126,
            }}>
            </View>

            {/* Confirm Password */}
            <View pointerEvents={this.state.isEditable ? 'auto' : 'none'} style={{
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
                paddingTop:0,
                // backgroundColor:'red',
              }}
                placeholder= {'Confirm Password'}
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
                flex:126,
            }}>
            </View>

            <View style={{
                flex:110,
                alignItems:'center'
            }}>
                <TouchableHighlight onPress={this.onClickSave.bind(this)} style={{
                  backgroundColor:'rgba(0,164,235,1)',
                  flex:130,
                  width:'50%',
                  alignItems:'center',
                  justifyContent: 'center',
                  borderRadius:20,
                  opacity: this.state.isEditable ? 1 : 0.5,
                }}>
                <Text style={{
                  color:'white',
                  alignItems:'center',
                  justifyContent:'center',
                  fontSize:15,
                }}>
                  {LS.LString.saveText}
                </Text>
              </TouchableHighlight>
            </View>
            <View style={{
                flex:100
            }}>
            </View>
          </View>
        </View>
        <View style={{
            flex:410
        }}>
        </View>        
        </View>
        <ActionSheet
          ref='imgPickerSheet'
          options={this.state.arrImageOption}
          cancelButtonIndex={CANCEL_INDEX}
          onPress={this.onImageOptionSelection.bind(this)}/>
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

  onClickEdit() {

    // var data = ['date1','date2','date3']
    // var arrNew = {};

		// 			for (i=0;i<data.length;i++) {
		// 				var obj = {
		// 					selected: true, 
		// 					marked: true, 
		// 					selectedColor: 'green'
		// 				};
		// 				let strDate = data[i]

		// 				var objFinal = {
    //           strDate : obj,
    //         };
    //         arrNew[strDate] = obj
		// 				// arrNew.push(objFinal)
    //       }
          
    //       console.log("arrNew:=",arrNew)

    // return

    console.log("onClickEdit clicked")
    this.setState({
      isEditable:!this.state.isEditable
    })
  }

  onClickSave() {
    if (this.state.isEditable == true) {
      console.log("onClickSignUp clicked");
      if (this.validateData()) {
        this.onWebserviceCallingForUpdateProfile()
      }
    }
    else {
      alert(LS.LString.vEditProfileText)
    }
  }

  onClickAddress() {
    console.log("onClickAddress clicked");
    this.props.navigation.navigate('mapScreen')
  }

  onClickProfilePic() {
    console.log("onClickProfilePic clicked");
    this.refs['imgPickerSheet'].show()
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
                    console.log("image response:=",response)
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
                        {text: LS.LString.cancelText, onPress: () => console.log('cancel')},
                        {text: LS.LString.okText, onPress: () => {Permissions.openSettings()}}, 
                    ] : [{text: LS.LString.okText, onPress: () => console.log('cancel')}],
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
                            {text: LS.LString.cancelText, onPress: () => console.log('cancel')},
                            {text: LS.LString.okText, onPress: () => {Permissions.openSettings()}}, 
                        ] : [{text: LS.LString.cancelText, onPress: () => console.log('cancel')}],
                        { cancelable: false }
                    )
              }
      })
  }

  validateData() {
    if (this.state.name.trim() == '') {
      alert(LS.LString.vNameText)
      return false
    }
    else if (this.state.address.trim() == '') {
      alert(LS.LString.vAddressText)
      return false
    }

    if (this.state.password.trim().length > 0) {
      let regPassword = /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/ ;
      if (this.state.password.length < 6) {
        alert(LS.LString.vvPasswordText)
        return false
      }
      else if (regPassword.test(this.state.password) === false) {
        alert(LS.LString.vvFormatPasswordText)
        return false
      }
      else if (this.state.confirmPassword == '') {
        alert(LS.LString.vCPassword)
        return false
      }
      else if (this.state.password != this.state.confirmPassword) {
        alert(LS.LString.vPCPText)
        return false
      }
    }
    return true
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
