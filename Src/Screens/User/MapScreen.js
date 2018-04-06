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
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constant from 'Domingo/Src/Screens/GeneralClass/Constant';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import EventEmitter from "react-native-eventemitter";
import FusedLocation from 'react-native-fused-location';
import LS from 'Domingo/Src/Screens/GeneralClass/LocalizationStrings';

// Geocoder.setApiKey('AIzaSyAnZx1Y6CCB6MHO4YC_p04VkWCNjqOrqH8');

// Geocoder.setApiKey('AIzaSyBd7GUG0jC_xN3IL0jtkwEkieW2OEdSy1Q');

//Client Key
Geocoder.setApiKey('AIzaSyCVdqxM9cfcV80RorJXnx0G6z9UXIV7BO8');



export const STATUSBAR_HEIGHT  = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;


type Props = {};
export default class MapScreen extends Component<Props> {

  constructor(props) {
    super(props)
    this.state = {
        searchText:'',
        initialRegion: {
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        region: {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
        coordinate:{
            latitude: 37.78825,
            longitude: -122.4324,
        },
        fullAddress:'',
        city:'',
        street:'',
        country:'',
        block_no:'',
        zipCode:'',
        areaName:'',
        isShowHud:false,
        isShowHudForAddress:false,
    };
  }

  async componentDidMount (){
    console.log("componentDidMount")
    if(Platform.OS === 'ios') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            coordinate: { 
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            region: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            },
          },this.loadAddressFromMap());
        },
        (error) => console.log(error.error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },);
    }
    else {
      this.setState({isShowHud:true})
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
            title: LS.LString.locationText1,
            message: LS.LString.locationText1 +
            LS.LString.locationText2
            }
        );
          if (granted) {

              FusedLocation.setLocationPriority(FusedLocation.Constants.HIGH_ACCURACY);

              // Get location once.
              const location = await FusedLocation.getFusedLocation();
              // this.setState({lat: location.latitude, long: location.longitude});

              // Set options.
              FusedLocation.setLocationPriority(FusedLocation.Constants.BALANCED);
              FusedLocation.setLocationInterval(20000);
              FusedLocation.setFastestLocationInterval(15000);
              FusedLocation.setSmallestDisplacement(10);

              // Keep getting updated location.
              FusedLocation.startLocationUpdates();

              // Place listeners.
              this.subscription = FusedLocation.on('fusedLocation', location => {
              /* location = {
              latitude: 14.2323,
              longitude: -2.2323,
              speed: 0,
              altitude: 0,
              heading: 10,
              provider: 'fused',
              accuracy: 30,
              bearing: 0,
              mocked: false,
              timestamp: '1513190221416'
              }
              */
                console.log("LOCATION:=",location);
                this.setState({
                  coordinate: { 
                    latitude: location.latitude,
                    longitude: location.longitude,
                  },
                  region: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  },
                  isShowHud:false,
                },this.loadAddressFromMap());
              });

              /* Optional
              this.errSubscription = FusedLocation.on('fusedLocationError', error => {
              console.warn(error);
              });
              */
          }
          else {
            this.setState({isShowHud:false})
          }
    }
    
  }

  componentWillUnmount() {
    if (Platform.OS === 'ios') {
      
    }
    else {
      FusedLocation.off(this.subscription);
      // FusedLocation.off(this.errSubscription);
      FusedLocation.stopLocationUpdates();
    }
  }

  render() {
    var isShowHud = this.state.isShowHud;
    var isShowHudForAddress = this.state.isShowHudForAddress;
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
              width:Constant.DEVICE_WIDTH - 50 - 50,
              marginTop:Platform.OS === 'ios' ? 20 : 0,
              justifyContent:'center',
              textAlign:'center',
              alignItems:'center',
              fontFamily:'Oswald-Regular',
            }}>{LS.LString.selAddressText}</Text>
          <TouchableWithoutFeedback style={{
                }} onPress={this.onClickFilter.bind(this)}>
            <Image style={{
                position:'relative',
                // backgroundColor:'white',
                width:40,
                height:40,
                marginTop:Platform.OS === 'ios' ? 20 : 0,
                marginRight:10,
                // opacity:0,
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
          flex:1
        }}>

        {this.state.fullAddress ? 
        <View style={{
          position:'absolute',
          backgroundColor:'white',
          width:Constant.DEVICE_WIDTH-40,
          marginLeft:20,
          marginTop:20,
          // height:100,
          zIndex:1,
          padding:10,
          borderColor:'grey',
          borderWidth:1,
          borderRadius:5,
        }}>
          <Text style={{
            textAlign:'center',
          }}>{this.state.fullAddress}</Text>
        </View> : undefined }        
          <View>
          <MapView
                style = {{height:Constant.DEVICE_HEIGHT-64.0, width:Constant.DEVICE_WIDTH, marginRight:0, marginBottom:0, marginLeft:0, marginTop:0}}
                region={this.state.region}
                onRegionChange={this.onRegionChange.bind(this)}
                showsMyLocationButton={true}
            >
            <Marker draggable
              coordinate={this.state.coordinate}
              onDragEnd={(e) => this.setState({ 
                coordinate: e.nativeEvent.coordinate,
                region: {
                    latitude:e.nativeEvent.coordinate.latitude,
                    longitude:e.nativeEvent.coordinate.longitude,
                    latitudeDelta: this.state.region.latitudeDelta,
                    longitudeDelta: this.state.region.longitudeDelta,
                }
              },this.loadAddressFromMap())}
            />
          </MapView>
          </View>
        </View>
        </View>
        { isShowHud == true ? <ActivityIndicator
                    color={'rgba(0,165,235,1)'}    //rgba(254,130,1,0.5)'
                    size={'large'}
                    style={styles.loaderStyle}
                    />: null
                }
        { isShowHudForAddress == true ? <ActivityIndicator
            color={'rgba(0,165,235,1)'}    //rgba(254,130,1,0.5)'
            size={'large'}
            style={styles.loaderStyle}
            />: null
        }
      </View>
    );
  }

  onRegionChange(region) {
      // this.setState({ region:region });
      console.log("region:=",region)
      // this.setState({
      //     region: region,
      //     // coordinate: {
      //     //     latitude: region.latitude,
      //     //     longitude: region.longitude
      //     // }
      // });
  }

  loadAddressFromMap() {
    console.log("loadAddressFromMap called")
    this.setState({
      isShowHudForAddress:true,
    })
    Geocoder.getFromLatLng(this.state.coordinate.latitude, this.state.coordinate.longitude).then(
      json => {
          console.log("json.results[0]:=",json.results[0])
          console.log("json.results[0].formatted_address:=",json.results[0].formatted_address)
          this.setState({
            fullAddress:json.results[0].formatted_address,
            isShowHudForAddress:false,
          })
          var address_component = json.results[0].address_components;
          for (let index = 0; index < address_component.length; index++) {
              const element = address_component[index];
              if (element.types.includes('street_number')) {
                  console.log("street_number matched")
                  this.setState({
                      block_no:element.long_name
                  });
              }
              else if (element.types.includes('route') || element.types.includes('neighborhood') || element.types.includes('sublocality_level_1')) {
                this.setState({
                    areaName: element.long_name
                });
              }
              else if (element.types.includes('locality')) {
                  this.setState({
                      city: element.long_name
                  });
              }
              else if (element.types.includes('administrative_area_level_1')) {
                  this.setState({
                      street:element.long_name
                  })
              }
              else if (element.types.includes('country')) {
                  this.setState({
                    country:element.long_name
                  })
              }
              else if (element.types.includes('postal_code')) {
                this.setState({
                    zipCode:element.long_name
                })
            }
          }
          console.log("address_component:=",address_component[0].types[0])
          console.log("locality:=",json.results[0].address_components.locality)
      },
      error => {
          console.log("ERROR:=",error)
          alert("Error to get address from lat-long:",error)
          this.setState({
            isShowHudForAddress:false
          })
      }
    );
  }

 onClickOnListView(rowData){
    console.log("onClickOnListView:=",rowData)
    this.props.navigation.navigate('professionalList',{data:rowData})
 }

  onClickMenu() {
    console.log("onClickMenu clicked")
    this.props.navigation.pop();
  }

  onClickFilter() {
    // this.props.navigation.push('filter',{'isFromList':0})
    var address = {
      fullAddress:this.state.fullAddress,
      city:this.state.city,
      street:this.state.street,
      country:this.state.country,
      zipCode:this.state.zipCode,
      block_no:this.state.block_no,
      areaName:this.state.areaName,
      latitude:this.state.region.latitude,
      longitude:this.state.region.longitude
    }
    EventEmitter.emit('addressSelected',address)
    this.props.navigation.pop();
  }

  onSearchClick() {
    this.props.navigation.navigate('searchList')
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
