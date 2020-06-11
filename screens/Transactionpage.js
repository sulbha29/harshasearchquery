import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity,Image,TextInput, Alert,KeyboardAvoidingView,ToastAndroid} from 'react-native';
import  * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner'; 
import firebase from 'firebase';
import db from '../config'
export default class Transactionscreen extends React.Component{
    constructor(){
        super();
        this.state = {
            hascamerapermission:null,
            scanned:false,
     
            buttonstate : "normal",
            scannedstudentid:"",
            scannedbookid:"",
            Transactionmessage:""
        };
    }
    
    getcamerapermission = async(id)=>{
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hascamerapermission:status === "granted",
            buttonstate:id,scanned:false,
        });
    }; 

    handlebarcodescan = async({type,data})=>{
        const {buttonstate}=this.state;
        if(buttonstate==="bookid"){
        this.setState({
            scanned:true,scannedbookid:data,buttonstate:"normal",
        });
        }
        else if(buttonstate==="studentid"){
        this.setState({
                scanned:true,scannedstudentid:data,buttonstate:"normal"
        }
        );}};
       
        initiatebookissue=async()=>{
            db.collection("transaction").add({
                studentid:this.state.scannedstudentid,
                bookid:this.state.scannedbookid,
                date:firebase.firestore.Timestamp.now().toDate(),
                transactiontype:"issue"
            });
            db.collection("books").doc(this.state.scannedbookid).update({
                bookavailability:false,
            });
            db.collection("student").doc(this.state.scannedstudentid).update({
                numberofbooksissued:firebase.firestore.FieldValue.increment(1)
            });
        };
        
        bookreturn=async()=>{
            db.collection("transaction").add({
                studentid:this.state.scannedstudentid,
                bookid:this.state.scannedbookid,
                date:firebase.firestore.Timestamp.now().toDate(),
                transactiontype:"return"
            });
            db.collection("books").doc(this.state.scannedbookid).update({
                bookavailability:true
            });
            db.collection("student").doc(this.state.scannedstudentid).update({
                numberofbooksissued:firebase.firestore.FieldValue.increment(-1)
            });
        
        };
        
        checkstudenteligibilityforbookissue=async()=>{
            const studentref = await db.collection("student").where("studentid","==",this.state.scannedstudentid).get();
            var isstudenteligible = ""
            if(studentref.docs.length==0){
                this.setState({scannedstudentid:"",scannedbookid:"",});
                isstudenteligible = false
                Alert.alert("this student id doesn't exist in the database")
            }
            else{
                studentref.docs.map((doc)=>{
                    var student = doc.data();
                    if(student.numberofbooksissued<2){
                        isstudenteligible = true
                    }
                    else{
                        isstudenteligible = false
                        Alert.alert("student is already issued two books")
                        this.setState({scannedstudentid:"",scannedbookid:""});
                    }
                });
            }
            return isstudenteligible 
        }
        checkstudenteligibilityforreturn=async()=>{
            const Transactionref = await db.collection("transaction").where("bookid","==",this.state.scannedbookid).limit(1).get();
            var isstudenteligible = ""
            Transactionref.docs.map((doc)=>{
                var lastbooktransaction = doc.data()
                if(lastbooktransaction.studentid==this.state.scannedstudentid){
                    isstudenteligible = true
                }
                else{
                    isstudenteligible = false
                    Alert.alert("book isn't issued by this student")
                    this.setState({scannedstudentid:"",scannedbookid:""})
                }
            }) 
            return isstudenteligible;
        }
        checkbookeligibility=async()=>{
            const bookref = await db.collection("books").where("bookid","==",this.state.scannedbookid).get()
            var transactiontype = "";
            if(bookref.docs.length == 0){
                transactiontype = false;
            }
            else{
                bookref.docs.map((doc)=>{
                    var book = doc.data()
                    if(book.bookavailability){
                        transactiontype = "issue"
                    }
                    else{
                        transactiontype = "return"
                    }
                });
               
        }
        return transactiontype
    }
    handleTransaction =async()=>{
        var transactiontype = await this.checkbookeligibility()
    if(!transactiontype){
        Alert.alert("book is out of stock")
        this.setState({
            scannedbookid:"",
            scannedstudentid:""
        });
    }
    else if(transactiontype=="issue"){
        var isstudenteligible = await this.checkstudenteligibilityforbookissue()
        if(isstudenteligible){
            this.initiatebookissue()
            Alert.alert("book issued to the student")
        }
    }
    else{
        var isstudenteligible = await this.checkstudenteligibilityforreturn()
        if (isstudenteligible){
            this.bookreturn()
            Alert.alert("book returned to the library")
        }
    }
    };
        render(){
        const hascamerapermission = this.state.hascamerapermission;
        const scanned = this.state.scanned;
        const buttonstate = this.state.buttonstate;
        if (buttonstate!=="normal" && hascamerapermission){
            return(
                <BarCodeScanner onBarCodeScanned = {scanned?undefined:this.handlebarcodescan}
                style = {StyleSheet.absoluteFillObject}/>
            );
        }

        else if(buttonstate==="normal"){
            return(
                <KeyboardAvoidingView style={styles.container}behaviour="padding"enabled>
                <View>
                <Image source={require("../assets/booklogo.jpg")}
                style={{width:200,height:200}}/>
                <Text style={{textAlign:'center',fontSize:30}}>willi</Text></View>
                <View style ={styles.inputView}>
                    <TextInput style ={styles.inputbox}
                    placeholder="bookid"
                    onChangeText={(text) =>this.setState({scannedbookid:text})}
                    value={this.state.scannedbookid}/>
                    <TouchableOpacity style={styles.scanButton}
                    onPress={()=>{
                        this.getcamerapermission("bookid")
                    }}
                    >
                        <Text style ={styles.buttonText}>scan</Text></TouchableOpacity>
                </View>
                <View style={styles.inputView}>
                <TextInput style ={styles.inputbox}
                placeholder="studentid"
                onChangeText={(text) =>this.setState({scannedstudentid:text})}
                value={this.state.scannedstudentid}/>

                <TouchableOpacity style={styles.scanButton}
                onPress={()=>{this.getcamerapermission("studentid")}}>
                <Text style ={styles.buttonText}>scan</Text>
                </TouchableOpacity>
                </View>
            
            <TouchableOpacity
                style = {styles.submitbutton}
                onPress={async()=>{var Transactionmessage= await this.handleTransaction();
                }}>
                <Text style ={styles.submittext}>SUBMIT</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        );
        }
}
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:"center"
    },
    displayText:{
        fontSize:10,
        textDecorationLine:'underline'
    },
    scanButton:{
        backgroundColor:"black",
        width:200,
        marginBottom: 20
    },
    buttonText:{
        
        fontSize:30,       
    },
    inputView:{
        flexDirection:'row',
        margin:20 
    },
    inputbox:{
        width:200,
        height:100,
        borderWidth:3,
        fontSize:20
    },
    submitbutton:{
        backgroundColor:'white',
        width:80,
        height:50
    },
    submittext:{
        fontSize:14,
        color:'blue'
    },
});