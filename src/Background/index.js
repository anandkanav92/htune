import React , {Component}from 'react';
import {Input, Button} from 'semantic-ui-react'
import Select from 'react-select';
import styled from 'styled-components';
import './index.css';
import Cookies from "universal-cookie";
import {Server_Config} from './../server_config';
import {withRouter, Link} from 'react-router-dom';

const cookie = new Cookies();

const EducationOptions = [
    {label: 'High School', value: 'high_school'},
    {label: 'Bachelors', value: 'bachelors'},
    {label: 'Masters - currently enrolled', value: 'masters-first'},
    {label: 'Masters completed', value: 'masters-completed'},
    {label: 'Doctrate', value: 'doctrate'},

]

const Row = styled.div`

`;

const InputContainer = styled.div`

`;



const findSelectedOption = (options, value) => options.find(o => o.value === value) || null;

const findEducation = findSelectedOption.bind(null, EducationOptions);

const ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

class Background extends Component{


    constructor() {
      super();
      console.log(cookie);
      this.state = {
        fields: {
            education : cookie.get("education")?cookie.get("education"):'',
            experience : cookie.get("experience")?cookie.get("experience"):'',
            user_id : cookie.get("user_id")?cookie.get("user_id"):null,
        },
        errors: {},
        information_status : cookie.get("onboarded")=='true'?true:false,
        terms_agreed: cookie.get("terms_agreed")?cookie.get("terms_agreed"):null,
      }
      this.handleChange = this.handleChange.bind(this);
      this.submituserRegistrationForm = this.submituserRegistrationForm.bind(this);
      this.postData = this.postData.bind(this);
      this.nextPath = this.nextPath.bind(this);
      console.log(this.state.fields);
    };
    nextPath(path) {
      this.props.history.push(path);
    }
    async postData (data) {
        try{
            const response = await fetch("http://"+Server_Config.server_address+":"+Server_Config.port+"/save_backgroundinfo",
            {
                method: "POST",
                headers: {"Content-Type":"application/json",
                                    'Accept': 'application/json'},

                body: JSON.stringify(data),
                dataType:'jsonp'
            })
            const jsonData = await response.json();
            if (!response.ok) {
              throw Error(response.statusText);
            }
            console.log(jsonData)
            if (jsonData.user_id!== undefined) {
                cookie.set("onboarded", true, {path: "/"});
                cookie.set("user_id", jsonData.user_id, {path: "/"});
                cookie.set("experience", jsonData.experience, {path: "/"});
                cookie.set("education", jsonData.education, {path: "/"});
                let fields = {}
                fields['experience'] = jsonData.experience
                fields['education'] = jsonData.education
                console.log(cookie);
                this.setState({ fields: fields,information_status: true });
                this.nextPath('/tune');
                console.log(this.state);
            }
        } catch (error) {
            console.log(error);
        }
        /*.then(function(response) {
            return response.text().then(function(text) {
                return text ? JSON.parse(text) : {}
            })
        })
        .then(function(myJson) {
            cookie.set("onboarded", true, {path: "/"});
            cookie.set("user_id", myJson.user_id, {path: "/"});
            console.log(cookie);
        });*/
    }

    handleChange(e) {
      let fields = this.state.fields;
      fields[e.target.name] = e.target.value;
      this.setState({
        fields
      });

    }

    handleSelectChange = ({value}, {name}) => {
      let fields = this.state.fields;
      fields[name] = value  ;
      this.setState({
        fields
      });
      console.log(this);

    }


    submituserRegistrationForm(e) {
      e.preventDefault();
      console.log("submitting");
      if (this.validateForm()) {
          let fields = this.state.fields;
          this.postData(fields);
      }

    }

    validateForm() {

      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;

      if (!fields["education"]) {
        formIsValid = false;
        errors["education"] = "*Please enter your education level.";
      }
      if (!fields["experience"]) {
        formIsValid = false;
        errors["experience"] = "*Please enter your experience in Deep Learning.";
      }

      this.setState({
        errors: errors
      });
      return formIsValid;


    }

  render(){
    return (
        <>
          {(this.state.terms_agreed===false)}
          {(this.state.terms_agreed===null) && (<h1>Please agree to the Terms first!</h1>) }
          {(this.state.terms_agreed!==null) && (
            <div id="main-registration-container">
             <div id="register">
                <h3>Background Information</h3>
                <form method="post"  name="userRegistrationForm"  onSubmit= {this.submituserRegistrationForm} >
                    <label class="label-background">Experience with Deep Learning (in months)</label>
                    <input type="number" name="experience" value={this.state.fields.experience} onChange={this.handleChange} disabled={this.state.information_status}/>
                    <div className="errorMsg">{this.state.errors.experience}</div>
                    <label class="label-background">Highest education level:</label>
                        <Select
                            name="education"
                            placeholder="Select your Level"
                            options={EducationOptions}
                            value={findEducation(this.state.fields.education)}
                            onChange={this.handleSelectChange}
                            isDisabled={this.state.information_status}/>
                        <div className="errorMsg">{this.state.errors.education}</div>
                    <input type="submit" className="button"  value="Submit" hidden={this.state.information_status} />
                </form>
            </div>
        </div>
          )}
      </>
    );
  }

}

export default withRouter(Background);






