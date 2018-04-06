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
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constant from 'Domingo/Src/Screens/GeneralClass/Constant';
import CheckBox from 'react-native-checkbox';
import Slider from 'react-native-slider';
import  Rating from 'react-native-easy-rating'
import Events from 'react-native-simple-events';
import ws from 'Domingo/Src/Screens/GeneralClass/webservice';
import LS from 'Domingo/Src/Screens/GeneralClass/LocalizationStrings';

export const DEVICE_WIDTH = Dimensions.get('window').width;
export const DEVICE_HEIGHT = Dimensions.get('window').height;

export const STATUSBAR_HEIGHT  = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

type Props = {};
export default class Filter extends Component<Props> {

  constructor(props) {
    super(props)
    console.log("this.props.isFromList:=",this.props.navigation.state.params.isFromList)
    this.state = {
        dataSource:ds,
        searchText:'',
        arrCategory:this.getStaticData(),
        distance:0,
        minValue:0,
        maxValue:100,
        isFromList:this.props.navigation.state.params.isFromList ? this.props.navigation.state.params.isFromList : 0,
        isShowHud:false,
        selectedRatings:3,
        latitude:this.props.navigation.state.params.latitude,
        longitude:this.props.navigation.state.params.longitude,
    };
  }

  componentDidMount() {
    // this.setState({
    //     dataSource:ds.cloneWithRows(this.getStaticData()),
    // });

    Events.on('receiveResponse', 'receiveResponseFilter', this.onReceiveResponse.bind(this))
    this.onWebServiceCallingForCategoryList()
  }

