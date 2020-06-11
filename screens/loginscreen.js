import React from 'react';
import { StyleSheet, Text, View,FlatList,TextInput,TouchableOpacity, KeyboardAvoidingView, Alert,Image} from 'react-native';

export default class Loginscreen extends React.Component{
    constructor(){
        super();
        this.state = {
            emailid : '',
            password:''
        }
    }

    login = async (emailid,password)=>{
        console.log(emailid)
        if(emailid && password){
            try{
                const response = await firebase.auth().signInWithEmailAndPassword(emailid,password)
                if(response){
                    this.props.navigation.navigate('Transaction')
                }
            }
            catch(error){
                switch (error.code){
                    case 'auth/user-not-found':
                        Alert.alert("user doesnt exists")
                        break;
                    case 'auth/invalid-email':
                        Alert.alert('incorrect email or password')
console.log('invalid');              
                    }
            }
        }        
        else{
            Alert.alert('email and password');
        }
    }

    render(){
        return( 
            <View>
                <KeyboardAvoidingView style = {{alignitems:'center',marginTop:100}}>
                    <View>
                        <Image source = {require("../assets/booklogo.jpg")}
                        style = {{width:200,height:200}}/>
                        <Text style = {{alignItems:'center',fontSize:16}}>wireless library</Text>
                    </View>
                    <View>
                        <TextInput style = {styles.loginbox}
                        placeholder = "abcd@gmail.com"
                        keyboardType = 'email-address'
                        onChangeText = {(text)=>{
                            this.setState({emailid:text})}}
                        />
                        <TextInput style = {styles.loginbox}
                        secureTextEntry = {true}
                        placeholder = "password"
                        onChangeText = {(text)=>{
                            this.setState({password:text})}}
                        />
                    </View>
                    <View>
                        <TouchableOpacity style={{height:100,width:200,borderWidth:3,backgroundColor:"Yellow"}}
                            onPress = {()=>{this.login
                                (this.state.emailid,
                                    this.state.password)}}
                        >
                            <Text style = {{textAlign:"center"}}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        )
    }
}
 const styles = StyleSheet.create({
    loginbox:{
        width:100,
        height:50,
       
        fontSize:16 
    } 
 })