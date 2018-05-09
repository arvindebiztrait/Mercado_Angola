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
  TouchableWithoutFeedback,
  ListView,
  NetInfo,
  ActivityIndicator,
  Linking,
  Alert,
  AsyncStorage,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constant from 'Domingo/Src/Screens/GeneralClass/Constant';
import Modal from 'react-native-modal';
// import { DEVICE_WIDTH } from './Filter';
import Events from 'react-native-simple-events';
import ws from 'Domingo/Src/Screens/GeneralClass/webservice';
import  Rating from 'react-native-easy-rating'
import LS from 'Domingo/Src/Screens/GeneralClass/LocalizationStrings';
import { NavigationActions } from 'react-navigation';


export const STATUSBAR_HEIGHT  = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

type Props = {};
export default class ProfessionalProfile extends Component<Props> {

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      professionalObj:this.props.navigation.state.params.professionalObj,
      dataSourceGallery:ds,
      dataSourceReview:ds,
      selectedTabIndex:0,
      arrCategory:this.getStaticData(),
      fullDetail:{},
      isShowHud:false,
      userDetail:{},
    };
  }

  componentDidMount() {
    this.getLoginUserDetail()
    Events.on('receiveResponse', 'receiveResponseProfessionalProfile', this.onReceiveResponse.bind(this))
    Events.on('reloadProfessionalData', 'reloadProfessionalDataProfessionalProfile', this.reloadProfessionalData.bind(this))
    this.reloadProfessionalData()
  }

  getLoginUserDetail() {
    AsyncStorage.getItem("USERDETAIL").then((value) => {
      console.log("user signup",value) 
      userDetail = JSON.parse(value)      
        this.setState({
            userDetail:userDetail,
        })
    }).done();
  }

  reloadProfessionalData () {
    this.onWebServiceCallingForGetProfeesionalFullDetail()
  }

  onReceiveResponse (responceData) {

    if (responceData.methodName == 'getFullDetailOfProfessional') {
        console.log('responceData:=',responceData)
        this.setState({isShowHud: false,isDisable:false})

        if (responceData.Status == true) {
          this.setState({
            fullDetail : responceData.Results,
            dataSourceGallery:this.state.dataSourceGallery.cloneWithRows(responceData.Results.UserGalaryObj),
            dataSourceReview:this.state.dataSourceReview.cloneWithRows(responceData.Results.UsersReviewsObj),
          })
        }
        else{
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
                  'ProfessionalID': this.state.professionalObj.ProfessionalId,
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

  getStaticData() {
    var arrData = [{'index':'1', 'title':'Beauty', 'image':'Domingo/Src/images/static_img/Beauty.png'},
    {'index':'2', 'title':'Painter', 'image':'Domingo/Src/images/static_img/Beauty.png'},
    {'index':'3', 'title':'Lawn Care', 'image':'Domingo/Src/images/static_img/Beauty.png'},
    {'index':'4', 'title':'Childcare', 'image':'Domingo/Src/images/static_img/Beauty.png'},
    {'index':'5', 'title':'Construction', 'image':'Domingo/Src/images/static_img/Beauty.png'},
    {'index':'6', 'title':'Household', 'image':'Domingo/Src/images/static_img/Beauty.png'}]
    // this.setState({
    //   dataSource:this.state.dataSource.cloneWithRows(arrData),
    // });
    return arrData
  }

  render() {
    var isShowHud = this.state.isShowHud;
    var imgUrl = this.state.fullDetail.UserImagePath
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}>
          {/* <View style={{
            // backgroundColor:'red',
          }}> */}
            <Image style={{
                position:'relative',
                // backgroundColor:'purple',
                width:'100%',
                height:150,
              }}
              source={require('Domingo/Src/images/wallet-image.png')}
              resizeMethod='resize'
              resizeMode='center'
              />

            <TouchableWithoutFeedback style={{
              }} onPress={this.onBackClick.bind(this)}>
            <Image style={{
                position:'absolute',
                // backgroundColor:'yellow',
                width:40,
                height:40,
                marginTop:20,
                marginLeft:0
              }}
              source={require('Domingo/Src/images/back-white.png')}
              resizeMethod='resize'
              resizeMode='center'
              />
          </TouchableWithoutFeedback>

              <Image style={{
                  position:'absolute',
                  // backgroundColor:'yellow',
                  width:150,
                  height:150,
                  marginTop:75,
                  marginLeft:(Constant.DEVICE_WIDTH-150)/2,
                  zIndex:2,
                  borderRadius:10,
                }}
                // source={require('Domingo/Src/images/profile_detail_default.png')}
                source={{uri: imgUrl}}
                resizeMethod='resize'
                resizeMode='center'
              />
              <TouchableWithoutFeedback onPress={this.onClickCall.bind(this)}>
                <View style={{
                  position:'absolute',
                  // backgroundColor:'red',
                  height:90,
                  width:70,
                  marginTop:200,
                  marginLeft:15,
                  alignItems:'center',
                  zIndex:2,
                }}>
                  <Image style={{
                    height:50,
                    width:50,
                    // backgroundColor:'purple',
                    borderRadius:25,
                    marginTop:10
                  }}
                  source={require('Domingo/Src/images/call.png')}
                  resizeMethod='resize'
                  resizeMode='center'
                  />
                  <Text style={{
                    fontSize:17,
                    color:'rgba(113,114,115,1)',
                    marginTop:5
                }}>{LS.LString.callText}</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={this.onClickReview.bind(this)}>
                <View style={{
                  position:'absolute',
                  // backgroundColor:'red',
                  height:90,
                  width:70,
                  marginTop:200,
                  marginLeft:Constant.DEVICE_WIDTH-70-15,
                  alignItems:'center',
                  zIndex:2,
                }}>
                  <Image style={{
                    height:50,
                    width:50,
                    // backgroundColor:'purple',
                    borderRadius:25,
                    marginTop:10
                  }}
                  source={require('Domingo/Src/images/edit.png')}
                  resizeMethod='resize'
                  resizeMode='center'
                  />
                  <Text style={{
                    fontSize:17,
                    color:'rgba(113,114,115,1)',
                    marginTop:5
                }}>{LS.LString.reviewsText}</Text>
                </View>
              </TouchableWithoutFeedback>
            <View style={{
              // backgroundColor:'green',
              width:'100%',
              height:290,
              alignItems:'center',
              paddingTop:100,
              // borderWidth:1,
              // borderColor:'black'
            }}>
              <Text style={{
                fontSize:22
              }}>{this.state.fullDetail.UserName}</Text>
              <Text style={{
                fontSize:17,
                color:'rgba(113,114,115,1)',
                marginTop:10
              }}>{this.state.fullDetail.BusinessName}</Text>
              <View style={{
                flexDirection:'row',
                marginTop:10,
                justifyContent:'center',
                alignItems:'center',
              }}>
                {/* <Text>* * * * *</Text> */}
                {console.log("Ratings:=",this.state.fullDetail.Rating)}
                {Object.keys(this.state.fullDetail).length ?
                  <Rating
                  style = {{
                    paddingTop:10,
                    paddingBottom:5,
                  }}
                  rating={this.state.fullDetail.Rating}
                  max={5}
                  iconWidth={20}
                  iconHeight={20}
                  iconSelected={require('Domingo/Src/images/star.png')}
                  iconUnselected={require('Domingo/Src/images/blackstar.png')}
                  onRate={(rating) => this.setState({rating: rating})}
                  editable={false}
                  />
                  : undefined }

                <Text> ({this.state.fullDetail.TotalReview} Reviews)</Text>
              </View>
              <View style={{
                flexDirection:'row',
                marginTop:10
              }}>
                <TouchableWithoutFeedback onPress={this.onClickFacebook.bind(this)}>
                  <Image style={{
                    height:40,
                    width:40,
                    // backgroundColor:'red',
                    margin:10,
                    borderRadius:20,
                  }}
                  source={require('Domingo/Src/images/fb.png')}
                  resizeMethod='resize'
                  resizeMode='center'
                  />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={this.onClickGoogle.bind(this)}>
                  <Image style={{
                    height:40,
                    width:40,
                    // backgroundColor:'red',
                    margin:10,
                    borderRadius:20,
                  }}
                  source={require('Domingo/Src/images/google.png')}
                  resizeMethod='resize'
                  resizeMode='center'
                  />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={this.onClickTweeter.bind(this)}>
                <Image style={{
                  height:40,
                  width:40,
                  // backgroundColor:'red',
                  margin:10,
                  borderRadius:20,
                }}
                source={require('Domingo/Src/images/twitter.png')}
                resizeMethod='resize'
                resizeMode='center'
                />
                </TouchableWithoutFeedback>
              </View>
            </View>

            <View style={{
              marginLeft:15,
              marginRight:15,
              // backgroundColor:'red',
              flex:1,
              // width:'100%',
              height:50,
              flexDirection:'row',
              // borderBottomColor:'rgba(113,114,115,0.5)',
              // borderBottomWidth:1
            }}>
              <TouchableWithoutFeedback onPress={this.onClickAboutOption.bind(this)}>
              <View style={{
                alignItems:'center',
                flex:1,
                justifyContent:'center',
                borderBottomColor:'rgba(0,165,235,1)',
                borderBottomWidth: this.state.selectedTabIndex == 0 ? 1 : 0
              }}>
                <Text style={{
                  fontSize:20,
                  color:'rgba(113,114,115,1)',
              }}>{LS.LString.aboutText}</Text>
              </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={this.onClickGalleryOption.bind(this)}>
              <View style={{
                alignItems:'center',
                flex:1,
                justifyContent:'center',
                borderBottomColor:'rgba(0,165,235,1)',
                borderBottomWidth: this.state.selectedTabIndex == 1 ? 1 : 0
              }}>
                <Text style={{
                  fontSize:20,
                  color:'rgba(113,114,115,1)',
              }}>{LS.LString.galleryText}</Text>
              </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={this.onClickReviewsOption.bind(this)}>
              <View style={{
                alignItems:'center',
                flex:1,
                justifyContent:'center',
                borderBottomColor:'rgba(0,165,235,1)',
                borderBottomWidth: this.state.selectedTabIndex == 2 ? 1 : 0
              }}>
                <Text style={{
                  fontSize:20,
                  color:'rgba(113,114,115,1)',
                }}>Reviews</Text>
              </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={{
                height:1,
                width:'100%',
                backgroundColor:'rgba(113,114,115,0.5)'
              }}></View>

            {this.state.selectedTabIndex == 0 ? this.loadAboutView() : (this.state.selectedTabIndex == 1 ? this.loadGalleryView() : (this.state.selectedTabIndex == 2 ? this.loadReviewView() : undefined))}

          {/* </View> */}
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

  loadAboutView() {
    var strDisc = ''
    if(this.state.fullDetail.length) {
      console.log("strDisc:= true",strDisc)
      strDisc = this.state.fullDetail.Discription
    }
    else {
      console.log("strDisc:= false",strDisc)
    }
    return(
      <View>
        <Text style={{
          margin:20,
        }}>
          {/* Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. */}
          {strDisc.length > 0 ? this.state.fullDetail.Discription : LS.LString.noDescriptionText}
        </Text>

        <View style={{
          flexDirection:'row',
          margin:20,
          alignItems:'center',
        }}>
          <Image style={{
                    height:40,
                    width:40,
                    // backgroundColor:'red',
                    // margin:10,
                    // borderRadius:20,
                  }}
            source={require('Domingo/Src/images/location.png')}
            resizeMethod='resize'
            resizeMode='center'
            />
          <Text style={{
            marginLeft:10,
            marginRight:10
          }}>{this.state.fullDetail.Address}</Text>
        </View>
      </View>
    )
  }

  loadGalleryView() {
    return(
      <View>
        {this.state.fullDetail.UserGalaryObj.length == 0 ?
        <Text style={{
          margin:20,
          textAlign:'center',
        }}>
          {LS.LString.noImageText}
        </Text>
        :
        undefined
        }
        <ListView
              // contentContainerStyle={{
              //   flexDirection:'row',
              //   flexWrap: 'wrap',
              //   backgroundColor:'rgba(242,243,245,1)',
              //   paddingBottom:10
              // }}
                dataSource={this.state.dataSourceGallery}
                renderRow={this.renderRowGallery.bind(this)}
                  // renderFooter={this.renderFooter.bind()}
                enableEmptySections={true}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={false}
          />
      </View>
    )
  }

  renderRowGallery(rowdata) {
    console.log("row data inside",rowdata);
    var imgUrl = rowdata.ImagePath;
   return ( <TouchableHighlight underlayColor = {'transparent'} onPress={this.onClickOnGalleryView.bind(this,rowdata)}>
            <View style = {{
              // height:200,
              backgroundColor:'transparent',
              width:((Constant.DEVICE_WIDTH)),
              flexDirection:'column',
              // padding:10,
              // paddingTop:0,
              alignContent:'center',
              alignItems:'center',
              marginBottom:10,
            }}>

              <View style={{
                margin:5,
                backgroundColor:'transparent',
                borderRadius:5,
                // padding:5,
                justifyContent:'center',
                alignItems:'center',
                borderColor:'grey',
                borderWidth:0.5,
              }}>
                   <Image
                     style={{
                       height:Constant.DEVICE_WIDTH - 40,
                       width:Constant.DEVICE_WIDTH - 40,
                      //  backgroundColor:'rgba(0,165,235,1)',
                     }}
                    //  source={rowdata.index%2 == 0 ? require('Domingo/Src/images/static_img/Beauty.png') : require('Domingo/Src/images/static_img/Childcare.png')}
                    //  source={require('Domingo/Src/images/static_img/Childcare.png')}
                    defaultSource={require('Domingo/Src/images/placeholder_home.png')}
                     source={{ uri: imgUrl}}
                     resizeMode='cover'
                     resizeMethod='resize'
                  />
                 {/* <Text style={{
                   fontSize:18,
                   marginTop:10,
                   marginBottom:10
                 }}> {rowdata.CategoryName} </Text> */}
              </View>
            </View>
          </TouchableHighlight>
         );
 }

 onClickOnGalleryView(rowData){
  console.log("onClickOnGalleryView:=",rowData)

}

  loadReviewView() {
    return(
      <View>
        {this.state.fullDetail.UsersReviewsObj.length == 0 ?
        <Text style={{
          margin:20,
          textAlign:'center',
        }}>
          {LS.LString.noReviewText}
        </Text>
        :
        undefined
        }

        {/* <Text style={{
          margin:20,
        }}>
          Review View
        </Text> */}
        <ListView
              // contentContainerStyle={{
              //   flexDirection:'row',
              //   flexWrap: 'wrap',
              //   backgroundColor:'rgba(242,243,245,1)',
              //   paddingBottom:10
              // }}
                dataSource={this.state.dataSourceReview}
                renderRow={this.renderRowReview.bind(this)}
                  // renderFooter={this.renderFooter.bind()}
                enableEmptySections={true}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={false}
          />
      </View>
    )
  }

  renderRowReview(rowdata) {
    console.log("row data inside",rowdata);
    var imgUrl = rowdata.UserImage;
   return ( <TouchableHighlight underlayColor = {'transparent'} onPress={this.onClickOnReviewView.bind(this,rowdata)}>
            <View style = {{
              backgroundColor:'white',
              width:Constant.DEVICE_WIDTH-20,
              flexDirection:'row',
              alignContent:'center',
              alignItems:'center',
              margin:10,
              borderRadius:30,
              borderColor:'grey',
              borderWidth:0.5,
            }}>

              <View style={{
                margin:5,
                justifyContent:'flex-start',
                alignItems:'flex-start',
                width:80,
                // height:80,
                flexDirection:'column',
                height:'100%',
                // paddingTop:10,
                // backgroundColor:'red',
              }}>
                {/* <TouchableHighlight underlayColor = {'transparent'} onPress={this.onClickOnReviewView.bind(this,rowdata)}>           */}
                   <Image
                     style={{
                       height:80,
                       width:80,
                       borderRadius:40,
                       overflow:'hidden',
                       marginTop:5
                     }}
                    //  source={require('Domingo/Src/images/profile_detail_default.png')}
                    defaultSource={require('Domingo/Src/images/placeholder_home.png')}
                     source={{uri: imgUrl}}
                    // resizeMethod='resize'
                    // resizeMode='center'
                  />
                 {/* </TouchableHighlight> */}
              </View>
              <View style={{
                flexDirection:'column',
                width:Constant.DEVICE_WIDTH-80-20-10-10,
              }}>
                <Text style={{
                    fontSize:18,
                    marginTop:10,
                  }}>{rowdata.UserName}</Text>
                  <Text style={{
                    fontSize:14,
                    marginTop:10,
                    color:'rgba(124,125,126,1)'
                  }}>{rowdata.Discription}</Text>
                  <Text style={{
                    fontSize:14,
                    marginTop:5,
                    color:'rgba(124,125,126,1)'
                  }}>{rowdata.RateDate}</Text>
                  <View style={{
                    flexDirection:'row',
                    // justifyContent:'center',
                    alignContent:'center',
                    alignItems:'center',
                  }}>
                  <Rating
                    style = {{
                      paddingTop:10,
                      paddingBottom:10,
                    }}
                    rating={rowdata.Rating}
                    max={5}
                    iconWidth={15}
                    iconHeight={15}
                    iconSelected={require('Domingo/Src/images/star.png')}
                    iconUnselected={require('Domingo/Src/images/blackstar.png')}
                    onRate={(rating) => this.setState({rating: rating})}
                    editable={false}
                    />
                    <Text style={{
                      fontSize:17,
                      paddingLeft:10,
                    }}>({rowdata.Rating}.0)</Text>
                    </View>
              </View>
            </View>
          </TouchableHighlight>
         );
  }

  onClickOnReviewView(rowData){
    console.log("onClickOnReviewView:=",rowData)

  }

  onBackClick() {
    this.props.navigation.pop()
  }

  onClickCall() {

    var callUrl = 'tel:' + this.state.fullDetail.Phone
    console.log('call:=',callUrl)
    Linking.canOpenURL(callUrl).then(supported => {
      if (!supported) {
       console.log('Can\'t handle url: ' + callUrl);
       alert(LS.LString.noCallText)
      } else {
       return Linking.openURL(callUrl);
      }
    }).catch(err => alert(err));
  }

  onClickReview() {
    console.log("onClickReview:=")
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
      this.props.navigation.push('reviewScreen',{fullDetail:this.state.fullDetail})
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

  onClickFacebook() {
    if (this.state.fullDetail.FacebookID.length > 0) {
      // var fbUrl = 'https://www.facebook.com/arvind.ebiztrait'
      var fbUrl = 'https://www.facebook.com/' + this.state.fullDetail.FacebookID
      Linking.canOpenURL(fbUrl).then(supported => {
        if (!supported) {
        console.log('Can\'t handle url: ' + fbUrl);
        alert(LS.LString.noFeatureSupportedText)
        } else {
        return Linking.openURL(fbUrl);
        }
      }).catch(err => alert(err));
    }
    else {
      alert(LS.LString.notSetUrlText)
    }
  }

  onClickGoogle() {
    if (this.state.fullDetail.GoogleID.length > 0) {
      // var googleUrl = 'https://plus.google.com/u/0/112275090583209099862'
      var googleUrl = 'https://plus.google.com/u/0/' + this.state.fullDetail.GoogleID
      Linking.canOpenURL(googleUrl).then(supported => {
        if (!supported) {
        console.log('Can\'t handle url: ' + googleUrl);
        alert('This featues is not supported by your device')
        } else {
        return Linking.openURL(googleUrl);
        }
      }).catch(err => alert(err));
    }
    else {
      alert(LS.LString.notSetUrlText)
    }
  }

  onClickTweeter() {
    if (this.state.fullDetail.twitterID.length > 0) {
      // var tweeterUrl = 'https://twitter.com/ArvindP23042379'
      var tweeterUrl = 'https://twitter.com/' + this.state.fullDetail.twitterID
      Linking.canOpenURL(tweeterUrl).then(supported => {
        if (!supported) {
        console.log('Can\'t handle url: ' + tweeterUrl);
        alert('This featues is not supported by your device')
        } else {
        return Linking.openURL(tweeterUrl);
        }
      }).catch(err => alert(err));
    }
    else {
      alert(LS.LString.notSetUrlText)
    }
  }

  onClickAboutOption() {
    this.setState({
      selectedTabIndex:0,
    })
  }

  onClickGalleryOption() {
    this.setState({
      selectedTabIndex:1,
    })
  }

  onClickReviewsOption() {
    this.setState({
      selectedTabIndex:2,
    })
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
