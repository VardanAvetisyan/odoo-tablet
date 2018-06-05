import React, {
      Component,
      PropTypes,
      View,
      Text ,
      TextInput,
      Image,
      ListView,
      TouchableOpacity,
      ProgressBarAndroid,
      ScrollView
} from 'react-native';
    import {
     Card,
     Button,
     COLOR,
     PRIMARY_COLORS,
     TYPO ,
     Avatar,
     Icon,
     Divider
     } from 'react-native-material-design';

import { login } from '../utils/login_api';

export default class LoginV extends Component{


constructor(props) {
    super(props);
    this.state = {
      password:'',
      login: '',
      ErrorLogin: false,
      ErrorPassword : false,
    }
  }




   async login(event){
    const { navigator } = this.context;
    let log=this.state.login;
     let pas=this.state.password;
     var user="unauthorized";

     if(log!='' && pas!=''){
      await login(log,pas).then(function(user){
           if(user.results){
              navigator.forward('menu');
             }else{
             console.warn('Incorrect Login or Password');
           }
     });
     }else{
     console.warn('Fill field');
     }
       // console.warn(JSON.stringify(user))

    };

static contextTypes = {
    navigator: PropTypes.object.isRequired,
    theme: React.PropTypes.string.isRequired
    }
    render(){

        const { theme, navigator } = this.context;
        const themeColor = COLOR[`${theme}500`].color;

       return (
             <View style={styles.container}>
                 <View style={styles.line}>
                    <Text style={styles.line1}> Login</Text>
                </View>
                <View style={styles.form}>
                     <TextInput
                         style={styles.textInput}
                         editable = {true}
                         placeholder = "Login"
                           ref="login"
                                onChangeText={login => this.setState({login})}
                               value={this.state.login}
                     />

                     <TextInput
                        style={styles.textInput}
                        editable = {true}
                        placeholder = "Password"
                        secureTextEntry={true}
                        ref="password"
                           onChangeText={password => this.setState({password})}
                            value={this.state.password}
                     />
                </View>
                <Button
                      text="Sign In"
                      theme = "dark"
                      raised={true}
                      overrides={{
                      textColor: '#ffffff',
                      backgroundColor: themeColor
                  }}
                  onPress={this.login.bind(this)}
               />


             </View>
       );
    }

}

   const styles={
      container: {
           flex: 1,
           flexDirection: 'column',
           flexWrap: 'wrap',
           // alignItems: 'center',
           justifyContent: 'space-between',
           backgroundColor: '#fff',
           backgroundColor: COLOR.googleGrey100.color,
           padding: 20
         },
           textInput:{
             height: 60,
             fontSize: 13,
             padding: 4,
             },

             line1:{
               fontWeight: 'bold',
               fontSize: 20,
               lineHeight: 35
            },

            line:{
              flexWrap:'wrap',
              justifyContent:'center',
              alignItems:'center',
            },

            form:{
            height:300,
            },

            error:{
             color:'#990000',
            }
}