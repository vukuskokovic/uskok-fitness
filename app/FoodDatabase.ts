import AsyncStorage from '@react-native-async-storage/async-storage';
export interface Food
{
    id:string,
    name:string,
    protein:number,
    carbs:number,
    fat:number
}
export interface FoodInUse
{
    id:string,
    grams:number,
    time:Date
}

export function foodCalories(food:Food) {
    return food.carbs*4 + food.protein*4 + food.fat*9
}

export class FoodDatabase
{
    static foods : {[key:string] : Food} = {}
    static save(){
        return AsyncStorage.setItem("foods", JSON.stringify(this.foods))
    }

    static async load(){
        try{
            const json = await AsyncStorage.getItem('foods')
            if(!json)return;

            this.foods = JSON.parse(json)
        }
        finally{
        }
    }
}