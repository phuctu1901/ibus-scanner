/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";

import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  PermissionsAndroid
} from "react-native";

import { CameraKitCameraScreen } from "react-native-camera-kit";
const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

type Props = {};
export default class App extends Component<Props> {
  constructor() {
    super();
    this.state = {
      //variable to hold the qr value
      qrvalue: "",
      opneScanner: false
    };
  }

  useTicket(id) {
    // this.setState({ visible: !this.state.visible });
    fetch("http://192.168.1.100:8000/api/station/useticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // username: this.state.username,
        id: "123",
      })
    })
      .then(r =>
        r.json().then({ ok: r.ok, status: r.status})
      )
      .then(res => {
        // this.setState({ visible: !this.state.visible });
        console.log(res);
        if (res.ok) {
          Alert.alert("OK", "OK: " + res.status);
          
          // this.storeToken(res.body.success.token);
          // this.props.navigation.navigate("Home");
        } else {
          Alert.alert("Error", "Error: " + res.status);
        }
      })
      .catch(error => {
        console.error(error);
      });
    // this.GetDetail();
  }

  onOpenlink() {
    //Function to open URL, If scanned
    Linking.openURL(this.state.qrvalue);
    //Linking used to open the URL in any browser that you have installed
  }
  onBarcodeScan(qrvalue) {
    //called after te successful scanning of QRCode/Barcode
    console.log(qrvalue);
    this.setState({ qrvalue: qrvalue });
    this.setState({ opneScanner: false });
    this.useTicket(qrvalue);
    // this.getRouteByStationId(qrvalue);
  }
  onOpneScanner() {
    var that = this;
    //To Start Scanning
    if (Platform.OS === "android") {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: "CameraExample App Camera Permission",
              message: "CameraExample App needs access to your camera "
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //If CAMERA Permission is granted
            that.setState({ qrvalue: "" });
            that.setState({ opneScanner: true });
          } else {
            alert("CAMERA permission denied");
          }
        } catch (err) {
          alert("Camera permission err", err);
          console.warn(err);
        }
      }
      //Calling the camera permission function
      requestCameraPermission();
    } else {
      that.setState({ qrvalue: "" });
      that.setState({ opneScanner: true });
    }
  }
  render() {
    let displayModal;
    //If qrvalue is set then return this view
    if (!this.state.opneScanner) {
      return (
        <View style={styles.container}>
          <Text style={styles.heading}>React Native QR Code Example</Text>
          <Text style={styles.simpleText}>
            {this.state.qrvalue ? "Scanned QR Code: " + this.state.qrvalue : ""}
          </Text>
          {this.state.qrvalue.includes("http") ? (
            <TouchableHighlight
              onPress={() => this.onOpenlink()}
              style={styles.button}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 12 }}>Open Link</Text>
            </TouchableHighlight>
          ) : null}
          <TouchableHighlight
            onPress={() => this.onOpneScanner()}
            style={styles.button}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 12 }}>
              Open QR Scanner
            </Text>
          </TouchableHighlight>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <CameraKitCameraScreen
          showFrame={true}
          //Show/hide scan frame
          scanBarcode={true}
          //Can restrict for the QR Code only
          laserColor={"blue"}
          //Color can be of your choice
          frameColor={"yellow"}
          //If frame is visible then frame color
          colorForScannerFrame={"black"}
          //Scanner Frame color
          onReadCode={event =>
            this.onBarcodeScan(event.nativeEvent.codeStringValue)
          }
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  button: {
    alignItems: "center",
    backgroundColor: "#2c3539",
    padding: 10,
    width: 300,
    marginTop: 16
  },
  heading: {
    color: "black",
    fontSize: 24,
    alignSelf: "center",
    padding: 10,
    marginTop: 30
  },
  simpleText: {
    color: "black",
    fontSize: 20,
    alignSelf: "center",
    padding: 10,
    marginTop: 16
  }
});
