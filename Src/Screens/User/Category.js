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
  PermissionsAndroid,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constant from 'Domingo/Src/Screens/GeneralClass/Constant';
import Events from 'react-native-simple-events';
import ws from 'Domingo/Src/Screens/GeneralClass/webservice'; 
import Permissions from 'react-native-permissions';
// import { Constants, Location, Permissions } from 'expo';
import FusedLocation from 'react-native-fused-location';
import LS from 'Domingo/Src/Screens/GeneralClass/LocalizationStrings';

export const STATUSBAR_HEIGHT  = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;


type Props = {};
export default class Category extends Component<Props> {

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
        dataSource:ds,
        searchText:'',
        arrCategory:[],
        isShowHud:false,
        latitude:0.0,
        longitude:0.0,
        pageNumber:1,
        pageSize:500,
        isShowFooter:false,
        totalPage:0,
        isLoadmoreAvailable:true,
        isLoadMoreRunnig:false,
    };
  }

  async componentDidMount() {
    // this.setState({
    //     dataSource:this.state.dataSource.cloneWithRows(this.getStaticData()),
    // });
    Events.on('receiveResponse', 'receiveResponseCategory', this.onReceiveResponse.bind(this)) 
    this.onWebServiceCallingForCategoryList()
   
    console.log("componentDidMount")
      
  }

  componentWillUnmount() {
  }

  onReceiveResponse (responceData) { 
       
    if (responceData.methodName == 'CategoryListing') {
        console.log('responceData:=',responceData)
        this.setState({isShowHud: false,isDisable:false,isLoadMoreRunnig:false,isShowFooter:false})
        this.state.totalPage = responceData.totalPageCount
        if (this.state.pageNumber >= this.state.totalPage) {
          this.state.isLoadmoreAvailable = false
        }
        if (responceData.Status == true) {
          this.state.arrCategory = []
          let arrCategory = responceData.Results.Category_List;
          var totalUser= this.state.arrCategory.concat(arrCategory);
          var totalUserUnique = totalUser.map(item => item)
          .filter((value, index, self) => self.indexOf(value) === index)
          this.setState({
            arrCategory : totalUser,
            dataSource:this.state.dataSource.cloneWithRows(totalUser),
          })
        }
        else{
           alert(responceData.ErrorMessage)           
        }
    }
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
                marginLeft:5
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
            }}>{LS.LString.categoryTitle}</Text>
          <TouchableWithoutFeedback style={{
                }} onPress={this.onClickFilter.bind(this)}>
            <Image style={{
                position:'relative',
                // backgroundColor:'white',
                width:40,
                height:40,
                marginTop:Platform.OS === 'ios' ? 20 : 0,
                marginRight:10,
                opacity:0
              }}
              source={require('Domingo/Src/images/filter.png')}
              resizeMethod='resize'
              resizeMode='center'
              />
          </TouchableWithoutFeedback>
        </View>

        {/* SearchBar */}
        {/* <View style={{
            // flex:242,
            backgroundColor:'rgba(242,243,245,1)',
            justifyContent:'center',
            alignItems:'center',
            height:64,
        }}>
          <View style={{
            backgroundColor:'white',
            // marginLeft:10,
            // marginRight:10,
            width:'90%',
            height:'60%',
            borderRadius:20,
            flexDirection:'row',
            // justifyContent:'center',
            alignItems:'center',
            paddingLeft:15
          }}>
            <TextInput style={{
                // borderBottomColor:'grey',
                // borderBottomWidth:1,
                // marginLeft:10,
                // marginRight:10,
                // paddingBottom:Platform.ios === 'ios' ? 0 : 5,
                // height:Platform.ios === 'ios' ? 23 : 32,
                width:'80%'
              }}
                placeholder= {'Search'}
                allowFontScaling={false}
                ref='bName'   
                keyboardType='default'
                returnKeyType='done'
                placeholderTextColor='rgba(79,90,105,1)'
                underlineColorAndroid='transparent'
                value={this.state.searchText}
                autoCapitalize='none'
                onChangeText={(text) => this.setState({searchText:text})} 
                onSubmitEditing={(event) => this.onSearchClick()}  
                // onBlur= {this.onBlurTextInput.bind(this)} 
                />
            <TouchableWithoutFeedback style={{
                }} onPress={this.onSearchClick.bind(this)}>
              <Image style={{
                  position:'relative',
                  // backgroundColor:'yellow',
                  width:40,
                  height:'100%',
                  // marginTop:20,
                  marginLeft:10
                }}
                source={require('Domingo/Src/images/search.png')}
                resizeMethod='resize'
                resizeMode='center'
                />
            </TouchableWithoutFeedback>
          </View>
        </View> */}

        {/* ContentView */}
        
        <View style = {{
          position:'relative',
          // height:'100%',
          width:'100%',
          flex:1
        }}>
        {/* <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}> */}
          <ListView
              contentContainerStyle={{
                flexDirection:'row',
                flexWrap: 'wrap',
                backgroundColor:'rgba(242,243,245,1)',
                paddingBottom:10
              }}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                renderFooter={this.state.isShowFooter ? this.renderFooter.bind(this) : null}
                onScroll={this.onSrollViewEnd.bind(this)}
                // onScrollEndDrag={this.onSrollViewEnd.bind(this)}
                scrollEventThrottle={9000}
                enableEmptySections={true}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={false}
          />      
          {/* </KeyboardAwareScrollView>   */}
          { isShowHud == true && this.state.pageNumber == 1 ? <ActivityIndicator
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
    // console.log("row data inside",rowdata);
    var imgUrl = rowdata.CategoryImage;
   return ( <TouchableHighlight underlayColor = {'transparent'} onPress={this.onClickOnListView.bind(this,rowdata)}>
            <View style = {{
              // height:200,
              backgroundColor:'transparent',
              width:((Constant.DEVICE_WIDTH)/2),
              flexDirection:'column',
              // padding:10,
              // paddingTop:0,
              alignContent:'center',
              alignItems:'center',
              marginBottom:10
            }}>

              <View style={{
                margin:5, 
                backgroundColor:'white',
                borderRadius:5,
                padding:10,
                justifyContent:'center',
                alignItems:'center'
              }}>               
                   <Image
                     style={{
                       height:Constant.DEVICE_WIDTH/2 - 40,
                       width:Constant.DEVICE_WIDTH/2 - 40,
                      //  backgroundColor:'rgba(0,165,235,1)',
                     }}
                    //  source={rowdata.index%2 == 0 ? require('Domingo/Src/images/static_img/Beauty.png') : require('Domingo/Src/images/static_img/Childcare.png')}
                    //  source={require('Domingo/Src/images/static_img/Childcare.png')}
                     defaultSource={require('Domingo/Src/images/placeholder_home.png')}
                     source={{ uri: imgUrl}}
                     resizeMode='cover'
                     resizeMethod='resize'
                    //  loadingIndicatorSource={require('Domingo/Src/images/placeholder_home.png')}
                     
                 />                   
                 <Text style={{
                   fontSize:18,
                   marginTop:10,
                   marginBottom:10
                 }}> {rowdata.CategoryName} </Text>
              </View>
            </View>
          </TouchableHighlight>
         );
 }

 renderFooter() {
      return (
        <View style ={{height:50,justifyContent:'center',alignItems:'center',flexDirection:'row',backgroundColor:'rgba(0,165,235,1)'}}>
            <ActivityIndicator
                      color={'white'}
                      size={'large'}
                      hidesWhenStopped={true}
                      style={{marginLeft:20}}
                      />
            <Text style={{marginLeft:15,color:'white',fontSize:20}}>Loading...</Text>
        </View>
        )
  }

  onSrollViewEnd(e) {
    // console.log("end calleds")
    var windowHeight = Constant.DEVICE_HEIGHT,
    height = e.nativeEvent.contentSize.height,
    offset = e.nativeEvent.contentOffset.y;
    // console.log("height:=",height," offset:=",offset, " windowHeight:=",windowHeight)
    if( windowHeight + offset >= height ) {   
        // console.log("windowHeight + offset >= height true")         
        if(this.state.isLoadmoreAvailable == true) {
          // console.log("load more available")
          if(this.state.isLoadMoreRunnig == false) {
              this.state.pageNumber = this.state.pageNumber+1
              this.setState({isLoadMoreRunnig:true,isShowFooter:true})  
              this.onWebServiceCallingForCategoryList()   
          }
        }
    }
  }

 onClickOnListView(rowData){
    console.log("onClickOnListView:=",rowData)
    // this.props.navigation.navigate('professionalList',{isFromHome:true,data:rowData,latitude:this.state.latitude,longitude:this.state.longitude})
    this.props.navigation.navigate('subCategory',{subCategory:rowData.SubCategoryObj,isFromHome:false})
 }

  onClickMenu() {
    console.log("onClickMenu clicked")
    this.props.navigation.pop();

  }

  onClickFilter() {
    this.props.navigation.push('filter',{isFromList:0,latitude:this.state.latitude,longitude:this.state.longitude})
  }

  onSearchClick() {
    if (this.state.searchText === '') {
      alert('Please enter text to search professional')
      return
    }
    this.props.navigation.navigate('searchList',{searchText:this.state.searchText})
  }

  onWebServiceCallingForCategoryList() {
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log(isConnected)
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));
        
      if(isConnected) {
            var param = {
                  'Page_Number':this.state.pageNumber,
                  'Page_Size':this.state.pageSize,
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
