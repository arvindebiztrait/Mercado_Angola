import React, { Component } from 'react'

import {
   StyleSheet,
   Text,
   Navigator,
   StatusBar,
   AsyncStorage,
   TouchableOpacity,
   AppRegistry,
   StackRouter,
   Dimensions,
   Platform,
   TouchableHighlight,
   Image,
   View,
   Linking
} from 'react-native'

import {
  StackNavigation,
  StackNavigator,
  DrawerNavigator,
  DrawerItems,
  createRouter,
   
} from 'react-navigation';

//Import class

import Login from 'Domingo/Src/Screens/User/Login';
import SignUp from 'Domingo/Src/Screens/User/SignUp';
import Home from 'Domingo/Src/Screens/User/Home';
import ProfessionalList from 'Domingo/Src/Screens/User/ProfessionalList';
import Filter from 'Domingo/Src/Screens/User/Filter';
import SearchList from 'Domingo/Src/Screens/User/SearchList';
import Profile from 'Domingo/Src/Screens/User/Profile';
import MenuScreen from 'Domingo/Src/Screens/User/MenuScreen';
import AboutUs from 'Domingo/Src/Screens/User/AboutUs';
import Help from 'Domingo/Src/Screens/User/Help';
import ProfessionalProfile from 'Domingo/Src/Screens/User/ProfessionalProfile';
import MapScreen from 'Domingo/Src/Screens/User/MapScreen';
import ReviewScreen from 'Domingo/Src/Screens/User/ReviewScreen';
import Category from 'Domingo/Src/Screens/User/Category';
import SubCategory from 'Domingo/Src/Screens/User/SubCategory';

import Settings from 'Domingo/Src/Screens/Vendor/Settings';
import ProfileVendor from 'Domingo/Src/Screens/Vendor/ProfileVendor';
import SubscriptionList from 'Domingo/Src/Screens/Vendor/SubscriptionList';
import Payment from 'Domingo/Src/Screens/Vendor/Payment';
import PaymentConfirm from 'Domingo/Src/Screens/Vendor/PaymentConfirm';
import ws from 'Domingo/Src/Screens/GeneralClass/webservice';
import LS from 'Domingo/Src/Screens/GeneralClass/LocalizationStrings';

import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import Events from 'react-native-simple-events';
import SplashScreen from 'react-native-splash-screen'

