import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { FoodDatabase } from './app/FoodDatabase';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Today } from './app/Today';
import { Foods } from './app/Foods';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator()
FoodDatabase.load()
export default function App() {
  return (
    <NavigationContainer>
      <View style={{marginTop: StatusBar.currentHeight}}></View>
      <Tab.Navigator screenOptions={({route}) => ({headerShown: false, tabBarStyle: {
        backgroundColor: "#E5E1DA"
      }, tabBarIcon: ({focused, color, size}) => {
        if(route.name === "Today")return <Ionicons size={size} color={color} name={'today'}/>
        else if(route.name === "Foods") return <MaterialIcons size={size} color={color} name={'food-bank'}/>
      }})} sceneContainerStyle={{backgroundColor: "#FBF9F1"}}>
        <Tab.Screen name='Today' component={Today}></Tab.Screen>
        <Tab.Screen name='Foods' component={Foods}></Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
