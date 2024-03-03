import { useState } from "react"
import { TextInput, View, StyleSheet, Text, Button, Alert } from "react-native"
import {v4} from 'uuid'
import { Food, FoodDatabase } from "./FoodDatabase"

export const AddFood = ({onFoodAdded}:{onFoodAdded:()=>void}) => {
    const [nameInput, setNameInput] = useState<string>('')
    const [proteinInput, setProteinInput] = useState<string>('')
    const [carbsInput, setCarbsInput] = useState<string>('')
    const [fatInput, setFatInput] = useState<string>('')

    return <View style={styles.view}>
        <Text>Name</Text>
        <TextInput 
            style={styles.input}
            onChangeText={setNameInput}
            value={nameInput}/>

        <Text>Protein</Text>
        <TextInput 
            style={styles.input}
            onChangeText={setProteinInput}
            value={proteinInput}
            keyboardType="number-pad"/>

        <Text>Carbs</Text>
        <TextInput 
            style={styles.input}
            onChangeText={setCarbsInput}
            value={carbsInput}
            keyboardType="number-pad"/>

        <Text>Fat</Text>
        <TextInput 
            style={styles.input}
            onChangeText={setFatInput}
            value={fatInput}
            keyboardType="number-pad"/>

        <Button title="Add" onPress={async () => {
            if(nameInput.length === 0)return Alert.alert("Name cannot be empty")
            if(proteinInput.length === 0)return Alert.alert("Protein cannot be empty")
            if(carbsInput.length === 0)return Alert.alert("Carbs cannot be empty")
            if(fatInput.length === 0)return Alert.alert("Fat cannot be empty")

            const protein = parseInt(proteinInput)
            if(isNaN(protein) || protein < 0)return Alert.alert("Protein is not a valid number")

            const carbs = parseInt(carbsInput)
            if(isNaN(carbs) || carbs < 0)return Alert.alert("Carbs is not a valid number")
            const fat = parseInt(fatInput)
            if(isNaN(fat) || fat < 0)return Alert.alert("Fat is not a valid number")

            const id = makeid(10)
            const food:Food = {
                name: nameInput,
                carbs: carbs,
                fat: fat,
                protein: protein,
                id: id
            }
            FoodDatabase.foods[id] = food
            await FoodDatabase.save()
            onFoodAdded()
            Alert.alert("Food has beed added")
        }}/>
    </View>
}

function makeid(length:number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}


const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      width: 200
    },
    view:{
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 30
    }
  });