export default class Domingo extends Component {
   constructor(props){
      super(props)
       console.log("inside the constructor")
       this.state = {
          isLogin:0,
          userType:1,
          token:'',
      };
      ws.initNetInfoForConnectivity()
    }
    componentDidMount() {
        console.log('called this method on background open')
        //  global.PaymentRequest = require('react-native-payments').PaymentRequest;
        LS.LString.setLanguage('pt')
        AsyncStorage.getItem("languageId").then((value1) => {
            console.log("languageId:=",value1) 
            if(value1 == null) {
                console.log("languageId Null")
                LS.LString.setLanguage('pt')
                AsyncStorage.setItem('languageId','pt')
            }
            else {
                LS.LString.setLanguage('en')
                console.log("languageId Not Null")
            } 
        }).done();
        
        
        AsyncStorage.multiGet(['SIGNINSTATUS','USERDETAIL'], (err, stores) => {
            console.log("stores:=",stores) 
            var login = 0
            var uType = 0
            stores.map((result, i, store) => {
              // get at each store's key/value so you can work with it
              let key = store[i][0];
              let value = store[i][1];
              if (key === 'SIGNINSTATUS') {
                  login = value
              }
              else if (key === 'USERDETAIL') {
                  if (value !== null) {
                    userDetail = JSON.parse(value)
                    uType = userDetail.UsersTypeId
                  } 
              }
            });
            if (login != 0) {
                this.setState({                            
                    isLogin:login,
                    userType:uType,
                }) 
            }
        }); 

        this.initializeFCMForTokenAndPermission()
            // var that = this;
            // setTimeout(function() {
            //     that.initializeFCMForTokenAndPermission()
            // }, 1000);

            // this.initializeFCMForTokenAndPermission()
    /*
        AsyncStorage.getItem("SIGNINSTATUS").then((value) => {
            console.log("user signup",value) 
                if(value == 1 && value != null)
                {
                    AsyncStorage.getItem("USERDETAIL").then((value1) => {
                        console.log("user signup",value1) 
                        userDetail = JSON.parse(value1)
                        
                        this.setState({                            
                            isLogin:value,
                            userType:userDetail.UsersTypeId,
                        })              
                    }).done();
                }
        }).done();
        */

        
        //Notification Receiver Code
        FCM.getInitialNotification().then(notif => {
            console.log("INITIAL NOTIFICATION", notif)
            // if (notif !== null) {
            //     alert('Notification:=',notif)
            // }
            
            // console.log('action of the notification',notif.fcm.action)
            // if (notif.fcm.action == null) {
                // rowdata={
                    
                // }
                // this.props.navigation.navigate('bardetail',{barData:rowdata})
            // }
        });
    
        this.notificationListener = FCM.on(FCMEvent.Notification, notif => {
            console.log("Notification", notif);
            
            if(notif.local_notification) {
                console.log('local notification arives')
                return;
            }
            if(notif.opened_from_tray) {
                
                console.log('notification is arrived from tray')
                console.log('this.propes',this.props)
                console.log('this.propes.navigation',this.props.navigation)
                return;
            }

            if (Platform.OS === 'ios') {
                // alert(notif.aps.alert.body)
            }
            else {
                if ('fcm' in notif) {
                    if ('body' in notif.fcm) {
                        alert(notif.fcm.body)
                    }
                    else {
                        console.log("False Body")
                    }
                }
                else {
                    console.log("False fcm")
                }
            }
    
            if(Platform.OS ==='ios'){
                //optional
                //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
                //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
                //notif._notificationType is available for iOS platfrom
                switch(notif._notificationType){
                    case NotificationType.Remote:
                    notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
                    break;
                    case NotificationType.NotificationResponse:
                    notif.finish();
                    break;
                    case NotificationType.WillPresent:
                    notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
                    break;
                }
            }

            // const title = notif.fcm.title;
            // FCM.presentLocalNotification({
            //     priority: 'high',
            //     title: title ? title : '',
            //     body: notif.fcm.body,
            //     big_text: notif.fcm.body,
            //     icon: 'pushicon',
            //     large_icon: 'joinmunch',
            //     url : '',
            //     lights: true,
            //     show_in_foreground: true,
            //     local: true
            // })  
            
            this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, token => {
                console.log("TOKEN (refreshUnsubscribe)", token);
            // this.props.onChangeToken(token);
            }); 
        
        }) 
        
        SplashScreen.hide();
    }

    initializeFCMForTokenAndPermission() {
        //Fcm push notification
        FCM.requestPermissions().then(()=>console.log('notification permission granted')).catch(()=>console.log('notification permission rejected'));
        //  FCM.setBadgeNumber(0)
        FCM.getFCMToken().then(token => {
            this.state.token = token
            console.log("FCM Device Token:=",token)
            if (token != null) {                    
                AsyncStorage.setItem("DEVICETOKENFCM",token);
                Events.trigger("readDeviceToken",'')
            }
            // store fcm token in your server
        });
       
        this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
            console.log('ref2 is',token)
            if (token != null) {
                AsyncStorage.setItem("DEVICETOKENFCM",token);
                Events.trigger("readDeviceToken",'')
            }
            // fcm token may not be available on first load, catch it here
        });
    }
    
    componentWillUnmount() {
  
    }
   
    render() {
         console.log("signed inside render",this.state.isLogin)
         
         const Layout = createRootNavigator(this.state.isLogin,this.state.userType);
         return(

            <Layout />
            //  <View style = {styles.container}>
                 
            //      {/* for pushnotification */}
            //      {/* <PushController
            //            onChangeToken={token => this.setState({token: token || ""})}
            //       />    */}
              
            //      <Layout />
             
            //  </View>
         );
    } 
   
} 

