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
  AsyncStorage,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constant from 'Domingo/Src/Screens/GeneralClass/Constant';
import ActionSheet from 'react-native-actionsheet';
import Modal from 'react-native-modal';
import CheckBox from 'react-native-checkbox';

export const STATUSBAR_HEIGHT  = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 0

const countryTitle = 'Select Country'
const deliveryTitle = 'Select Deliveryarea'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const dsYear = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

type Props = {};
export default class Payment extends Component<Props> {

  constructor(props) {
    super(props)
    
    this.state = {
        subscriptionPlanData:this.props.navigation.state.params.data,
        dataSourceMonth:ds,
        dataSourceYear:dsYear,
        arrIndustry:['Cancel','A','B','C'],
        name:'',
        email:'',
        countryCode:'',
        phoneNo:'',
        cardNo:'',
        saveCard:false,
        cvv:'',
        arrMonth:this.initializeMonth(),
        arrYear:this.initializeYear(),
        isMonthOpen:false,
        isYearOpen:false,
        selectedMonth:'',
        selectedYear:'',
    };
  }

  componentDidMount() {
    // this.setState({
    //     dataSourceMonth:ds.cloneWithRows(this.initializeMonth()),
    //     dataSourceYear:dsYear.cloneWithRows(this.initializeYear())
    // });

    AsyncStorage.getItem("USERDETAIL").then((value1) => {
      console.log("user USERDETAIL:=",value1) 
      userDetail = JSON.parse(value1)
      this.setState({
        distance : userDetail.FromDistanse,
        userDetail : userDetail,
        email:userDetail.Email,
        name:userDetail.UserName,
        phoneNo:userDetail.Phone, 
      })//,this.onWebServiceCallingForGenerateReference())

    }).done();
  }

  initializeMonth() {
    var arrMon = [{'title':'01', 'name':'Jan', 'value':'1'},
    {'title':'02', 'name':'Feb', 'value':'2'},
    {'title':'03', 'name':'Mar', 'value':'3'},
    {'title':'04', 'name':'Apr', 'value':'4'},
    {'title':'05', 'name':'May', 'value':'5'},
    {'title':'06', 'name':'Jun', 'value':'6'},
    {'title':'07', 'name':'Jul', 'value':'7'},
    {'title':'08', 'name':'Aug', 'value':'8'},
    {'title':'09', 'name':'Sep', 'value':'9'},
    {'title':'10', 'name':'Oct', 'value':'10'},
    {'title':'11', 'name':'Nov', 'value':'11'},
    {'title':'12', 'name':'Dec', 'value':'12'}]
    return arrMon
  }

  initializeYear() {
    var arrYear = [{'title':'2018', 'name':'2018', 'value':'2018'},
    {'title':'2019', 'name':'2019', 'value':'2019'},
    {'title':'2020', 'name':'2020', 'value':'2020'},
    {'title':'2021', 'name':'2021', 'value':'2021'},
    {'title':'2022', 'name':'2022', 'value':'2022'},
    {'title':'2023', 'name':'2023', 'value':'2023'},
    {'title':'2024', 'name':'2024', 'value':'2024'},
    {'title':'2025', 'name':'2025', 'value':'2025'},
    {'title':'2026', 'name':'2026', 'value':'2026'},
    {'title':'2027', 'name':'2027', 'value':'2027'},
    {'title':'2028', 'name':'2028', 'value':'2028'},
    {'title':'2029', 'name':'2029', 'value':'2029'}]
    return arrYear
  }

