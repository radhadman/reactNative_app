import * as React from 'react';
import { useState } from 'react';
import { Component } from 'react';
import { Image, Button, Text, View, StyleSheet, TouchableOpacity, Picker, Platform} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { Notifications, AppLoading } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as ScreenOrientation from 'expo-screen-orientation';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { useFonts } from '@use-expo/font';



const Stack = createStackNavigator(); // for navigation
const alarm = new Audio.Sound(); // for use of alarm audio
var selectedTime; //global variable for choosing sleep amount



export default function App() { // controls app navigation stack


  return (
    
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Select" component={Select} />
        <Stack.Screen name="Sleep" component={Sleep} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}


// home screen component
class Home extends Component { 
 

  // create constructor to get access to props
  constructor(props) {
    super(props);

    this.state = {
// for time display
      currentTime: '', 
// for push notifications (not fully implemented)
     // expoPushToken: '', 
    //  notification: {},
     
    };
    
  }


 async componentDidMount() {
   
    this.Clock = setInterval( () => this.getTime(), 0); // fetch time from device clock
    // this.registerForPushNotificationsAsync(); // notifications
    // this._notificationSubscription = Notifications.addListener(this._handleNotification);
  await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  }

  componentWillUnmount(){
// stop fetching time
    clearInterval(this.Clock); 

  }


// ***************** the following functions were taken from Expo docs: *****************
// Push notifications not yet implemented

/*

 _handleNotification = notification => {
    Vibration.vibrate();
    console.log(notification);
    this.setState({ notification: notification });
  };

 registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Push notifications are not currently enabled for Napz!');
        return;
      }
      var token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      this.setState({ expoPushToken: token });
    } else {
      alert('Must use physical device for push notifications!');
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  };

*/


// this function was retrieved from https://reactnativecode.com/get-current-time-in-12-hours-am-pm-format/ and is not my work
  getTime() { 

    // Creating variables to hold time.
    var date, TimeType, hour, minutes, seconds, fullTime;

    // Creating Date() function object.
    date = new Date();

    // Getting current hour from Date object.
    hour = date.getHours(); 

    // Checking if the Hour is less than equals to 11 then Set the Time format as AM.
    if(hour <= 11)
    {

      TimeType = 'AM';

    }
    else{

      // If the Hour is Not less than equals to 11 then Set the Time format as PM.
      TimeType = 'PM';

    }


    // IF current hour is greater than 12 then minus 12 from current hour to make it in 12 Hours Format.
    if( hour > 12 )
    {
      hour = hour - 12;
    }
 
    // If hour value is 0 then by default set its value to 12, because 24 means 0 in 24 hours time format. 
    if( hour == 0 )
    {
        hour = 12;
    } 


    // Getting the current minutes from date object.
    minutes = date.getMinutes();

    // Checking if the minutes value is less then 10 then add 0 before minutes.
    if(minutes < 10)
    {
      minutes = '0' + minutes.toString();
    }


    //Getting current seconds from date object.
    seconds = date.getSeconds();

    // If seconds value is less than 10 then add 0 before seconds.
    if(seconds < 10)
    {
      seconds = '0' + seconds.toString();
    }


    // Adding all the variables in fullTime variable.
    fullTime = hour.toString() + ':' + minutes.toString() + ' ' + TimeType.toString();
    

    // Setting up fullTime variable in State.
    this.setState({

      currentTime: fullTime,
      
    });

  }

   
  
  render() {

    

   //   <Image style={{marginTop: 10, marginLeft: 40, marginBottom: 30, width: 333, height: 150}} source={require('assets/napz.png')}/>
    // containers and styles for Home component (home page)

//icon "sleep.png" retrieved from: https://www.flaticon.com/free-icon/day_2206554?term=sleep&page=1&position=4

     
    return (
      
   
      
      <View style={{flex: 1, backgroundColor: "#FFFFFF", alignItems: "center", paddingTop: 5}}>
     

     <Text style={{fontSize: 24}}>Welcome to</Text>
       <Text style={{fontSize: 100, marginBottom: Platform.OS === 'android'? 50: 100, color: "#006064"}}>Napz</Text>
<Image style={{ width: 100, height: 100}} source={require('assets/sleep.png')}/>

    <View style={{justifyContent: 'center',}}>
       <TouchableOpacity onPress={() => this.props.navigation.navigate('Select')}> 
          <View>
           <LinearGradient
          colors={[ '#0097a7', '#006064']}
          style={styles.buttonStyle}>
            <Text style={styles.buttonText}>Nap</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
        </View>

        
        
        <View style={styles.footer}>
       <Text style={{fontSize: 16, fontWeight: "bold"}}>{this.state.currentTime}</Text>
       </View>
       
 
       </View>
  

    );
   
  }

}



// for Add Nap function (not finished yet)
function Select({ navigation }) {

    const [selectedValue, setSelectedValue] = useState(30);
    selectedTime = selectedValue*60;

    return ( 
      
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', paddingBottom: 30}}>
      <View style={styles.container}>
        <Text style={{fontSize: 20, marginBottom: Platform.OS === 'ios'? 0: 20}}>Nap Length:</Text>  
      <Picker
        selectedValue={selectedValue}
        style={{ width: 150, }}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}>
        <Picker.Item label="5 minutes" value= {5} />
        <Picker.Item label="10 minutes" value= {10} />
        <Picker.Item label="15 minutes" value= {15} />
        <Picker.Item label="20 minutes" value= {20} />
        <Picker.Item label="25 minutes" value= {25} />
        <Picker.Item label="30 minutes" value= {30} />
        <Picker.Item label="35 minutes" value= {35} />
        <Picker.Item label="40 minutes" value= {40} />
        <Picker.Item label="45 minutes" value= {45} />
        <Picker.Item label="50 minutes" value= {50} />
        <Picker.Item label="55 minutes" value= {55} />
        <Picker.Item label="1 hour" value= {60} />
      </Picker>
      
    </View>

      <TouchableOpacity onPress={() => navigation.navigate("Sleep")}>
          <View>
           <LinearGradient
          colors={[ '#0097a7', '#006064']}
          style={styles.okButton}>
            <Text style={{fontSize: 24, color: 'white'}}>OK</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      
 
      </View>
    );
  }



  // Sleep Component (alarm page)

