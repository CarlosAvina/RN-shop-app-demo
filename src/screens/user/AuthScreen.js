import React from "react";
import {
  View,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../../constants/Colors";

import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";

const AuthScreen = (props) => {
  return (
    <KeyboardAvoidingView
      style={styles.screen}
    >
      <LinearGradient style={styles.gradient} colors={['#ffedff', '#ffe3ff']}>
        <Card style={styles.card}>
          <ScrollView>
            <Input
              id="email"
              label="E-mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorMessage="Please enter a valid email address"
              onInputChange={() => {}}
              initialValue=""
            />
            <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorMessage="Please enter a valid password address"
              onInputChange={() => {}}
              initialValue=""
            />
            <View style={styles.buttonContainer}>
              <Button title="Login" color={Colors.primary} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Sign up" color={Colors.accent} />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

AuthScreen.navigationOptions = {
    headerTitle: "Authenticate"
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "80%",
    maxHeight: 400,
    padding: 20
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default AuthScreen;
