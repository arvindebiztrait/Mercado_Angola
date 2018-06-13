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
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constant from 'Domingo/Src/Screens/GeneralClass/Constant';
import Events from 'react-native-simple-events';
import ws from 'Domingo/Src/Screens/GeneralClass/webservice'; 
import Rating from 'react-native-easy-rating';

export const STATUSBAR_HEIGHT  = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;


type Props = {};
export default class SearchList extends Component<Props> {

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
        dataSource:ds,
        searchText:this.props.navigation.state.params.searchText,
        professionalList:[],
        isShowHud:false,
        pageNumber:1,
        pageSize:10,
        isShowFooter:false,
        totalPage:0,
        isLoadmoreAvailable:true,
        isLoadMoreRunnig:true,
    };
  }

  componentDidMount() {
    // this.setState({
    //     dataSource:this.state.dataSource.cloneWithRows(this.getStaticData()),
    // });
    Events.on('receiveResponse', 'receiveResponseSearchList', this.onReceiveResponse.bind(this)) 
    this.onWebServiceCallingForSearchProfessionList()
  }

  onReceiveResponse (responceData) { 
       
    if (responceData.methodName == 'ProfessionalListing') {
        console.log('responceData:=',responceData)
        this.setState({isShowHud: false,isDisable:false,isLoadMoreRunnig:false,isShowFooter:false})
        this.state.totalPage = responceData.totalPageCount
        if (this.state.pageNumber >= this.state.totalPage) {
          this.state.isLoadmoreAvailable = false
        }
        if (responceData.Status == true) {
          let professionalList = responceData.Results.ProfessionalList;
          var totalUser= this.state.professionalList.concat(professionalList);
          var totalUserUnique = totalUser.map(item => item)
                        .filter((value, index, self) => self.indexOf(value) === index)
          this.setState({
            professionalList : totalUserUnique,
            dataSource:this.state.dataSource.cloneWithRows(totalUserUnique),
          })
        }
        else{
           alert(responceData.ErrorMessage)           
        }
    }
  }

  onWebServiceCallingForSearchProfessionList() {
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log(isConnected)
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));
        
      if(isConnected) {
            var param = {
              'Page_Number':this.state.pageNumber,
              'Page_Size':this.state.pageSize,
              'CategoryIds':'',
              'ProfessionalName':this.state.searchText,
              'Latitude':'',
              'Longitude':'',
              'Ratings':'',
              'FromDistanse':'',
            }
            console.log("param is ",param);
            this.setState({
              "isShowHud" : true
            })
            ws.callWebservice('ProfessionalListing',param,'')
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
              width:Constant.DEVICE_WIDTH - 50 - 50,
              marginTop:Platform.OS === 'ios' ? 20 : 0,
              justifyContent:'center',
              textAlign:'center',
              alignItems:'center',
              fontFamily:'Oswald-Regular',
            }}>SEARCH LISTING</Text>
          <TouchableWithoutFeedback style={{
                }} onPress={this.onClickMenu.bind(this)}>
            <Image style={{
                position:'relative',
                backgroundColor:'white',
                width:40,
                height:40,
                marginTop:Platform.OS === 'ios' ? 20 : 0,
                marginRight:10,
                opacity:0,
              }}
              source={require('Domingo/Src/images/static_img/Beauty.png')}
              >
            </Image>
          </TouchableWithoutFeedback>
        </View>

        {/* ContentView */}
        
        <View style = {{
          position:'relative',
          // height:'100%',
          width:'100%',
          flex:2118+242
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
    var imgUrl = rowdata.ImagePath;
   return ( <TouchableHighlight underlayColor = {'transparent'} onPress={this.onClickOnListView.bind(this,rowdata)}>
            <View style = {{
              backgroundColor:'white',
              width:Constant.DEVICE_WIDTH-20,
              flexDirection:'row',
              alignContent:'center',
              alignItems:'center',
              margin:10,
              borderRadius:30,
            }}>

              <View style={{
                margin:5, 
                justifyContent:'flex-start',
                alignItems:'flex-start',
                width:80,
                flexDirection:'column',
                height:'100%',
                paddingTop:10,
              }}>     
                <TouchableHighlight underlayColor = {'transparent'} onPress={this.onClickMoreView.bind(this,rowdata)}>          
                   <Image
                     style={{
                       height:80,
                       width:80,
                       borderRadius:40,
                     }}
                    //  source={require('Domingo/Src/images/profile_detail_default.png')}
                     source={{uri: imgUrl}}
                    resizeMethod='resize'
                    resizeMode='center'          
                  />                   
                 </TouchableHighlight>
              </View>
              <View style={{
                flexDirection:'column',
                width:Constant.DEVICE_WIDTH-80-20-10-10,
              }}>
                <Text style={{
                    fontSize:18,
                    marginTop:10,
                  }}>{rowdata.ProfessionalName}</Text>
                  <Text style={{
                    fontSize:14,
                    marginTop:10,
                    color:'rgba(124,125,126,1)'
                  }}>{rowdata.AreaName}</Text>
                  <Text style={{
                    fontSize:14,
                    marginTop:5,
                    color:'rgba(124,125,126,1)'
                  }}>{rowdata.CityName}</Text>
                  <View style={{
                    flexDirection:'row',
                    // justifyContent:'center',
                    alignContent:'center',
                    alignItems:'center',
                  }}>
                  <Rating
                    style = {{
                      paddingTop:10,
                      paddingBottom:5,
                    }}
                    rating={rowdata.Rating}
                    max={5}
                    iconWidth={20}
                    iconHeight={20}
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

  renderFooter()
  {
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

  onSrollViewEnd(e)
  {
    console.log("end calleds")
    var windowHeight = Constant.DEVICE_HEIGHT,
    height = e.nativeEvent.contentSize.height,
    offset = e.nativeEvent.contentOffset.y;
    if( windowHeight + offset >= height ) {            
        if(this.state.isLoadmoreAvailable == true) {
          console.log("load more available")
          if(this.state.isLoadMoreRunnig == false) {
              this.state.pageNumber = this.state.pageNumber+1
              this.setState({isLoadMoreRunnig:true,isShowFooter:true})  
              this.onWebServiceCallingForSearchProfessionList()   
          }
        }
    }
  }

 onClickOnListView(rowData){
    console.log("onClickOnListView:=",rowData)
    this.props.navigation.navigate('professionalProfile',{professionalObj:rowData})
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
}

const styles = StyleSheet.create({
  container: {
    flex: 2560,
    flexDirection: 'column',
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
