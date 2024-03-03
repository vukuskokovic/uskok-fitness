import { useEffect, useState } from "react"
import { View, Text, Modal, Button, Alert, TouchableOpacity, Vibration } from "react-native"
import { FoodDatabase, FoodInUse, foodCalories } from "./FoodDatabase"
import { AddTodayFood } from "./AddTodayFood"
import AsyncStorage from "@react-native-async-storage/async-storage"

const Micronutrient = ({name, count}:{name:string, count:number}) => {
    return <View style={{flexDirection: 'row', borderBottomColor: 'gray', borderBottomWidth: 1, alignItems: 'center', width: 70}}>
        <Text style={{width: 35, color: 'white'}}>{Math.round(count)}</Text>
        <Text style={{fontSize: 10}}>{name}</Text>
    </View>
}

export const Today = () => {

    useEffect(() => {
        (async() => {
            const foodsJson = await AsyncStorage.getItem("today")
            if(!foodsJson)return;

            setTodayFoods(JSON.parse(foodsJson))
        })()
    }, [])

    const [todayFoods, setTodayFoods] = useState<FoodInUse[]>([])
    const [isSelectingFood, setIsSelectingFood] = useState(false)

    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0
    for(let food of todayFoods){
        const foodInstance = FoodDatabase.foods[food.id]
        if(!foodInstance)continue;

        const perc = food.grams/100
        totalProtein += foodInstance.protein * perc
        totalCarbs += foodInstance.carbs * perc
        totalFat += foodInstance.fat * perc
    }
    let totalCalories = totalFat * 9 + totalCarbs * 4 + totalProtein * 4


    return <View>
        <Modal 
            visible={isSelectingFood}
            onRequestClose={() => setIsSelectingFood(false)}
            transparent={false}
            animationType="slide">
            <AddTodayFood foodAdded={async (food) => {
                const newArray = [...todayFoods, food]
                await AsyncStorage.setItem("today", JSON.stringify(newArray))
                setTodayFoods(newArray)
                setIsSelectingFood(false)
            }} forceClose={() => setIsSelectingFood(false)}/>
        </Modal>
        <View style={{flexDirection: "column"}}>
            <View style={{height: "8%", width: "100%", backgroundColor: "#54BAB9", flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                <View style={{flexDirection: 'row', marginHorizontal: 7, alignItems: 'center'}}>
                    <Text style={{fontSize: 23, color: 'white'}}>{Math.round(totalCalories)}</Text>
                    <Text style={{marginTop: 'auto', fontSize: 10}}>kcal</Text>
                </View>
                <View style={{flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: 20}}>
                    <Micronutrient count={totalProtein} name="Proten"/>
                    <Micronutrient count={totalCarbs} name="Carbs"/>
                    <Micronutrient count={totalFat} name="Fat"/>
                </View>
            </View>
            <View style={{height: "92%", width: "100%", flexDirection: 'column', overflow: 'scroll', gap: 4, paddingTop: 4, alignItems: 'center'}}>
                {
                    todayFoods.map((food, i) => 
                    {
                        const foodInstance = FoodDatabase.foods[food.id]
                        if(!foodInstance)return <View />

                        const perc = food.grams/100
                        return <TouchableOpacity style={{width: '100%', height: 60, flexDirection: 'row', alignItems: 'center'}} key={i} onLongPress={() => {
                            Vibration.vibrate([100,100,100], false)
                            Alert.alert("Are you sure", `Are you sure you want to delete today's entry for '${foodInstance.name}'(${food.grams}g)?`, [
                                {
                                    text: "Yes",
                                    onPress: async () => {
                                        const newArray = todayFoods.filter((_, index) => index !== i)
                                        await AsyncStorage.setItem("today", JSON.stringify(newArray))
                                        setTodayFoods(newArray)
                                    }
                                },
                                {
                                    text: "No"
                                }
                            ])  
                        }}>
                            <View>
                                <Text style={{fontSize: 20, color: '#54BAB9'}}>{foodInstance.name}</Text>
                                <View style={{flexDirection: 'row', justifyContent:'center', alignItems: 'center', gap: 6}}>
                                    <Text>Protein: {foodInstance.protein*perc}</Text>
                                    <Text>Carbs: {foodInstance.carbs*perc}</Text>
                                    <Text>Fat: {foodInstance.fat*perc}</Text>
                                </View>
                            </View>
                            <View style={{marginLeft: 'auto', flexDirection: 'column', alignItems: 'center', marginRight: 10, gap: -4}}>
                                <Text style={{color: '#54BAB9', fontWeight: '700', fontSize: 20}}>{Math.round(foodCalories(foodInstance)*perc)}</Text>
                                <Text style={{opacity: 0.5}}>kcal</Text>
                            </View>
                        </TouchableOpacity>
                    })
                }
            </View>
            <View style={{position: 'absolute', right: 20, bottom: 20}}>
                <Button title="Add" onPress={() => setIsSelectingFood(true)}></Button>
            </View>
            <View style={{position: 'absolute', left: 20, bottom: 20}}>
                <Button title="Clear" onPress={() => {
                    Alert.alert("Are you sure", "Are you sure you want to clear the list", [
                        {
                            text:"Yes",
                            onPress: async () => {
                                await AsyncStorage.setItem("today", '[]')
                                setTodayFoods([])
                            }
                        },
                        {
                            text:"No"
                        }
                    ])
                }}></Button>
            </View>
        </View>
    </View>
}