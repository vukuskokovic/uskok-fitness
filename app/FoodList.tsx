import { useState } from "react";
import { Food, FoodDatabase } from "./FoodDatabase";
import { View, Modal, Button, Alert, Text, TextInput, Touchable, TouchableOpacity } from "react-native";
import { AddFood } from "./AddFood";

function compare( a:Food, b:Food ) {
    if ( a.name < b.name ){
      return -1;
    }
    if ( a.name > b.name ){
      return 1;
    }
    return 0;
  }

export const FoodList = (
    {canDelete, onItemPress}:
    {canDelete:boolean, onItemPress?:(food:Food)=>void}) => {
        

    const [fakeState, setFakeState] = useState(0)
    const [modalVisible, setModalVisible] = useState(false)
    const [searchName, setSearchName] = useState('')
    return <View>
        <Modal
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            transparent={false}
            animationType="fade">
            
            <AddFood onFoodAdded={() => {
                setFakeState(fakeState+1)
                setModalVisible(false)
            }}/>
        </Modal>

        <View style={{height: "100%", width: "100%", overflow: 'scroll', flexDirection: 'row', gap: 5, padding: 5, flexWrap: 'wrap', justifyContent: 'center'}}>
            <View style={{width: '100%', height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10}}>
                <Text>Name</Text>
                <TextInput style={{height: 40,margin: 12,borderWidth: 1,padding: 10,width: 200}}
                    onChangeText={setSearchName}
                    value={searchName}/>
            </View>
            {
                Object.values(FoodDatabase.foods).filter(x => searchName === ''? true : x.name.toLowerCase().includes(searchName.toLowerCase())).sort(compare).map(food => 
                <TouchableOpacity onPress={() => onItemPress?.(food)} key={food.id}>
                    <View style={{width: 160, height: 100, backgroundColor: "orange", flexDirection: 'column', alignItems:'center', borderRadius: 3}}>
                        <Text style={{color: "white", fontWeight: "600", fontSize: 17, marginTop: 5}}>{food.name}</Text>
                        <View style={{flexDirection: 'column', marginRight: 'auto', marginLeft: 5}}>
                            <Text>Protein: {food.protein}</Text>
                            <Text>Fat: {food.fat}</Text>
                            <Text>Carbs: {food.carbs}</Text>
                        </View>
                        {
                            canDelete &&
                            <View style={{position: 'absolute', right: 1, bottom: 1}}>
                            <Button title="Delete" onPress={() => {
                                Alert.alert('Are you sure?', `Are you sure you want to delete: '${food.name}'`, [
                                    {
                                        text: "Yes",
                                        onPress: async () => {
                                            delete FoodDatabase.foods[food.id]
                                            await FoodDatabase.save()
                                            Alert.alert(`Food delted`, `'${food.name}' has beed deleted`)
                                            setFakeState(fakeState+1)
                                        }
                                    },
                                    {
                                        text: "No"
                                    }
                                ])
                            }}/>
                        </View>
                        }
                    </View>
                </TouchableOpacity>)
            }
            <View style={{position: 'absolute', right: 20, bottom: 20}}>
                <Button title="Add food" onPress={() => setModalVisible(true)}/>
            </View>
        </View>
    </View>
}