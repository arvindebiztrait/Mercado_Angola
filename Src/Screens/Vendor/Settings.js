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
  Dimensions,
  NetInfo,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constant from 'Domingo/Src/Screens/GeneralClass/Constant';
import CheckBox from 'react-native-checkbox';
import Slider from 'react-native-slider';
import { NavigationActions } from 'react-navigation';
import Events from 'react-native-simple-events';
import ws from 'Domingo/Src/Screens/GeneralClass/webservice';
import LS from 'Domingo/Src/Screens/GeneralClass/LocalizationStrings';

export const DEVICE_WIDTH = Dimensions.get('window').width;
export const DEVICE_HEIGHT = Dimensions.get('window').height;

export const STATUSBAR_HEIGHT  = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

type Props = {};
export default class Settings extends Component<Props> {

  constructor(props) {
    super(props)

    // this.state = {
    //   dataSource:ds,
    //   searchText:'',
    //   arrCategory:this.getStaticData(),
    //   distance:0,
    //   minValue:0,
    //   maxValue:100,
    //   isShowHud:false,
    //   userDetail:{},
    // };
    this.state = this.getInitialState();
  }

  getInitialState() {
    var getSectionData = (dataBlob, sectionID) => {
        return dataBlob[sectionID];
    }

    var getRowData = (dataBlob, sectionID, rowID) => {
        return dataBlob[sectionID + ':' + rowID];
    }

    return {
      searchText:'',
      arrCategory:this.getStaticData(),
      distance:0,
      minValue:0,
      maxValue:100,
      isShowHud:false,
      userDetail:{},
        dataSource : new ListView.DataSource({
            getSectionData          : getSectionData,
            getRowData              : getRowData,
            rowHasChanged           : (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged : (s1, s2) => s1 !== s2
        })
    }
}

  componentDidMount() {
    // this.setState({
    //     dataSource:ds.cloneWithRows(this.getStaticData()),
    // });

    Events.remove('receiveResponse', 'receiveResponseProfileVendor')
    Events.remove('receiveResponse', 'receiveResponseFilter')
    Events.on('receiveResponse', 'receiveResponseFilter', this.onReceiveResponse.bind(this))
    this.onWebServiceCallingForCategoryList()

    AsyncStorage.getItem("USERDETAIL").then((value1) => {
      console.log("user USERDETAIL:=",value1)
      userDetail = JSON.parse(value1)
      this.setState({
        distance : userDetail.FromDistanse,
        userDetail : userDetail
      })
    }).done();
  }

  onReceiveResponse (responceData) {

    if (responceData.methodName == 'CategoryListing') {
      console.log('responceData:=',responceData)
      this.setState({isShowHud: false,isDisable:false})

      if (responceData.Status == true) {
        var arrCategory = responceData.Results.Category_List;
        // arrCategory = this.getSelectedIndustry(this.state.userDetail.CategoryDataObj, arrCategory)

        // var orders = responseData.data,
        var length = arrCategory.length,
        dataBlob = {},
        sectionIDs = [],
        rowIDs = [],
        category,
        orderLength,
        i,
        j;

        for (i = 0; i < length; i++) {
          category = arrCategory[i];
          sectionIDs.push(category.CategoryID);

          dataBlob[category.CategoryID] = category.CategoryName;

          orderDetail = category.SubCategoryObj;
          orderLength = orderDetail.length;

          rowIDs[i] = [];

          for(j = 0; j < orderLength; j++) {
              // orderDetail = orderDetail[j];
              rowIDs[i].push(orderDetail[j].CategoryID);
              dataBlob[category.CategoryID + ':' + orderDetail[j].CategoryID] = orderDetail[j];
          }
        }

        console.log("dataBlob:=",dataBlob)
        console.log("rowIDs:=",rowIDs)
        console.log("sectionIDs:=",sectionIDs)

        this.setState({
          arrCategory : arrCategory,
          // dataSource:this.state.dataSource.cloneWithRows(arrCategory),
          dataSource : this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
        })
      }
      else {
          alert(responceData.ErrorMessage)
      }
    }
    else if (responceData.methodName == 'UpdateProfile') {
      console.log('responceData:=',responceData)
      this.setState({isShowHud: false,isDisable:false})
      if (responceData.Status == true) {
        var userData = JSON.stringify(responceData.Results.Data)
        AsyncStorage.setItem('USERDETAIL',userData)
        // alert(responceData.Results.Message)
        Events.trigger('setObserverForProfileUpdate')
        this.props.navigation.pop()
      }
      else {
        alert(responceData.ErrorMessage)
      }
    }
  }

  onWebServiceCallingForCategoryList() {
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log(isConnected)
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));