  onReceiveResponse (responceData) {

    if (responceData.methodName == 'CategoryListing') {
        console.log('responceData:=',responceData)
        this.setState({isShowHud: false,isDisable:false})

        if (responceData.Status == true) {
          let arrCategory = responceData.Results.Category_List;
          this.setState({
            arrCategory : arrCategory,
            dataSource:this.state.dataSource.cloneWithRows(arrCategory),
          })
        }
        else{
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
              width:DEVICE_WIDTH - 50 - 50,
              marginTop:Platform.OS === 'ios' ? 20 : 0,
              justifyContent:'center',
              textAlign:'center',
              alignItems:'center',
              fontFamily:'Oswald-Regular',
          }}>{LS.LString.filterTitle}</Text>
          <TouchableWithoutFeedback style={{
                }} onPress={this.onClickApplyFilter.bind(this)}>
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
                flex:254,
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
                      // backgroundColor:'red',
                      top:-5,
                    }}>
                    <Text style={{
                      // backgroundColor:'red',
                      flex:0.5
                  }}>{this.state.distance} {LS.LString.kmText}</Text>
                    <Text style={{
                      // backgroundColor:'green',
                      flex:0.5,
                      textAlign:'right'
                  }}>{this.state.maxValue} {LS.LString.kmText}</Text>
                    </View>
                </View>
              </View>
          </View>

          <View style = {{
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
                }}>{LS.LString.ratingAtList}</Text>
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
              <TouchableWithoutFeedback onPress={this.onClickRating.bind(this,2)}>
              <View style={{
                // backgroundColor:'red',
                width:(DEVICE_WIDTH-30)/4,
                borderRightWidth:1,
                borderRightColor:'grey',
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'center',
                borderBottomColor:'rgba(0,165,235,1)',
                borderBottomWidth:this.state.selectedRatings === 2 ? 4 : 0,
              }}>
                <Text style={{
                  fontSize:16
                }}>2.0</Text>
                <Rating
                    style = {{
                      paddingTop:10,
                      paddingBottom:5,
                    }}
                    rating={2}
                    max={5}
                    iconWidth={10}
                    iconHeight={10}
                    iconSelected={require('Domingo/Src/images/star.png')}
                    iconUnselected={require('Domingo/Src/images/blackstar.png')}
                    onRate={(rating) => this.setState({rating: rating})}
                    editable={false}
                    />
              </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={this.onClickRating.bind(this,3)}>
              <View style={{
                // backgroundColor:'yellow',
                width:(DEVICE_WIDTH-30)/4,
                borderRightWidth:1,
                borderRightColor:'grey',
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'center',
                borderBottomColor:'rgba(0,165,235,1)',
                borderBottomWidth:this.state.selectedRatings === 3 ? 4 : 0,
              }}>
                <Text style={{
                  fontSize:16
                }}>3.0</Text>
                <Rating
                    style = {{
                      paddingTop:10,
                      paddingBottom:5,
                    }}
                    rating={3}
                    max={5}
                    iconWidth={10}
                    iconHeight={10}
                    iconSelected={require('Domingo/Src/images/star.png')}
                    iconUnselected={require('Domingo/Src/images/blackstar.png')}
                    onRate={(rating) => this.setState({rating: rating})}
                    editable={false}
                />
              </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={this.onClickRating.bind(this,4)}>
              <View style={{
                // backgroundColor:'red',
                width:(DEVICE_WIDTH-30)/4,
                borderRightWidth:1,
                borderRightColor:'grey',
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'center',
                borderBottomColor:'rgba(0,165,235,1)',
                borderBottomWidth:this.state.selectedRatings === 4 ? 4 : 0,
              }}>
                <Text style={{
                  fontSize:16
                }}>4.0</Text>
                <Rating
                    style = {{
                      paddingTop:10,
                      paddingBottom:5,
                    }}
                    rating={4}
                    max={5}
                    iconWidth={10}
                    iconHeight={10}
                    iconSelected={require('Domingo/Src/images/star.png')}
                    iconUnselected={require('Domingo/Src/images/blackstar.png')}
                    onRate={(rating) => this.setState({rating: rating})}
                    editable={false}
                    />
              </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={this.onClickRating.bind(this,5)}>
              <View style={{
                // backgroundColor:'yellow',
                width:(DEVICE_WIDTH-30)/4,
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'center',
                borderBottomColor:'rgba(0,165,235,1)',
                borderBottomWidth:this.state.selectedRatings === 5 ? 4 : 0,
              }}>
                <Text style={{
                  fontSize:16
                }}>5.0</Text>
                <Rating
                    style = {{
                      paddingTop:10,
                      paddingBottom:5,
                    }}
                    rating={5}
                    max={5}
                    iconWidth={10}
                    iconHeight={10}
                    iconSelected={require('Domingo/Src/images/star.png')}
                    iconUnselected={require('Domingo/Src/images/blackstar.png')}
                    onRate={(rating) => this.setState({rating: rating})}
                    editable={false}
                    />
              </View>
              </TouchableWithoutFeedback>
            </View>

          </View>

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
                }}>{LS.LString.selectIndustryText}</Text>
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
                      paddingBottom:10
                    }}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    // renderFooter={this.renderFooter.bind()}
                  enableEmptySections={true}
                  automaticallyAdjustContentInsets={false}
                  showsVerticalScrollIndicator={false}
                />
                {/* </KeyboardAwareScrollView>   */}

            </View>
          </View>
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

  renderRow(rowdata) {
    console.log("row data inside",rowdata);
    return ( //<TouchableHighlight underlayColor = {'transparent'} onPress={this.onClickOnListView.bind(this,rowdata)}>
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
              // onChange={(checked) => this.onValueChangeCheckBox(rowdata,checked)}
              onChange={(checked) => this.onValueChangeCheckBox(rowdata,checked)}
              containerStyle={{
                width:DEVICE_WIDTH-20,
                height:40,
                // backgroundColor:'red'
              }}
            />
            </View>
          //</TouchableHighlight>
    );
 }

 onValueChangeCheckBox(rowdata,checked){
    console.log("rowdata:=",rowdata,"checked:=",checked)
    rowdata.checkStatus ? rowdata.checkStatus=false : rowdata.checkStatus=true
    var arrInd = this.state.arrCategory
    arrInd[rowdata.index-1] = rowdata
    let index = rowdata.index-1
    arrInd= arrInd.filter((_, i) => i !== index)
    this.setState({
        dataSource:ds.cloneWithRows(arrInd),
    });
    console.log("rowdata:=",rowdata,"checked:=",checked)
 }

 onClickOnListView(rowData){
    console.log("onClickOnListView:=",rowData)
 }

 onClickMoreView(rowData) {
    console.log("onClickMoreView:=",rowData)
 }

  onClickMenu() {
    console.log("onClickMenu clicked")
    this.props.navigation.pop()
  }
  onClickFilter() {
    console.log("onClickFilter clicked")
  }

  onClickApplyFilter() {
    var arrSelectedCat = []
    for (var i=0; i <this.state.arrCategory.length; i++) {
      if (this.state.arrCategory[i].checkStatus == true) {
        arrSelectedCat.push(this.state.arrCategory[i].CategoryID)
      }
    }
    console.log("selected category:=",arrSelectedCat);
    console.log("selected category:=",arrSelectedCat.toString());
    if (this.state.isFromList == 1) {
      var data = {
        distance:this.state.distance,
        rating:this.state.selectedRatings,
        categoryId:arrSelectedCat.toString(),
        latitude:this.state.latitude,
        longitude:this.state.longitude,
      }
      Events.trigger("applyFilter",data)
      this.props.navigation.pop()
    }
    else {
      this.props.navigation.navigate('professionalList', {isFromFilter:true, isFromHome:false,latitude:this.state.latitude,longitude:this.state.longitude,categoryId:arrSelectedCat.toString(),distance:this.state.distance, rating:this.state.selectedRatings})
    }
  }

  onClickRating(rat) {
    this.setState({
      selectedRatings:rat
    })
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