class Sleep extends Component {

// Clock icon "clock.png" was retrieved from: https://icons8.com/icons/set/clock


  // create constructor to get access to props
  constructor(props) {

    super(props);
   this.state = {
      time: selectedTime, // 1200 seconds is 20 minutes
      snoozeDisabled: true, // state prop for snooze button
      

   };

  }


// Received help from Drew Reese via Stack Overflow to get timer to instantly start running from 20:00 after component is mounted. Thanks Drew!

 async componentDidMount() {
     
     this.interval = setInterval(
      // functional state update to ensure state is correctly updated
      // from previous state
      () => this.setState(   ({ time }) => ({ time: time - 1 })    ),
      1000);
      activateKeepAwake(); // keep phone awake while alarm page is in foreground


     
    
      // some parameters/settings to control the audio for the alarm sound once Sleep Component is mounted
      Audio.setIsEnabledAsync(true);
      Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
        interruptModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      }); 
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  }



 componentDidUpdate() {
  
  // if time reaches zero, enable snooze button and stop timer
   if (this.state.time <= 0) {
     
     clearInterval(this.interval);
    () => this.setState( ({ snoozeDisabled }) => ({ snoozeDisabled: false}) );
    this.alarmSound()
   }
 }

  snoozePressed() {
    alarm.stopAsync(); // stop alarm sound
    alarm.unloadAsync(); // unload alarm sound
  this.setState({time: this.state.time + 300}) // snooze adds 300 seconds = 5 minutes of sleep time

  // begin timer again
  this.interval = setInterval( 
      () => this.setState( ({ time }) => ({ time: time - 1 }) ),
      1000);
}

// function to control alarm
  async alarmSound() {
try {  
    
    await alarm.loadAsync(require('assets/alarmSound.mp3'));
    alarm.setIsLoopingAsync(true); // makes alarm sound loop forever until stopped (ie. component unmounts)
    await alarm.playAsync();
}
catch (error) {
  console.log(error); // catch any errors for audio playing and log them in the console
}
}


  async componentWillUnmount() {
   await alarm.stopAsync(); 
   await alarm.unloadAsync(); 
    clearInterval(this.interval); // clear/stop timer
    deactivateKeepAwake(); // stop keeping phone awake when unmounted
  }



  render() {
// some variables and statements for controlling how time remaining on timer is displayed
    var snooze = this.state.snooze;
    var snoozeDisabled = this.state.snoozeDisabled
    var time = this.state.time;
    var minutes = Math.floor(time / 60).toString();
    var seconds = (time % 60).toString();
     
     if (minutes < 10)
    {
      minutes = '0' + minutes
    }


 if (seconds < 10)
    {
      seconds = '0' + seconds
    }
  
  if (this.state.time <= 0) {
    snoozeDisabled = false;
  }


// styles and containers for Sleep Component
    return (
      
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', paddingBottom: 30}}>
      <View style={styles.container}>
       <Image style={{marginBottom: 40, width: 100, height: 100,}} source={require('assets/clock.png')}/>
      
          <Text style={styles.timerText}>{minutes}:{seconds}</Text>
      </View>
      

      <TouchableOpacity disabled={snoozeDisabled} onPress={() => this.snoozePressed()}>
          <View>
           <LinearGradient
          colors={[ '#0097a7', '#006064']}
          style={ snoozeDisabled? styles.snoozeDisabled: styles.snoozeEnabled}>
            <Text style={styles.snoozeText}>Snooze</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
        
      </View>
    );
  }
}



// stylesheet for styling buttons, text, containers, etc.
const styles = StyleSheet.create({
  buttonText: {
    fontSize: 36,
    textAlign: 'center',
    color: 'white',
    fontWeight: "bold"
  },
  snoozeText: {
    fontSize: 24,
    color: 'white'
  },
  snoozeDisabled: {
    alignItems: 'center', 
    height: 50, 
    width: 300,
    borderRadius: Platform.OS === 'android'? 0: 15,
    borderColor: 'black', 
    borderWidth: 3, 
    justifyContent: 'center', 
    opacity: 0.5,
  },
  snoozeEnabled: {
    alignItems: 'center', 
    height: 50, 
    width: 300,
    borderRadius: Platform.OS === 'android'? 0: 15,
    borderColor: 'black', 
    borderWidth: 3, 
    justifyContent: 'center',
  },
  okButton: {
    alignItems: 'center', 
    height: 50, 
    width: 300,  
    borderRadius: Platform.OS === 'android'? 0: 15, 
    borderColor: 'black', 
    borderWidth: 3, 
    justifyContent: 'center', 
  },
  footer: {
    bottom: 0,
    paddingBottom: 5,
    position: 'absolute'
    },
  buttonStyle: {
    width: 200, 
    paddingTop: 20, 
    paddingBottom: 20,  
    alignItems: 'center', 
    borderRadius: Platform.OS === 'android'? 0: 15,
    borderColor: 'black', 
    borderWidth: 3
  },
  timerText: {
    fontSize: 80,
    fontWeight: 'bold',
    marginBottom: 100
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",

  }
}
);