      if(isConnected) {
            var param = {
                  'Page_Number':1,
                  'Page_Size':50,
                //  'methodName':'CategoryListing',
            }
            console.log("param is ",param);
            this.setState({
              isShowHud : true
            })
            ws.callWebservice('CategoryListing',param,'')
            //  ws.callGlobalWebservice("bardetail",param);
      }
      else {
          alert(Constant.NETWORK_ALERT)
      }
    });
  }

  onWebserviceCallingForUpdateProfile(strIndustry) {
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log(isConnected)
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));

      if(isConnected) {
        var param = {
          'UserID': this.state.userDetail.UserID,
          'Industry': strIndustry,
          'FromDistanse': this.state.distance,
          'image':null,
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

  getSelectedIndustry(arrSelectedCat,arrCategory) {
    console.log("Before Update:=",arrCategory)
      // for (j=0;j<arrSelectedCat.length;j++) {
      //   for (i=0;i<arrCategory.length;i++) {
      //     if (arrSelectedCat[j].CategoryID === arrCategory[i].CategoryID) {
      //       console.log("true")
      //       arrCategory[i].checkStatus = true
      //     }
      //   }
      // }

      for (j=0;j<arrSelectedCat.length;j++) {
        for (i=0;i<arrCategory.length;i++) {
          var subCat = arrCategory[i].SubCategoryObj
          for (k=0;k<subCat.length;k++) {
            if (arrSelectedCat[j].CategoryID === subCat[k].CategoryID) {
              console.log("true")
              subCat[k].checkStatus = true
            }
          }
        }
      }

      console.log("After Update:=",arrCategory)
      return arrCategory
  }

  getStaticData() {
    var arrData = [{'index':'1', 'title':'Beauty', 'image':'Domingo/Src/images/static_img/Beauty.png','checkStatus':false},
    {'index':'2', 'title':'Painter', 'image':'Domingo/Src/images/static_img/Beauty.png','checkStatus':false},
    {'index':'3', 'title':'Lawn Care', 'image':'Domingo/Src/images/static_img/Beauty.png','checkStatus':false},
    {'index':'4', 'title':'Childcare', 'image':'Domingo/Src/images/static_img/Beauty.png','checkStatus':false},
    {'index':'5', 'title':'Construction', 'image':'Domingo/Src/images/static_img/Beauty.png','checkStatus':false},
    {'index':'6', 'title':'Household Services', 'image':'Domingo/Src/images/static_img/Beauty.png','checkStatus':false},
    {'index':'7', 'title':'I. T. Services', 'image':'Domingo/Src/images/static_img/Beauty.png','checkStatus':false},
    {'index':'8', 'title':'Other', 'image':'Domingo/Src/images/static_img/Beauty.png','checkStatus':false}]
    // this.setState({
    //   dataSource:this.state.dataSource.cloneWithRows(arrData),
    // });
    return arrData
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
              width:DEVICE_WIDTH - 50 - 50,
              marginTop:Platform.OS === 'ios' ? 20 : 0,
              justifyContent:'center',
              textAlign:'center',
              alignItems:'center',
              fontFamily:'Oswald-Regular',
          }}>{LS.LString.settingsTitle}</Text>
          <TouchableWithoutFeedback style={{
                }} onPress={this.onClickFilter.bind(this)}>
            <Image style={{
                position:'relative',
                // backgroundColor:'white',
                width:40,
                height:40,
                marginTop:Platform.OS === 'ios' ? 20 : 0,
                marginRight:10
              }}
              source={require('Domingo/Src/images/right.png')}
              resizeMethod='resize'
              resizeMode='center'
              />
          </TouchableWithoutFeedback>
        </View>

        {/* ContentView */}

        <View style = {{
          position:'relative',
          // height:'100%',
          width:'100%',
          flex:2360
        }}>

          <View style = {{
            position:'relative',
            width:'100%',
            flex:436,
            // backgroundColor:'red',
            paddingLeft:15,
            paddingRight:15,

          }}>
              <View style = {{
                position:'relative',
                width:'100%',
                flex:182,
                justifyContent:'center',
              }}>
                  <Text style={{
                    color:'rgba(0,165,235,1)',
                    fontSize:13
                }}>{LS.LString.distanceText}</Text>
              </View>
              <View style = {{
                position:'relative',
                width:'100%',
                flex:220,
                backgroundColor:'white',
                borderWidth:0.25,
                borderColor:'grey',
                borderRadius:3
              }}>
                  <View style={{
                    flex: 1,
                    marginLeft: 10,
                    marginRight: 10,
                    alignItems: 'stretch',
                    justifyContent: 'center',
                  }}>
                  <Slider
                    value={this.state.distance}
                    onValueChange={(value) => this.setState({distance:value})}
                    step={1}
                    minimumValue={this.state.minValue}
                    maximumValue={this.state.maxValue}
                    />
                    <View style={{
                      flexDirection:'row',
                      flex:1,
                    }}>
                    <Text style={{
                      // backgroundColor:'red',
                      flex:0.5
                    }}>{this.state.distance} km</Text>
                    <Text style={{
                      // backgroundColor:'green',
                      flex:0.5,
                      textAlign:'right'
                    }}>{this.state.maxValue} km</Text>
                    </View>
                </View>
              </View>
          </View>

          {/* <View style = {{
            width:'100%',
            flex:436,
            // backgroundColor:'green',
            paddingLeft:15,
            paddingRight:15,
          }}>
            <View style = {{
                position:'relative',
                width:'100%',
                flex:182,
                justifyContent:'center',
              }}>
                  <Text style={{
                    color:'rgba(0,165,235,1)',
                    fontSize:13
                  }}>Rating at List</Text>
            </View>

            <View style = {{
                position:'relative',
                width:'100%',
                flex:254,
                backgroundColor:'white',
                borderWidth:0.25,
                borderColor:'grey',
                borderRadius:3,
                flexDirection:'row',
                // alignItems:'flex-end',
                // justifyContent:'flex-end'

              }}>
              <View style={{
                // backgroundColor:'red',
                width:(DEVICE_WIDTH-30)/4,
                borderRightWidth:1,
                borderRightColor:'grey',
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'center',
              }}>
                <Text style={{
                  fontSize:16
                }}>2.0</Text>
                <Text style={{
                  marginTop:7
                }}>* * * * *</Text>
              </View>
              <View style={{
                // backgroundColor:'yellow',
                width:(DEVICE_WIDTH-30)/4,
                borderRightWidth:1,
                borderRightColor:'grey',
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'center',
              }}>
                <Text style={{
                  fontSize:16
                }}>3.0</Text>
                <Text style={{
                  marginTop:7
                }}>* * * * *</Text>
              </View>
              <View style={{
                // backgroundColor:'red',
                width:(DEVICE_WIDTH-30)/4,
                borderRightWidth:1,
                borderRightColor:'grey',
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'center',
              }}>
                <Text style={{
                  fontSize:16
                }}>4.0</Text>
                <Text style={{
                  marginTop:7
                }}>* * * * *</Text>
              </View>
              <View style={{
                // backgroundColor:'yellow',
                width:(DEVICE_WIDTH-30)/4,
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'center',
              }}>
                <Text style={{
                  fontSize:16
                }}>5.0</Text>
                <Text style={{
                  marginTop:7
                }}>* * * * *</Text>
              </View>
            </View>

          </View> */}

          <View style = {{
            width:'100%',
            flex:1444,
            paddingLeft:15,
            paddingRight:15,
          }}>

            <View style = {{
                position:'relative',
                width:'100%',
                flex:182,
                justifyContent:'center',
              }}>
                  <Text style={{
                    color:'rgba(0,165,235,1)',
                    fontSize:13
                }}>{LS.LString.areaOfInterestText}</Text>
            </View>

            <View style = {{
                position:'relative',
                width:'100%',
                flex:1262,
                justifyContent:'center',
              }}>
                {/* <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}> */}
                <ListView
                    contentContainerStyle={{
                      // flexDirection:'row',
                      // flexWrap: 'wrap',
                      backgroundColor:'rgba(242,243,245,1)',
                      paddingBottom:10,
                      
                    }}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    // renderFooter={this.renderFooter.bind()}
                  // enableEmptySections={true}
                  automaticallyAdjustContentInsets={false}
                  showsVerticalScrollIndicator={false}
                  renderSectionHeader={this.renderSectionHeader.bind(this)}
                  removeClippedSubviews={false}
                />
                {/* </KeyboardAwareScrollView>   */}

            </View>

            <View style = {{
              width:'100%',
              flex:250,
              // backgroundColor:'green',
              paddingLeft:15,
              paddingRight:15,
              justifyContent:'center',
              alignItems:'center'
            }}>
            <TouchableWithoutFeedback style={{
              backgroundColor:'red',
              borderRadius:10,
              overflow:'hidden',
                }} onPress={this.onClickRenewSubscription.bind(this)}>
                <View style={{
                  borderRadius:20,
                  overflow:'hidden'
                }}>
                  <Text style={{
                    backgroundColor:'rgba(0,165,235,1)',
                    color:'white',
                    padding:10,
                    borderRadius:10,
                }}>{LS.LString.renewSubText}</Text>
                </View>
              </TouchableWithoutFeedback>
          </View>
          </View>
        </View>
        </View>
        { isShowHud == true ? <ActivityIndicator
                    color={'rgba(0,165,235,1)'}    //rgba(254,130,1,0.5)'
                    size={'large'}
                    style={styles.loaderStyle}
                    />: null
                }
      </View>
    );
  }

  // renderSectionHeader(sectionData) {
  //   console.log("sectionData:=",sectionData)
  //   return (<Text>1</Text>)
  // }

  renderSectionHeader(sectionData, sectionID) {
    console.log("renderSectionHeader -> sectionData:=",sectionData, "sectionID:=",sectionID)
    return (
        <View style={{
          backgroundColor:'rgba(242,243,245,1)',
          height:30,
        }}>
            <Text style={{
              fontSize:15
            }}>{sectionData}</Text>
        </View>
    ); 
  }

  renderRow(rowdata, sectionID, rowID) {
    console.log("row data inside",rowdata, sectionID, rowID);
    return ( //<TouchableHighlight underlayColor = {'transparent'} onPress={this.onClickOnListView.bind(this,rowdata,sectionID,rowID)}>
            <View style = {{
              // height:200,
              backgroundColor:'transparent',
              width:DEVICE_WIDTH-50,
              flexDirection:'row',
              // padding:10,
              // paddingTop:0,
              alignContent:'center',
              alignItems:'center',
              // margin:10,
              // borderRadius:30,
            }}>
            <CheckBox
              label={rowdata.CategoryName}
              checked={rowdata.checkStatus}
              // isDisable={true}
              // onChange={(checked) => this.onValueChangeCheckBox(rowdata,checked)}
              onChange={(checked) => this.onValueChangeCheckBox(rowdata,checked,sectionID,rowID)}
              containerStyle={{
                width:DEVICE_WIDTH-20,
                height:40,
              }}
            />
            </View>
          //</TouchableHighlight>
    );
 }

 onValueChangeCheckBox(rowdata,checked,sectionID,rowID){
    console.log("rowdata:=",rowdata,"checked:=",checked,"sectionID:=",sectionID,"rowID:=",rowID)
    rowdata.checkStatus ? rowdata.checkStatus=false : rowdata.checkStatus=true
    // var arrInd = this.state.arrCategory
    // arrInd[rowdata.index-1] = rowdata
    // let index = rowdata.index-1
    // arrInd= arrInd.filter((_, i) => i !== index)

    // this.setState({
    //     dataSource:ds.cloneWithRows(arrInd),
    // });
    console.log("rowdata:=",rowdata,"checked:=",checked)
    console.log("this.state.arrCategory:=",this.state.arrCategory)
 }

  onClickRenewSubscription() {
    var IsPlanActive = false
    if ('IsPlanActive' in this.state.userDetail) {
      IsPlanActive = this.state.userDetail.IsPlanActive
    }
    if (IsPlanActive === false) {
      this.props.navigation.push('subscriptionList')
    }
    else {
      alert(LS.LString.vActivePlan)
    }

  //   const resetAction = NavigationActions.reset({
  //     index: 0,
  //     actions: [
  //         NavigationActions.navigate({ routeName: 'subscriptionList' })
  //     ]
  //  });
  //  this.props.navigation.dispatch(resetAction);
  }

  onClickOnListView(rowData,sectionID,rowID){
      console.log("onClickOnListView:=rowData:=",rowData,"sectionID:=",sectionID,"rowID:=",rowID)
  }

  onClickMoreView(rowData) {
      console.log("onClickMoreView:=",rowData)
  }

  onClickMenu() {
    console.log("onClickMenu clicked")
    Events.trigger('setObserverForProfileUpdate')
    this.props.navigation.pop()
  }
  onClickFilter() {
    console.log("onClickFilter clicked")
    // this.props.navigation.pop()
    var arrSelectedCat = []
    // for (var i=0; i <this.state.arrCategory.length; i++) {
    //   if (this.state.arrCategory[i].checkStatus == true) {
    //     arrSelectedCat.push(this.state.arrCategory[i].CategoryID)
    //   }
    // }
    // console.log("selected category:=",arrSelectedCat);
    // console.log("selected category:=",arrSelectedCat.toString());

    for (i = 0; i < this.state.arrCategory.length; i++) {
      var category = this.state.arrCategory[i];

      var orderDetail = category.SubCategoryObj;
      var orderLength = orderDetail.length;

      for(j = 0; j < orderLength; j++) {
          // orderDetail = orderDetail[j];
          if (orderDetail[j].checkStatus) {
            arrSelectedCat.push(orderDetail[j].CategoryID)
          }
      }
    }

    console.log("selected category:=",arrSelectedCat);
    console.log("selected category:=",arrSelectedCat.toString());

    this.onWebserviceCallingForUpdateProfile(arrSelectedCat.toString())
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