const styles = StyleSheet.create ({
    container: {
        backgroundColor:'white',
        flex:1334,
    },
    icon:{
       // left:1,
        //backgroundColor:'red',
        width:30,
        height:30,
        resizeMode:'center'
    }
})



//Creating the Navigation 
export const createRootNavigator = (signedIn,userType) => {
   console.log("signed in is",signedIn,userType)
  return StackNavigator(
    {        
        login: {screen: Login},
        signup: {screen: SignUp},
        home: {screen: Drawer, path: 'main'},
        professionalList: {screen: ProfessionalList},
        filter: {screen: Filter},
        searchList: {screen: SearchList},
        profile: {screen: Profile},
        menuScreen: {screen: MenuScreen},
        aboutUs: {screen: AboutUs},
        help: {screen: Help},
        professionalProfile: {screen: ProfessionalProfile},
        settings: {screen: Settings},
        profileVendor: {screen: DrawerVendor, path: 'main'},
        subscriptionList: {screen: SubscriptionList},
        payment: {screen: Payment},
        mapScreen: {screen: MapScreen},         
        reviewScreen: {screen: ReviewScreen},
        paymentConfirm: {screen: PaymentConfirm},
        category: {screen: Category},
        subCategory: {screen: SubCategory}
    },
    {
      headerMode: "none",
      mode: "card",
      initialRouteName: signedIn == 1 ? (userType == 1 ? "home" : "profileVendor"): "login"
    }
  );
};

// const transitionConfig = () => ({
//     transitionSpec: {
//       duration: 0,
//       //timing: 20,
//      // config: { duration: 20 },
//     },
//   })

//Home stack
// export const homestack = StackNavigator({
//    home: { screen: HomeContainer },
//   bardetail:{screen: BarDetailContainer}
// }, {
//   //initialRouteName: 'home',
//  // mode: "card",
//    headerMode: "none",
// })


//Creating Drawer navigation
export const Drawer = DrawerNavigator({
        home:{
            screen : Home,
        },
        profile:{
            screen:Profile,
        },
        aboutUs:
        {
            screen:AboutUs,
        },
        help:
        {
            screen:Help,
        },
        settings:
        {
            screen:Settings,
        },
        payment:
        {
            screen:Payment,
        },
        subscriptionList:
        {
            screen:SubscriptionList,
        },
        profileVendor:
        {
            screen:ProfileVendor,
        },
        mapScreen:
        {
            screen:MapScreen,
        },
        reviewScreen:
        {
            screen:ReviewScreen,
        },
        paymentConfirm:
        {
            screen:PaymentConfirm,
        },
        category:
        {
            screen:Category,
        },
        subCategory:
        {
            screen:SubCategory,
        }
   },
 {
    initialRouteName:'home',
    drawerWidth:Dimensions.get('window').width, //- (Platform.OS === 'android' ? 56 : 64),
    drawerPosition: 'left',
   // contentComponent:CustomDrawerContentComponent,
    contentComponent:MenuScreen
 })


 export const DrawerVendor = DrawerNavigator({
    home:{
        screen : Home,
    },
    profile:{
        screen:Profile,
    },
    aboutUs:
    {
        screen:AboutUs,
    },
    help:
    {
        screen:Help,
    },
    settings:
    {
        screen:Settings,
    },
    payment:
    {
        screen:Payment,
    },
    subscriptionList:
    {
        screen:SubscriptionList,
    },
    profileVendor:
    {
        screen:ProfileVendor,
    },
    mapScreen:
    {
        screen:MapScreen,
    },
    reviewScreen:
    {
        screen:ReviewScreen,
    },
    paymentConfirm:
    {
        screen:PaymentConfirm,
    },
    category:
    {
        screen:Category,
    },
    subCategory:
    {
        screen:SubCategory,
    }
},
{
    initialRouteName:'profileVendor',
    drawerWidth:Dimensions.get('window').width, //- (Platform.OS === 'android' ? 56 : 64),
    drawerPosition: 'left',
    // contentComponent:CustomDrawerContentComponent,
    contentComponent:MenuScreen
})
 
 