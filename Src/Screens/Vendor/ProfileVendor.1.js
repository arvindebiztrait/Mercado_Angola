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
import Events from 'react-native-simple-events';
import ws from 'Domingo/Src/Screens/GeneralClass/webservice'; 
import EventEmitter from "react-native-eventemitter";
import ImagePicker from 'react-native-image-picker';
import Permissions from 'react-native-permissions';
import LS from 'Domingo/Src/Screens/GeneralClass/LocalizationStrings';

export const STATUSBAR_HEIGHT  = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 0

const countryTitle = 'Select Country'
const deliveryTitle = 'Select Deliveryarea'

type Props = {};
export default class ProfileVendor extends Component<Props> {

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
        dataSource:ds,
        userType:'',
        businessName:'',
        description:'',
        facebookLink:'',
        tweeterLink:'',
        googleLink:'',
        email:'',
        industry:'',
        contact:'',
        password:'',
        confirmPassword:'',
        oldPassword:'',
        arrIndustry:['Cancel','A','B','C'],
        arrCategory:[],
        arrImages:this.getStaticData(),
        isChangePassword:false,

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
        selectedIndexOfCatgeory:-1,
        isEditable:false,
        isForUpload:false,
        removeImageData:{},
    };
  }

  componentDidMount() {
    this.setState({
        dataSource:this.state.dataSource.cloneWithRows(this.getStaticData()),
    });

    this.setObserverForResponse()
    Events.on('setObserverForProfileUpdate', 'setObserverForProfileUpdateVendor', this.setObserverForResponse.bind(this))

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

      this.onWebServiceCallingForCategoryList()
      AsyncStorage.getItem("USERDETAIL").then((value1) => {
      console.log("user signup",value1) 
      userDetail = JSON.parse(value1)
      
      this.setState({                            
          userDetail:userDetail,
      }) 
        this.onWebServiceCallingForGetProfeesionalFullDetail()
      }).done();
  }

  componentWillUnmount() {
    console.log("componentWillUnmount:")
  }

  setObserverForResponse() {
    Events.remove('receiveResponse', 'receiveResponseProfileVendor')
    Events.on('receiveResponse', 'receiveResponseProfileVendor', this.onReceiveResponse.bind(this))
  }

  onReceiveResponse (responceData) { 
       
    if (responceData.methodName == 'getFullDetailOfProfessional') {
        console.log('responceData:=',responceData)
        this.setState({isShowHud: false,isDisable:false})
        
        if (responceData.Status == true) {
          this.getSelectedIndustry(responceData.Results.CategoryDataObj)
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
            businessName:responceData.Results.BusinessName,
            description:responceData.Results.Discription,
            facebookLink:responceData.Results.FacebookID,
            googleLink:responceData.Results.GoogleID,
            tweeterLink:responceData.Results.twitterID,
            contact:responceData.Results.Phone,
            email:responceData.Results.Email,
          })
          if ("UserGalaryObj" in responceData.Results) {
            var arrGalImage = responceData.Results.UserGalaryObj
            var newGalImg = [{'ImageIndex':'0', source : { uri: 'Domingo/Src/images/upload.png' }}]
            for (i = 0; i < arrGalImage.length; i++) {
              var obj = arrGalImage[i]
              obj['ImageIndex'] = i+1
              newGalImg.push(obj)
            }
            console.log("newGalImg:=",newGalImg)
            this.setState({
              arrImages:newGalImg,
              dataSource:this.state.dataSource.cloneWithRows(newGalImg),
            })
          }
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
    else if (responceData.methodName == 'CategoryListing') {
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
        }
        this.setState({
          arrIndustry : arrCatTitle,
          arrCategory : arrCategory,
        })
        console.log('responceData:=',arrCatTitle)
      }
      else{
        alert(responceData.ErrorMessage)
        
      }
    }
    else if (responceData.methodName == 'ChangePassword') {
      console.log('responceData:=',responceData)
      
      if (responceData.Status == true) {  
        this.setState({isShowHud: false,isDisable:false,isChangePassword:false})      
        // alert(responceData.Results.Message)
        this.ShowAlertWithDelay(responceData.Results.Message)
      }
      else {
        this.setState({isShowHud: false,isDisable:false})
        alert(responceData.ErrorMessage)
      }
    }
    else if (responceData.methodName == 'UploadVendor') {
      console.log('responceData:=',responceData)
      this.setState({isShowHud: false,isDisable:false})
      if (responceData.Status == true) {  
        this.updateImageArrayAfterUploaded(responceData.Results.Data)
      }
      else {
        alert(responceData.ErrorMessage)
      }
    }
    else if (responceData.methodName == 'RemoveVendorImage') {
      console.log('responceData:=',responceData)
      this.setState({isShowHud: false,isDisable:false})
      if (responceData.Status == true) {  
        this.removeImageFromLocalArray(this.state.removeImageData)
      }
      else {
        alert(responceData.ErrorMessage)
      }
    }
  }

  getSelectedIndustry(arrSelectedCat) {
    console.log("Selected category:=",arrSelectedCat[0]);
    // if (arrSelectedCat.length() > 0) {
      let obj = arrSelectedCat[0]
      for (i=0;i<this.state.arrCategory.length;i++) {
        if (obj.CategoryID === this.state.arrCategory[i].CategoryID) {
          this.setState({
            selectedIndexOfCatgeory:i,
            industry:obj.CategoryName
          })
        }
      }
    // }
  }

  ShowAlertWithDelay=(strMessage)=>{
 
    setTimeout(function(){
 
      //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
      alert(strMessage)
 
    }, 1000);
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

  onWebServiceCallingForCategoryList() {
        NetInfo.isConnected.fetch().then(isConnected => {
          console.log(isConnected)
          console.log('First, is ' + (isConnected ? 'online' : 'offline'));
            
            if(isConnected)
            {
                    var param = {
                        'Page_Number':1,
                        'Page_Size':100,
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

  onWebServiceCallingForUpdatePassword() {
        NetInfo.isConnected.fetch().then(isConnected => {
          console.log(isConnected)
          console.log('First, is ' + (isConnected ? 'online' : 'offline'));
            
            if(isConnected)
            {
                    var param = {
                      'UserId':this.state.userDetail.UserID,
                      'OldPassword':this.state.oldPassword,
                      'NewPassword':this.state.password,
                    }
                    console.log("param is ",param);
                    this.setState({
                      "isShowHud" : true
                    })
                    ws.callWebservice('ChangePassword',param,'')
                  //  ws.callGlobalWebservice("bardetail",param);
            }
            else
            {
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
          // 'UserName': this.state.name,
          // 'Address':this.state.address,
          // 'Password':this.state.password,
          // 'City': this.state.city,
          // 'AreaName':this.state.areaName,
          // 'StateName': this.state.street,
          // 'CountryName': this.state.country,
          // 'Latitude': this.state.latitude,
          // 'Longitude': this.state.longitude,
          'image':this.state.photoResponse != null ?  this.state.userImage : null,
          'BusinessName':this.state.businessName,
          'Industry':this.state.arrCategory[this.state.selectedIndexOfCatgeory].CategoryID,
          'Discription':this.state.description,
          'FacebookID':this.state.facebookLink,
          'GoogleID':this.state.googleLink,
          'twitterID':this.state.tweeterLink,
          'Phone':this.state.contact,
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

  onWebserviceCallingForUploadImage(imgIndex, source) {
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log(isConnected)
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));
        
      if(isConnected) {
        var param = {
          'UserId': this.state.userDetail.UserID,
          'image':source,
          'ImageIndex':imgIndex,          
        }
        console.log("param is ",param);
        this.setState({
          isShowHud : true
        })
        ws.callWebservicewithImage('UploadVendor',param,'')
      }
      else {
        alert(Constant.NETWORK_ALERT)
      }
    });
  }

  onWebServiceCallingForRemoveImage(data) {
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log(isConnected)
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));
        
      if(isConnected) {
        var param = {
            'ImageId': data.Id,
        }
        console.log("param is ",param);
        this.setState({
          isShowHud : true,
          removeImageData: data
        })
        ws.callWebservice('RemoveVendorImage',param,'')
        //  ws.callGlobalWebservice("bardetail",param);
      }
      else {
          alert(Constant.NETWORK_ALERT)
      }
    });
  }

  getStaticData() {
    var arrData = [{'ImageIndex':'0', source : { uri: 'Domingo/Src/images/upload.png' }}]
    return arrData
  }

  updateImageArrayAfterUploaded (data) {
    console.log('Uploaded Data:=',data)
    var arrImg = this.state.arrImages
    console.log('Before Upload:=',arrImg)
    for (i = 0 ;i < arrImg.length; i++) {
      if (arrImg[i].ImageIndex == data.ImageIndex) {
        var obj = arrImg[i]
        obj['Id'] = data['Id']
        obj['ImagePath'] = data['ImagePath']
        obj['Discription'] = data['Discription']
        arrImg[i] = obj
      }
    }
    this.setState({
      arrImages:arrImg
    })
    console.log('After Upload:=',arrImg)
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
                marginLeft:10
              }}
              source={require('Domingo/Src/images/menu.png')}
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
      {/* Content View */}
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}>   
        <View style = {{
          // height:Constant.DEVICE_HEIGHT - STATUSBAR_HEIGHT,
          height:850,
          flexDirection:'column',
          flex:2186,
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
                overflow:'hidden'
            }}>
              <Image style = {{
                position:'relative',
                width:'100%',
                height:'100%',
                resizeMode:'cover',
                // height:Constant.DEVICE_HEIGHT - 0,
              }} 
              // source={require('Domingo/Src/images/user-icon.png')}
              source={this.state.userImage == null ? (imgProfilePicUrl.length > 0 ? {uri: imgProfilePicUrl} : require('Domingo/Src/images/user-icon.png')) : this.state.userImage}
              />
            </View>
        </TouchableWithoutFeedback>
        {/* <TouchableWithoutFeedback style={{
                
            }} onPress={this.onClickUserType.bind(this)}>
          <Image style={{
              position:'absolute',
              backgroundColor:'yellow',
              width:40,
              height:40,
              marginTop:20,
              marginLeft:10
            }}>
          </Image>
        </TouchableWithoutFeedback> */}
        <View style={{
            flex:300,
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
            borderWidth:1,
            borderColor:'rgba(198,199,201,1)',
            borderRadius:10,
            overflow:'hidden'
          }}>
            <View style={{
                flex:240
            }}>
            </View>

            {/* Business Name */}
            <View pointerEvents={this.state.isEditable ? 'auto' : 'none'} style={{
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
                // paddingTop:0
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
                onSubmitEditing={(event) => this.onClickIndustry()}  
                // onBlur= {this.onBlurTextInput.bind(this)} 
                />
            </View>
            
            <View style={{
                flex:76,
            }}>
            </View>

            {/* Industry */}
            <TouchableWithoutFeedback style={{
                flex:100,
                flexDirection:'row',
            }} onPress={this.onClickIndustry.bind(this)}>
            <View pointerEvents={this.state.isEditable ? 'auto' : 'none'} style={{
                flex:100,
                marginLeft:15,
                marginRight:15,
                borderColor:'grey',
                borderBottomWidth:1,
                flexDirection:'row',
                justifyContent:'center',
                alignItems:'center'
            }}>
              <Text style={{width:'90%'}}>{this.state.industry ? this.state.industry : LS.LString.industryPlaceHolderText}</Text>
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

            {/* Description */}
            <View pointerEvents={this.state.isEditable ? 'auto' : 'none'} style={{
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
                placeholder= {LS.LString.descText}
                allowFontScaling={false}
                ref='description'   
                keyboardType='default'
                returnKeyType='next'
                placeholderTextColor='rgba(79,90,105,1)'
                underlineColorAndroid='transparent'
                value={this.state.description}
                autoCapitalize='none'
                onChangeText={(text) => this.setState({description:text})} 
                onSubmitEditing={(event) => this.refs['facebook'].focus()}  
                // onBlur= {this.onBlurTextInput.bind(this)} 
                />
            </View>
            
            <View style={{
                flex:76,
            }}>
            </View>

            {/* Facebook Link */}
            <View pointerEvents={this.state.isEditable ? 'auto' : 'none'} style={{
                flex:100,
                marginLeft:15,
                marginRight:15,
                borderColor:'grey',
                borderBottomWidth:1,
                flexDirection:'row',
            }}>
              <TextInput style={{
                paddingBottom:Platform.ios === 'ios' ? 0 : 5,
                height:Platform.ios === 'ios' ? 23 : 32,
                width:'85%',
                paddingHorizontal:0,
              }}
                placeholder= {LS.LString.fLinkText}
                allowFontScaling={false}
                ref='facebook'   
                keyboardType='default'
                returnKeyType='next'
                placeholderTextColor='rgba(79,90,105,1)'
                underlineColorAndroid='transparent'
                value={this.state.facebookLink}
                autoCapitalize='none'
                onChangeText={(text) => this.setState({facebookLink:text})} 
                onSubmitEditing={(event) => this.refs['tweeter'].focus()}  
                // onBlur= {this.onBlurTextInput.bind(this)} 
                />

                <Image style={{
                  // backgroundColor:'yellow',
                  // flex:1,
                  width:30,
                  height:30,
                  marginLeft:5,
                  borderRadius:15,
                }}
                source={require('Domingo/Src/images/fb-vender.png')}
                resizeMode='contain'
                />
            </View>
            
            <View style={{
                flex:76,
            }}>
            </View>

            {/* Tweeter Link */}
            <View pointerEvents={this.state.isEditable ? 'auto' : 'none'} style={{
                flex:100,
                marginLeft:15,
                marginRight:15,
                borderColor:'grey',
                borderBottomWidth:1,
                flexDirection:'row',
            }}>
              <TextInput style={{
                paddingBottom:Platform.ios === 'ios' ? 0 : 5,
                height:Platform.ios === 'ios' ? 23 : 32,
                width:'85%',
                paddingHorizontal:0,
              }}
                placeholder= {LS.LString.tLinkText}
                allowFontScaling={false}
                ref='tweeter'   
                keyboardType='default'
                returnKeyType='next'
                placeholderTextColor='rgba(79,90,105,1)'
                underlineColorAndroid='transparent'
                value={this.state.tweeterLink}
                autoCapitalize='none'
                onChangeText={(text) => this.setState({tweeterLink:text})} 
                onSubmitEditing={(event) => this.refs['google'].focus()}  
                // onBlur= {this.onBlurTextInput.bind(this)} 
                />

                <Image style={{
                    // backgroundColor:'yellow',
                    // flex:1,
                    width:30,
                    height:30,
                    marginLeft:5,
                    borderRadius:15,
                  }}
                  source={require('Domingo/Src/images/twitter-vendor.png')}
                  resizeMode='contain'
                />
            </View>
            
            <View style={{
                flex:76,
            }}>
            </View>

            {/* Google Link */}
            <View pointerEvents={this.state.isEditable ? 'auto' : 'none'} style={{
                flex:100,
                marginLeft:15,
                marginRight:15,
                borderColor:'grey',
                borderBottomWidth:1,
                flexDirection:'row',
            }}>
              <TextInput style={{
                paddingBottom:Platform.ios === 'ios' ? 0 : 5,
                height:Platform.ios === 'ios' ? 23 : 32,
                width:'85%',
                paddingHorizontal:0,
              }}
                placeholder= {LS.LString.gLinkText}
                allowFontScaling={false}
                ref='google'   
                keyboardType='default'
                returnKeyType='next'
                placeholderTextColor='rgba(79,90,105,1)'
                underlineColorAndroid='transparent'
                value={this.state.googleLink}
                autoCapitalize='none'
                onChangeText={(text) => this.setState({googleLink:text})} 
                onSubmitEditing={(event) => this.refs['contact'].focus()}  
                // onBlur= {this.onBlurTextInput.bind(this)} 
                />

                <Image style={{
                  // backgroundColor:'yellow',
                  // flex:1,
                  width:30,
                  height:30,
                  marginLeft:5,
                  borderRadius:15,
                }}
                source={require('Domingo/Src/images/google-vendor.png')}
                resizeMode='contain'
                />
            </View>
            
            <View style={{
                flex:76,
            }}>
            </View>

            {/* Contact */}
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
              }}
                placeholder= {LS.LString.pNumberText}
                allowFontScaling={false}
                ref='contact'   
                keyboardType='number-pad'
                returnKeyType='next'
                placeholderTextColor='rgba(79,90,105,1)'
                underlineColorAndroid='transparent'
                value={this.state.contact}
                autoCapitalize='none'
                // secureTextEntry = {true}
                onChangeText={(text) => this.setState({contact:text})} 
                onSubmitEditing={(event) => this.refs['email'].focus()}  
                // onBlur= {this.onBlurTextInput.bind(this)} 
                />
            </View>
            
            <View style={{
                flex:76,
            }}>
            </View>
            
            {/* Email */}
            <View pointerEvents={'none'} style={{
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
                returnKeyType='done'
                placeholderTextColor='rgba(79,90,105,1)'
                underlineColorAndroid='transparent'
                value={this.state.email}
                autoCapitalize='none'
                onChangeText={(text) => this.setState({email:text})} 
                onSubmitEditing={(event) => console.log('email done')}  
                // onBlur= {this.onBlurTextInput.bind(this)} 
                />
            </View>
            
            <View style={{
                flex:76,
            }}>
            </View>

            {/* Images */}

            <View pointerEvents={this.state.isEditable ? 'auto' : 'none'} style={{
                // flex:220,
                // backgroundColor:'red',
                height:80,
                marginLeft:15,
                marginRight:15,
            }}>
              {this.loadImages()}
            </View>

            <View style={{
                flex:76,
            }}>
            </View>
            <View pointerEvents={this.state.isEditable ? 'auto' : 'none'} style={{
                flex:76,
                justifyContent:'center',
                alignItems:'center',
              }}>
              <TouchableWithoutFeedback onPress={this.onClickChangePassword.bind(this)} style={{
                    // backgroundColor:'red',
                  }}>
                <View style={{
                    // flex:76,
                    // backgroundColor:'red',
                    justifyContent:'center',
                    alignItems:'center',
                    width:'70%',
                    // padding:5,
                    height:30,
                }}>
                  <Text style={{
                    color:'rgba(0,165,235,1)',
                    // backgroundColor:'red',
                    // padding:5,
                  }}>
                    {LS.LString.chPasswordText} ?
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>

            <View style={{
                flex:76,
            }}>
            </View>

            <View style={{
                flex:110,
                alignItems:'center'
            }}>
                <TouchableHighlight onPress={this.onClickSave.bind(this)} style={{
                  backgroundColor:'rgba(0,164,235,1)',
                  flex:110,
                  width:'60%',
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
                flex:80
            }}>
            </View>
          </View>
        </View>
        <View style={{
            flex:126
        }}>
        
        </View>        
        {this.loadChangePasswordView()}
        </View>
        <ActionSheet
          ref='industrySheet'
          options={this.state.arrIndustry}
          cancelButtonIndex={CANCEL_INDEX}
          onPress={this.onIndustrySelection.bind(this)}/>      

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

  loadImages() {
    return(
      <ListView
              contentContainerStyle={{
                flexDirection:'row',
                flexWrap: 'wrap',
                // backgroundColor:'rgba(242,243,245,1)',
                paddingBottom: Platform.OS === 'ios' ? 10 :0
              }}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                  // renderFooter={this.renderFooter.bind()}
                enableEmptySections={true}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={false}
                // showsHorizontalScrollIndicator={false}
                horizontal={true}
          />
    )
  }

  loadChangePasswordView() {
    return(
    <Modal isVisible={this.state.isChangePassword}>
          <View style={{alignItems : 'center', padding:10, backgroundColor: '#fff', height:Platform.OS === 'ios' ? 300 : 320, borderRadius:10}}>
            <Text style={{fontSize:20}}> Change Password </Text>
            <View style ={[{borderColor:'#fbcdc5',flexDirection:'row',borderColor:'grey',
                borderBottomWidth:1, marginTop: Platform.OS === 'ios' ? 30 : 20, marginLeft:5, marginRight:5}]}>
              {/* <Image style={{
                backgroundColor:'yellow',
                height:35,
                width:'15%',
                marginBottom:5
              }}></Image> */}
              <TextInput
                style={{left:0, width:'85%', paddingBottom:10, marginTop: Platform.OS === 'ios' ? 15 : 5,paddingHorizontal:0,paddingVertical:0}}
                // onBlur={ () => this.onBlurUser() }
                value={this.state.for}
                underlineColorAndroid = 'transparent'
                autoCorrect={false}
                keyboardType={'default'}
                placeholder={LS.LString.oldPasswordText}
                maxLength={140}
                onSubmitEditing={() => {
                  this.refs['password'].focus()
                }}
                secureTextEntry={true}
                returnKeyType={ "done" }
                ref='oldPassword'
                onChangeText={(text) => this.setState({oldPassword:text})}
              />
            </View>

            <View style ={[{borderColor:'#fbcdc5',flexDirection:'row',borderColor:'grey',
                borderBottomWidth:1, marginTop:15, marginLeft:5, marginRight:5}]}>
              {/* <Image style={{
                backgroundColor:'yellow',
                height:35,
                width:'15%',
                marginBottom:5
              }}></Image> */}
              <TextInput
                style={{left:0, width:'85%', paddingBottom:10, marginTop: Platform.OS === 'ios' ? 15 : 5,paddingHorizontal:0,paddingVertical:0}}
                // onBlur={ () => this.onBlurUser() }
                value={this.state.for}
                underlineColorAndroid = 'transparent'
                autoCorrect={false}
                keyboardType={'default'}
                placeholder={LS.LString.newPasswordText}
                maxLength={140}
                onSubmitEditing={() => {
                  console.log('Submit')
                  this.refs['cPassword'].focus()
                }}
                secureTextEntry={true}
                returnKeyType={ "done" }
                ref='password'
                onChangeText={(text) => this.setState({password:text})}
              />
            </View>

            <View style ={[{borderColor:'#fbcdc5',flexDirection:'row',borderColor:'grey',
                borderBottomWidth:1, marginTop:15, marginLeft:5, marginRight:5}]}>
              {/* <Image style={{
                backgroundColor:'yellow',
                height:35,
                width:'15%',
                marginBottom:5
              }}></Image> */}
              <TextInput
                style={[{left:0, width:'85%', paddingBottom:10, marginTop:Platform.OS === 'ios' ? 15 : 5,paddingHorizontal:0,paddingVertical:0}]}
                // onBlur={ () => this.onBlurUser() }
                value={this.state.for}
                underlineColorAndroid = 'transparent'
                autoCorrect={false}
                keyboardType={'default'}
                placeholder={LS.LString.confirmNewPassText}
                maxLength={140}
                onSubmitEditing={() => {
                  console.log('Submit')
                }}
                secureTextEntry={true}
                returnKeyType={ "done" }
                ref='cPassword'
                onChangeText={(text) => this.setState({confirmPassword:text})}
              />
            </View>

            <View style={{flexDirection: 'row', height: 40, justifyContent:'center', alignItems:'center', marginTop:25}}>
            <TouchableOpacity
              onPress={()=> this.setState({ isChangePassword:  false})}
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
            <TouchableOpacity
              onPress={()=> this.onClickSubmitChangePaasword()}
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
	    </Modal>
      )
  }

  renderRow(rowdata) {
    console.log("row data inside",rowdata);
    var imgUrl = "ImagePath" in rowdata ? rowdata.ImagePath : ''
   return ( <TouchableHighlight underlayColor = {'transparent'} onPress={this.onClickOnListView.bind(this,rowdata)}>
            <View style = {{
              backgroundColor:'transparent',
              flexDirection:'column',
              height:80,
              width:80,
              overflow:'hidden',
            }}>

              <View style={{
                margin:5, 
                // backgroundColor:'green',
                borderRadius:5,
                // padding:10,
                justifyContent:'center',
                alignItems:'center',
                // flex:210,
                height:70,
                width:70,
                overflow:'hidden',
                // borderColor:'grey',
              // borderWidth:0.5,
              }}>               
                   <Image
                     style={{
                       height:'100%',
                       width:'100%',
                      //  backgroundColor:'rgba(0,165,235,1)',
                     }}
                    //  source={ rowdata.ImageIndex == 0 ? rowdata.source : (rowdata.index%2 == 0 ? require('Domingo/Src/images/static_img/Beauty.png') : require('Domingo/Src/images/static_img/Childcare.png'))}
                    defaultSource={require('Domingo/Src/images/placeholder_home.png')}
                    source={ rowdata.ImageIndex == 0 ? require('Domingo/Src/images/upload.png') : imgUrl.length > 0 ? { uri: imgUrl} : rowdata.source}
                    />
              </View>

              {rowdata.ImageIndex > 0 && 'ImagePath' in rowdata ? <TouchableWithoutFeedback underlayColor = {'transparent'} onPress={this.onClickRemoveImage.bind(this,rowdata)}>
                <View style={{
                    position:'absolute',
                    height:30,
                    width:30,
                    // backgroundColor:'yellow',
                    marginLeft:50,
                    zIndex:2,
                    alignItems:'flex-end',
                  }}>
                      <Image
                        style={{
                          height:20,
                          width:20,
                          // backgroundColor:'rgba(0,165,235,1)',
                          borderRadius:10,
                        }}
                        source={require('Domingo/Src/images/close-red.png')}
                        resizeMode='contain'
                      />
                  </View>
                </TouchableWithoutFeedback> :
                null
              }
              
            </View>
          </TouchableHighlight>
         );
 }

onClickOnListView(rowData){
  console.log("onClickOnListView:=",rowData)
  if (rowData.ImageIndex == 0) {
    this.state.isForUpload = true
    this.refs['imgPickerSheet'].show()
  }
}

onClickRemoveImage(rowData) {
  console.log("onClickRemoveImage:=",rowData)
  if ("Id" in rowData) {
    this.onWebServiceCallingForRemoveImage(rowData)
  }
  else {
    this.removeImageFromLocalArray(rowData)
  }
}

removeImageFromLocalArray(rowData) {
  var arrImg = this.state.arrImages
  console.log('Before Upload:=',arrImg)
  var removeIndex = -1
  for (i = 0 ;i < arrImg.length; i++) {
    if (arrImg[i].ImageIndex == rowData.ImageIndex) {
      removeIndex = i
      break
    }
  }
  if (removeIndex != -1) {
    // this.setState({
      arrImg = arrImg.filter((_, i) => i !== removeIndex)
    // });
    this.setState({
      arrImages:arrImg,
      dataSource:this.state.dataSource.cloneWithRows(arrImg),
    })
    console.log(true)
  }
  else {
    console.log(false)
  }
  console.log('After Upload:=',arrImg)
}

  onClickSubmitChangePaasword() {
    let regPassword = /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/ ;
    if (this.state.oldPassword == '') {
      alert(LS.LString.vOldPassText)
    }
    else if (this.state.password == '') {
      alert(LS.LString.vPasswordText)
    }
    else if (this.state.password.length < 6) {
      alert(LS.LString.vvPasswordText)
      return false
    }
    // else if (regPassword.test(this.state.password) === false) {
    //   alert('Password must be 6 to 16 character long and atleast one special character and digit contains')
    //   return false
    // }
    else if (this.state.cPassword == '') {
      alert(LS.LString.vCPassword)
    }
    else if (this.state.password != this.state.confirmPassword) {
      alert(LS.LString.vPCPText)
    }
    else {
      this.onWebServiceCallingForUpdatePassword()
    }
  }

  onClickMenu() {
    console.log("onClickMenu clicked")
    this.props.navigation.navigate('DrawerOpen')
  }

  onClickChangePassword() {
    console.log("onClickChangePassword clicked")
    this.setState({
      isChangePassword:true,
    })
  }

  onClickEdit() {
    console.log("onClickEdit clicked")
    this.setState({
      isEditable:!this.state.isEditable
    })
  }

  onClickSave() {
    console.log("onClickSignUp clicked");

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

  onClickSignIn() {
    console.log("onClickSignIn clicked");
  }

  onClickUserType() {
    console.log("onClickUserType clicked");
    this.refs['userTypeSheet'].show()
  }

  onClickIndustry() {
    console.log("onClickIndustry clicked");
    this.refs['industrySheet'].show()
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
        industry: this.state.arrIndustry[selected],
        selectedIndexOfCatgeory: selected-1
      })
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

  onClickProfilePic() {
    console.log("onClickProfilePic clicked");
    this.state.isForUpload = false
    this.refs['imgPickerSheet'].show()
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

                    if (this.state.isForUpload == true) {
                      var imgIndex = this.state.arrImages.length
                      var source = { uri: response.uri }
                      var obj = {
                        'ImageIndex': imgIndex,
                        'source':source,                        
                      }
                      var arrImg = this.state.arrImages;
                      arrImg.push(obj)
                      this.setState({
                        arrImages:arrImg,
                        dataSource:this.state.dataSource.cloneWithRows(arrImg),
                      })
                      this.onWebserviceCallingForUploadImage(imgIndex,source)
                      console.log("this.state.arrImages:",this.state.arrImages)
                    }
                    else {
                      // let source =response.uri;
                      // var ext = response.uri.substring(response.uri.lastIndexOf(".")+1);
                      let source = { uri: response.uri };
                    
                      this.setState({
                          userImage:source,      //source,
                          photoResponse:response,
                      });
                  }
                    
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
                    if (this.state.isForUpload == true) {
                      var imgIndex = this.state.arrImages.length
                      var source = { uri: response.uri }
                      var obj = {
                        'ImageIndex': imgIndex,
                        'source':source,                        
                      }
                      var arrImg = this.state.arrImages;
                      arrImg.push(obj)
                      this.setState({
                        arrImages:arrImg,
                        dataSource:this.state.dataSource.cloneWithRows(arrImg),
                      })
                      this.onWebserviceCallingForUploadImage(imgIndex,source)
                      console.log("this.state.arrImages:",this.state.arrImages)
                    }
                    else {
                      // let source =response.uri;
                      // var ext = response.uri.substring(response.uri.lastIndexOf(".")+1);
                      let source = { uri: response.uri };
                      this.setState({
                          userImage:source,      //source,
                          photoResponse:response,
                      });
                    }
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
    if (this.state.businessName == '') {
      alert(LS.LString.vBNameText)
      return false
    }
    else if (this.state.industry == '') {
      alert(LS.LString.vIndustryText)
      return false
    }
    else if (this.state.description == '') {
      alert(LS.LString.vDescriptionText)
      return false
    }
    else if (this.state.contact == '') {
      alert(LS.LString.vContactText)
      return false
    }
    else if (this.state.contact.length < 9) {
      alert(LS.LString.vvContactText)
      return false
    }
    return true
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
  }) ,
  loaderStyle:{
      height:'10%',
      width:'20%',
      position:'absolute',
      left:'40%',
      top:'45%',
      justifyContent:'center',                              
  },
});