  render() {
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
              width:Constant.DEVICE_WIDTH - 50 - 50,
              marginTop:Platform.OS === 'ios' ? 20 : 0,
              justifyContent:'center',
              textAlign:'center',
              alignItems:'center',
              fontFamily:'Oswald-Regular',
            }}>PAYMENT</Text>
          <TouchableWithoutFeedback style={{
                }} onPress={this.onClickMenu.bind(this)}>
            <Image style={{
                position:'relative',
                // backgroundColor:'white',
                width:40,
                height:40,
                marginTop:Platform.OS === 'ios' ? 20 : 0,
                marginRight:10,
                opacity:0
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
          height: 500,  //790,
          flexDirection:'column',
          flex:2186,
          // backgroundColor:'red',
        }}>
        <View style={{
          height:150,
          // backgroundColor:'red',
          justifyContent:'center',
          alignItems:'center',
        }}>
          <Image style={{
                position:'relative',
                // backgroundColor:'white',
                width:'100%',
                height:'100%',
                // marginTop:Platform.OS === 'ios' ? 20 : 0,
                // marginLeft:10
              }}
              source={require('Domingo/Src/images/wallet-image.png')}
              resizeMethod='resize'
              resizeMode='contain'
            />

            <Text style={{
              position:'absolute',
              color:'white',
              fontSize:35
            }}>
              {/* $500.00 */}
              {'$' + this.state.subscriptionPlanData.Price}
            </Text>
        </View>

        <View style={{
          borderBottomColor:'gray',
          borderBottomWidth:1,
          marginHorizontal:10,
          marginTop:10
        }}>
          <Text>Contact Name</Text>

          <TextInput style={{
                paddingBottom:Platform.ios === 'ios' ? 0 : 5,
                height:Platform.ios === 'ios' ? 23 : 32,
                marginLeft:5,
                marginTop:5,
                paddingHorizontal:0,
              }}
                placeholder= {'Enter Name'}
                allowFontScaling={false}
                ref='name'   
                keyboardType='default'
                returnKeyType='next'
                placeholderTextColor='rgba(79,90,105,1)'
                underlineColorAndroid='transparent'
                value={this.state.name}
                autoCapitalize='none'
                onChangeText={(text) => this.setState({name:text})} 
                onSubmitEditing={(event) => this.refs['email'].focus()}  
                // onBlur= {this.onBlurTextInput.bind(this)} 
            />
        </View>

        <View style={{
          borderBottomColor:'gray',
          borderBottomWidth:1,
          marginHorizontal:10,
          marginTop:10,
        }}>
          <Text>Email Address</Text>

          <TextInput style={{
                paddingBottom:Platform.ios === 'ios' ? 0 : 5,
                height:Platform.ios === 'ios' ? 23 : 32,
                marginLeft:5,
                marginTop:5,
                paddingHorizontal:0,
              }}
                placeholder= {'Enter Email'}
                allowFontScaling={false}
                ref='email'   
                keyboardType='default'
                returnKeyType='next'
                placeholderTextColor='rgba(79,90,105,1)'
                underlineColorAndroid='transparent'
                value={this.state.email}
                autoCapitalize='none'
                onChangeText={(text) => this.setState({email:text})} 
                onSubmitEditing={(event) => this.refs['countryCode'].focus()}  
                // onBlur= {this.onBlurTextInput.bind(this)} 
            />
        </View>

        <View style={{
          borderBottomColor:'gray',
          borderBottomWidth:1,
          marginHorizontal:10,
          marginTop:10
        }}>
          <Text>Country Code</Text>

          <TextInput style={{
                paddingBottom:Platform.ios === 'ios' ? 0 : 5,
                height:Platform.ios === 'ios' ? 23 : 32,
                marginLeft:5,
                marginTop:5,
                paddingHorizontal:0,
              }}
                placeholder= {'Enter Country Code'}
                allowFontScaling={false}
                ref='countryCode'   
                keyboardType='phone-pad'
                returnKeyType='next'
                placeholderTextColor='rgba(79,90,105,1)'
                underlineColorAndroid='transparent'
                value={this.state.countryCode}
                autoCapitalize='none'
                onChangeText={(text) => this.setState({countryCode:text})} 
                onSubmitEditing={(event) => this.refs['phone'].focus()}  
                // onBlur= {this.onBlurTextInput.bind(this)} 
            />
        </View>

        <View style={{
          borderBottomColor:'gray',
          borderBottomWidth:1,
          marginHorizontal:10,
          marginTop:10
        }}>
          <Text>Phone No.</Text>

          <TextInput style={{
                paddingBottom:Platform.ios === 'ios' ? 0 : 5,
                height:Platform.ios === 'ios' ? 23 : 32,
                marginLeft:5,
                marginTop:5,
                paddingHorizontal:0,
              }}
                placeholder= {'Enter Phone no.'}
                allowFontScaling={false}
                ref='phone'   
                keyboardType='phone-pad'
                returnKeyType='next'
                placeholderTextColor='rgba(79,90,105,1)'
                underlineColorAndroid='transparent'
                value={this.state.phoneNo}
                autoCapitalize='none'
                onChangeText={(text) => this.setState({phoneNo:text})} 
                onSubmitEditing={(event) => this.refs['card'].focus()}  
                // onBlur= {this.onBlurTextInput.bind(this)} 
            />
        </View>
        {/*
        <View style={{
          borderBottomColor:'gray',
          borderBottomWidth:1,
          marginHorizontal:10,
          marginTop:10
        }}>
          <Text>Card No.</Text>

          <TextInput style={{
                paddingBottom:Platform.ios === 'ios' ? 0 : 5,
                height:Platform.ios === 'ios' ? 23 : 32,
                marginLeft:5,
                marginTop:5,
                paddingHorizontal:0,
              }}
                placeholder= {'Enter Card No..'}
                allowFontScaling={false}
                ref='card'   
                keyboardType='numeric'
                returnKeyType='next'
                placeholderTextColor='rgba(79,90,105,1)'
                underlineColorAndroid='transparent'
                value={this.state.cardNo}
                autoCapitalize='none'
                onChangeText={(text) => this.setState({cardNo:text})} 
                onSubmitEditing={(event) => this.refs['countryCode'].focus()}  
                // onBlur= {this.onBlurTextInput.bind(this)} 
            />
        </View>

        <View style={{
          // borderBottomColor:'gray',
          // borderBottomWidth:1,
          marginHorizontal:10,
          marginTop:10,
          flexDirection:'row',
        }}>       

          <View style={{
              width:'35%',
              // backgroundColor:'yellow',
          }}>
            <Text>Month</Text>
            <TouchableWithoutFeedback style={{
                }} onPress={this.onClickMonth.bind(this)}>
            <View style={{
              flexDirection:'row',
              marginTop:5,
              borderWidth:1,
              borderColor:'grey',
            }}>
              <Text style={{
                margin:5,
                // backgroundColor:'red',
                width:'70%',
                marginRight:0,
              }}>{this.state.selectedMonth ? this.state.selectedMonth : 'MM'}</Text>
              <Image style={{
                  // backgroundColor:'green',
                  // flex:1,
                  width:'30%',
                  height:'100%',
                  // marginTop:5,
                }}
                source={require('Domingo/Src/images/dropdown.png')}
                resizeMode='center'
                />
            </View>
            </TouchableWithoutFeedback>
          </View>
        

        
          <View style={{
              width:'35%',
              // backgroundColor:'yellow',
              marginLeft:15
          }}>
            <Text>Year</Text>
            <TouchableWithoutFeedback style={{
                }} onPress={this.onClickYear.bind(this)}>
            <View style={{
              flexDirection:'row',
              marginTop:5,
              borderWidth:1,
              borderColor:'grey',
            }}>
              <Text style={{
                margin:5,
                // backgroundColor:'red',
                width:'70%',
                marginRight:0,
              }}>{this.state.selectedYear ? this.state.selectedYear : 'YY'}</Text>
              <Image style={{
                  // backgroundColor:'green',
                  // flex:1,
                  width:'30%',
                  height:'100%',
                  // marginTop:5,
                }}
                source={require('Domingo/Src/images/dropdown.png')}
                resizeMode='center'
                />
            </View>
            </TouchableWithoutFeedback>
          </View>
          
        </View>

        <View style={{
          // borderBottomColor:'gray',
          // borderBottomWidth:1,
          marginHorizontal:10,
          marginTop:20,
          flexDirection:'row',
        }}>


          <View style={{
              width:'35%',
              // backgroundColor:'yellow',
          }}>
            <Text>CVV</Text>
            <View style={{
              flexDirection:'row',
              marginTop:5,
              borderWidth:1,
              borderColor:'grey',
            }}>
              <TextInput style={{
                paddingBottom:Platform.ios === 'ios' ? 0 : 5,
                height:Platform.ios === 'ios' ? 23 : 32,
                marginLeft:5,
                marginTop:5,
                // backgroundColor:'red',
                width:'90%',
              }}
                placeholder= {''}
                allowFontScaling={false}
                ref='cvv'   
                keyboardType='number-pad'
                returnKeyType='next'
                placeholderTextColor='rgba(79,90,105,1)'
                underlineColorAndroid='transparent'
                value={this.state.cvv}
                autoCapitalize='none'
                onChangeText={(text) => this.setState({cvv:text})} 
                onSubmitEditing={(event) => console.log('Done')}  
                // onBlur= {this.onBlurTextInput.bind(this)} 
            />
            </View>
          </View>

          <Image style={{
                  // backgroundColor:'green',
                  // flex:1,
                  width:'15%',
                  height:'60%',
                  marginTop:20,
                  marginLeft:10
                }}
                source={require('Domingo/Src/images/cvv.png')}
                resizeMode='center'
          />
        </View>

        <View style={{
          flexDirection:'row',
          // backgroundColor:'green',
          height:40,
          marginHorizontal:10,
          marginTop:10,
        }}>
          <CheckBox
              label={'Save this card for faster checkout'}
              checked={this.state.saveCard}
              // onChange={(checked) => this.onValueChangeCheckBox(rowdata,checked)}
              onChange={(checked) => this.setState({saveCard:!checked})}
              containerStyle={{
                width:Constant.DEVICE_WIDTH-20,
                height:40,
                // backgroundColor:'red'
              }}
              labelStyle={{
                color:'grey',
              }}
            />
        </View> */}

        <View style={{
          flexDirection:'row',
          // backgroundColor:'green',
          height:60,
          marginHorizontal:10,
          marginTop:10,
          justifyContent:'space-around',
          alignItems:'center',
        }}>
        <TouchableWithoutFeedback style={{
                }} onPress={this.onClickBack.bind(this)}>
          <Text style={{
            fontSize:20,
            color:'white',
            backgroundColor:'rgba(0,165,235,1)',
            width:'40%',
            textAlign:'center',
            padding:8,
            borderRadius:20,
            overflow:'hidden',
          }}>BACK</Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback style={{
                }} onPress={this.onClickConfirm.bind(this)}>
          <Text style={{
            fontSize:20,
            color:'white',
            backgroundColor:'rgba(0,165,235,1)',
            width:'40%',
            textAlign:'center',
            padding:8,
            marginLeft:10,
            borderRadius:20,
            overflow:'hidden',
          }}>CONFIRM</Text>
        </TouchableWithoutFeedback>
        </View>

        {/* <View style={{
          flexDirection:'row',
          marginHorizontal:10,
          marginTop:15
        }}>
          <Image style={{
                  // width:'15%',
                  // height:'60%',
                  // marginTop:20,
                  // marginLeft:10
                }}
                source={require('Domingo/Src/images/lock.png')}
                resizeMode='center'
          />
          <Text style={{
            fontSize:10.5,
            marginLeft:10,
            marginRight:10,
          }}>Your card details are secured via 128 Bit encryption by verisign</Text>
        </View>
        {this.loadMonthView()}
        {this.loadYearView()}
        <ActionSheet
          ref='industrySheet'
          options={this.state.arrIndustry}
          cancelButtonIndex={CANCEL_INDEX}
          onPress={this.onIndustrySelection.bind(this)}/>           */}
        </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }

  loadMonthView() {
    return (<Modal isVisible={this.state.isMonthOpen}>
      <View style={{alignItems : 'center', 
        padding:10, 
        backgroundColor: '#fff', 
        height:320, 
        borderRadius:10
      }}>
        <Text style={{fontSize:20}}> Select Month </Text>
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}>
        <View style ={{borderColor:'#fbcdc5',
            flexDirection:'row',
            borderColor:'grey',
            // borderBottomWidth:1, 
            marginTop:15, 
            marginLeft:5, 
            marginRight:5,
            // backgroundColor:'red',
            height:200,
        }}>  
        
          <ListView
              contentContainerStyle={{
                // flexDirection:'row',
                // flexWrap: 'wrap',
                // backgroundColor:'rgba(242,243,245,1)',
                paddingBottom:10,
                // height:200,
              }}
              dataSource={this.state.dataSourceMonth}
              renderRow={this.renderMonthRow.bind(this)}
              // renderFooter={this.renderFooter.bind()}
              enableEmptySections={true}
              automaticallyAdjustContentInsets={false}
              showsVerticalScrollIndicator={false}
          />
          
        </View>

        </KeyboardAwareScrollView>
        
        <TouchableWithoutFeedback style={{
                }} onPress={this.onClickCancelMonth.bind(this)}>
          <Text style={{
            fontSize:20,
            color:'white',
            backgroundColor:'rgba(0,165,235,1)',
            width:'40%',
            textAlign:'center',
            padding:8,
            borderRadius:20,
            overflow:'hidden',
          }}>Cancel</Text>
        </TouchableWithoutFeedback>
      </View>
    </Modal>)
    
  }

  loadYearView() {
    return (<Modal isVisible={this.state.isYearOpen}>
      <View style={{alignItems : 'center', 
        padding:10, 
        backgroundColor: '#fff', 
        height:320, 
        borderRadius:10
      }}>
        <Text style={{fontSize:20}}> Select Year </Text>
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}>
        <View style ={{borderColor:'#fbcdc5',
            flexDirection:'row',
            borderColor:'grey',
            // borderBottomWidth:1, 
            marginTop:15, 
            marginLeft:5, 
            marginRight:5,
            // backgroundColor:'red',
            height:200,
        }}>  
        
          <ListView
              contentContainerStyle={{
                // flexDirection:'row',
                // flexWrap: 'wrap',
                // backgroundColor:'rgba(242,243,245,1)',
                paddingBottom:10,
                // height:200,
              }}
              dataSource={this.state.dataSourceYear}
              renderRow={this.renderYearRow.bind(this)}
              // renderFooter={this.renderFooter.bind()}
              enableEmptySections={true}
              automaticallyAdjustContentInsets={false}
              showsVerticalScrollIndicator={false}
          />
          
        </View>

        </KeyboardAwareScrollView>
        
        <TouchableWithoutFeedback style={{
                }} onPress={this.onClickCancelYear.bind(this)}>
          <Text style={{
            fontSize:20,
            color:'white',
            backgroundColor:'rgba(0,165,235,1)',
            width:'40%',
            textAlign:'center',
            padding:8,
            borderRadius:20,
            overflow:'hidden',
          }}>Cancel</Text>
        </TouchableWithoutFeedback>
      </View>
    </Modal>)
    
  }

  renderMonthRow(rowdata) {
    console.log("row data inside",rowdata);
    return ( <TouchableHighlight underlayColor = {'transparent'} onPress={this.onClickMonthSelected.bind(this,rowdata)}>
            <View style = {{
              backgroundColor:'transparent',
              width:'100%',
              flexDirection:'row',
              alignContent:'center',
              alignItems:'center',
              justifyContent:'center',
              marginVertical:5,
            }}>
            <Text style={{
              padding:5,
            }}>{rowdata.title}</Text>
            </View>
        </TouchableHighlight>
    );
 }

 renderYearRow(rowdata) {
  console.log("row data inside",rowdata);
  return ( <TouchableHighlight underlayColor = {'transparent'} onPress={this.onClickYearSelected.bind(this,rowdata)}>
          <View style = {{
            backgroundColor:'transparent',
            width:'100%',
            flexDirection:'row',
            alignContent:'center',
            alignItems:'center',
            justifyContent:'center',
            marginVertical:5,
          }}>
          <Text style={{
            padding:5,
          }}>{rowdata.title}</Text>
          </View>
      </TouchableHighlight>
  );
}

  onClickMenu() {
    console.log("onClickMenu clicked")
    this.props.navigation.pop()
  }

  onClickMonth() {
    this.setState({
      isMonthOpen:true
    })
  }

  onClickYear() {
    this.setState({
      isYearOpen:true
    })
  }

  onClickBack() {
    this.props.navigation.pop()
  }

  onClickConfirm() {
    // this.props.navigation.popToTop()    
    if (this.validateData()) {
      pData = {
        contactName:this.state.name,
        email:this.state.email,
        countryCode:this.state.countryCode,
        phoneNo:this.state.phoneNo,
      }
      this.props.navigation.push('paymentConfirm',{data:this.state.subscriptionPlanData, paymentDetail:pData})
    }
  }

  onClickMonthSelected(selectedData) {
    this.setState({
      selectedMonth:selectedData.title,
      isMonthOpen:false,
    })
  }

  onClickCancelMonth() {
    this.setState({
      isMonthOpen:false,
    })
  }

  onClickYearSelected(selectedData) {
    this.setState({
      selectedYear:selectedData.title,
      isYearOpen:false,
    })
  }

  onClickCancelYear() {
    this.setState({
      isYearOpen:false,
    })
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

  validateData() {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if (this.state.name == '') {
      alert('Please enter contact name')
      return false
    }
    else if (this.state.email == '') {
      alert('Please enter email address')
      return false
    }
    else if (reg.test(this.state.email) === false) {
      alert('Please enter valid email')
      return false
    }
    else if (this.state.countryCode == '') {
      alert('Please enter country code') 
      return false
    }
    else if (this.state.phoneNo == '') {
      alert('Please enter phone no.')
      return false
    }
    else if (this.state.phoneNo.length != 10) {
      alert('Please enter valid phone no.')
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
  }) 
});
