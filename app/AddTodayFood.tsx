import { Modal, View, Text, TextInput, Button, Alert } from "react-native";
import { Food, FoodInUse, foodCalories } from "./FoodDatabase";
import { useState } from "react";
import { FoodList } from "./FoodList";

export const AddTodayFood = ({foodAdded, forceClose}:{foodAdded:(food:FoodInUse)=>void, forceClose:()=>void}) => {
    const [selectedFood, setSelectedFood] = useState<Food|undefined>(undefined)
    const [gramsInput, setGramsInput] = useState('')
    const grams = gramsInput.length === 0? 0 : isNaN(parseFloat(gramsInput))? 0 : parseFloat(gramsInput)
    const perc = grams/100
    return <View>
        {
            selectedFood === undefined?
            <FoodList canDelete={false} onItemPress={(item) => setSelectedFood(item)}/>:
            <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                <View style={{marginTop: 100}}></View>
                <Text style={{fontSize: 20, marginBottom: 10}}>{selectedFood.name}</Text>
                <Text>Grams</Text>
                <TextInput style={{height: 40,margin: 12,borderWidth: 1,padding: 10,width: 200}} keyboardType="numeric" onChangeText={setGramsInput} value={gramsInput}/>
                <Text>Calories: {foodCalories(selectedFood)*perc}</Text>
                <Text>Protein: {selectedFood.protein*perc}</Text>
                <Text>Carbs: {selectedFood.carbs*perc}</Text>
                <Text>Fat: {selectedFood.fat*perc}</Text>
                <Button title="Finish" onPress={() => {
                    if(grams <= 0)return Alert.alert("Please enter grams")

                    foodAdded({
                        grams: grams,
                        id: selectedFood.id,
                        time: new Date()
                    })
                }}/>
            </View>
        }

    </View>
}