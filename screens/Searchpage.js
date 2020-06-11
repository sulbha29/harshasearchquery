import React from 'react';
import { StyleSheet, Text, View,FlatList,TextInput,TouchableOpacity} from 'react-native';
import db from '../config'
import ScrollView  from 'react-native-gesture-handler'

export default class Searchscreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            alltransactions:[],
            lastvisiibletransaction:null,
            search:''
        }
    }
    
    searchtransaction =async(text)=>{
        var entertext = text.split("")
//       var text = text.toUpperCase()
        if(entertext[0].toUpperCase()==='B'){
            const transaction = await db.collection("transaction").where("bookid",'==',text).get()
            transaction.docs.map((doc)=>{this.setState({
                alltransactions:
                [...this.state.alltransactions,doc.data()],
                lastvisiibletransaction:doc
            })})
        }
        else if(entertext[0].toUpperCase()=== 'S'){
            const transaction = await db.collection
            ("transaction").where("studentid",'==',text).
            get()
            transaction.docs.map((doc)=>{this.setState({
                alltransactions:
                [...this.state.alltransactions,doc.data()]
                ,lastvisiibletransaction:doc
            })})
        }
    }

    fetchmoretransaction = async()=>{
        var text = this.state.search.toUpperCase()
        var entertext = text.split("")
//        var text = text.toUpperCase()
        if(entertext[0].toUpperCase()==='B'){
            const query = await db.collection("transaction").where("bookid",'==',text).startAfter(this.state.lastvisiibletransaction).limit(10).get()
            query.docs.map((doc)=>{this.setState({
                alltransactions:[...this.state.alltransactions,doc.data()],lastvisiibletransaction:doc
            })})
        }
        else if(entertext[0].toUpperCase()=== 'S'){
            const query = await db.collection("transaction").where("studentid",'==',text).startAfter(this.state.lastvisiibletransaction).limit(10).get()
            query.docs.map((doc)=>{this.setState({
                alltransactions:[...this.state.alltransactions,doc.data()],lastvisiibletransaction:doc
            })})
        }
    }


    componentDidMount = async()=>{
        const query = await db.collection("transaction").limit(10).get()
        query.docs.map((doc)=>{
            this.setState({
                alltransactions:[],
                lastvisiibletransaction:doc
            })
        })
    }
    
    render(){
        return(
            <View style = {styles.container}>
                <View style = {styles.searchbar}>
                    <TextInput style = {styles.bar}placeholder = "enter id" 
                    onChangeText = {(text)=>this.setState({search:text})}/>
                    <TouchableOpacity style ={styles.searchbutton} 
                    onPress = {()=>{this.searchtransaction(this.state.search)}}><Text>Search</Text></TouchableOpacity></View>
            <FlatList
            data =  {this.state.alltransactions}
            renderItem = {({item})=>(
                    <View style={{borderBottomWidth:2}}>
                        <Text>{"bookid:"+item.bookid}</Text>
                        <Text>{"studentid:"+item.studentid}</Text>
                        <Text>{"transactiontype:"+item.transactiontype}</Text>
                        <Text>{"date:"+item.date.toDate()}</Text></View>
            )}
            keyExtractor = {(item,index)=>index.toString()}
            onEndReached = {this.fetchmoretransaction}
            onEndReachedThreshold = {0.7}/>
            </View>
    )
}
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        margin:2
    },
    searchbar:{
        flexDirection:'row',
        height:100,
        width:'auto',
        backgroundColor:"white",
    
    },
    bar:{
        borderWidth:2,
        height:50,
        width:100
    },
    searchbutton:{
        height:50,
        width:25,
        backgroundColor:'maroon'
    }
})