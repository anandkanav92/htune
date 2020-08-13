import React from 'react';
import {Input, Button, Transition, Checkbox, Segment} from 'semantic-ui-react'
import Select from 'react-select';
import styled from 'styled-components';
import {Optimizers, LossFunctions, CommentOptions} from './data';
import Cookies from "universal-cookie";
import './index.css';
import {Server_Config} from './../server_config';

const cookie = new Cookies();

const Row = styled.div`
    display: flex;
    flex-direction: row;
`;

const InputContainer = styled.div`
    padding: 10px;
    flex-basis: 40%;
    flex-grow: 0;
`;

const CommentContainer = styled.div`
    padding: 10px;
    flex-grow: 1;
`;

const findSelectedOption = (options, value) => options.find(o => o.value === value) || null;

const findSelectedLossFunction = findSelectedOption.bind(null, LossFunctions);

const findSelectedOptimizer = findSelectedOption.bind(null, Optimizers);

const findComment = findSelectedOption.bind(null, CommentOptions);



// const cancelJob = function (user_id) {
//     fetch("http://"+Server_Config.server_address+":"+Server_Config.port+"/cancel_job?user_id="+user_id,
//     {
//         method: "GET",
//         headers: {"Content-Type":"application/json"},
//         mode: 'no-cors'
//     })
//     .then(function(res){
//     })
//     .then(function(data){ console.log( "cancelJob"+JSON.stringify( data ) ) });
// }

const formData = obj => Object.keys(obj).reduce((res, val) => {

    const label_array = val.split("_");
    //console.log(res);
    if (res[label_array[0]] === undefined) {
        res[val] = {};
    }
    if ( label_array.length>2 ) {
        console.log(res);
        res[label_array[0]]["comment_other"] = obj[val];
    } else if (label_array.length>1) {
        console.log(res);
        res[label_array[0]][label_array[1]] = obj[val];
    }
    else {
        res[val]["value"] = obj[val];
    }

    return res;
}, {})

const initialSecondaryState = {
    learningRate: '',
    learningRate_comment: '',
    epsilon: '',
    beta1: '',
    beta2: '',
    epsilon_comment: '',
    weightDecay: '',
    weightDecay_comment: '',
    rho: '',
    rho_comment: '',
    learningRateDecay: '',
    learningRateDecay_comment: '',
    initialAccumulator: '',
    initialAccumulator_comment: '',
    alpha: '',
    alpha_comment: '',
    lambda: '',
    lambda_comment: '',
    momentum: '',
    momentum_comment: '',
    learningRate_comment_other : '',
    epsilon_comment_other : '',
    weightDecay_comment_other : '',
    rho_comment_other : '',
    learningRateDecay_comment_other : '',
    initialAccumulator_comment_other : '',
    alpha_comment_other : '',
    lambda_comment_other : '',
    momentum_comment_other : '',
    beta1_comment_other : '',
    beta2_comment_other : '',
    beta1_comment : '',
    beta2_comment : '',

}

class Tune extends React.Component{
    constructor() {
        super();
        this.state = {
            fields : {
                epochs: '',
                epochs_comment: '',
                epochs_comment_other: '',
                batchSize: '',
                batchSize_comment: '',
                batchSize_comment_other: '',
                lossFunction: '',
                lossFunction_comment: '',
                lossFunction_comment_other: '',
                optimizer: '',
                optimizer_comment: '',
                optimizer_comment_other: '',
                finalSubmission: false,
                ...initialSecondaryState
            },
            errors : {},

        };
        this.keys = Object.keys(this.state.fields)
        var self = this
        this.keys.forEach(function(element) {
            // console.log(cookie);
            if ( element.endsWith('_comment')) {
                if (cookie.get(element)){
                    console.log(cookie.get(element));
                    console.log(Number(cookie.get(element)))
                    self.state.fields[element] = Number(cookie.get(element))
                }
            } else {
                if (cookie.get(element)){
                    self.state.fields[element] = cookie.get(element)
                }
            }
        });
        this.isTraining = cookie.get("isTraining")?(cookie.get("isTraining")=='true'):false;
        this.user_id =  cookie.get("user_id")?cookie.get("user_id"):null;
        if (this.isTraining) {
            this.startPolling(this.user_id);
        } else {
            this.timer = null;
        }
        console.log(this);

    };

    async postData (data,user_id) {

        data['user_id'] = user_id;
        console.log(data);
        var response = await fetch("http://"+Server_Config.server_address+":"+Server_Config.port+"/run_model",
                                   {
                                        method: 'POST',
                                        headers: {"Content-Type":"application/json"},
                                        body: JSON.stringify(data),
                                    });
        const json = await response.json();
        console.log(json);
        if ( json !== undefined ) {
            if ( json['status'] == 0) {
                alert("Submitted Succesfully! Thanks for the help!")
            }
            if ( json['status'] == 1) {
                alert("Submission failed. Please try to submit again!")
            }
        }

        /*fetch("http://"+Server_Config.server_address+":"+Server_Config.port+"/run_model",
        {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(data),
            mode: 'no-cors'
        })
        .then(function(res){

            // $("#main-content").fadeOut(2000);
            // $("#viz_link_container").fadeIn(2000);

        })
        .then(function(data){ console.log( "aas"+JSON.stringify( data ) ) });*/
    }


    async cancelJob (user_id) {
        const response = await fetch("http://"+Server_Config.server_address+":"+Server_Config.port+"/cancel_job?user_id="+user_id,{method: 'GET'});
        const json = await response.json();
        if ( json !== undefined ) {
            this.isTraining = false;
            this.stopPolling();
            console.log(json);
        }
    }

    startPolling (user_id) {
      this.timer = setInterval(()=> this.getItems(user_id), 15*1000);
    }

    stopPolling () {
        clearInterval(this.timer);
        this.timer = null
        this.isTraining = false
        this.setState({
            fields: this.state.fields
        });
        this.setCookies(this.isTraining);
    }


    async getItems (user_id) {
        var self = this;
        var response = await fetch("http://"+Server_Config.server_address+":"+Server_Config.port+"/get_status?user_id="+user_id,{method: 'GET'});
        const json = await response.json();
        if ( json !== undefined ) {
            if ( json['status'] == 1) {
                self.stopPolling();
            }
        }
    }

    setCookies(isTraining) {
        var self = this;
        this.keys.forEach(function(element) {
            if (!element.endsWith('submission')) {
                if ( self.state.fields[element]) {
                    cookie.set(element,self.state.fields[element], {path: "/"});
                }
            }
        });
        cookie.set("isTraining",isTraining, {path: "/"});
        console.log(cookie);
    }


    validateForm() {

        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
        let compulsoryFields = ['epochs','batchSize','lossFunction','optimizer']
        let other_comments_text = ['epochs_comment','batchSize_comment','lossFunction_comment','optimizer_comment','learningRate_comment','epsilon_comment','weightDecay_comment','rho_comment','learningRateDecay_comment','initialAccumulator_comment','alpha_comment','lambda_comment','momentum_comment','beta1_comment','beta2_comment']
        compulsoryFields.forEach(function(element) {
            // console.log(element);
            if (!fields[element]) {
                formIsValid = false;
                errors[element] = "*this field is required.";
            }
        });
        other_comments_text.forEach(function(element) {
            console.log(element);
            if (fields[element] == 5) {
                if ( !fields[element+'_other']) {
                    formIsValid = false;
                    errors[element+'_other'] = "*this field is required.";
                }
            }
        });

        this.setState({
        errors: errors
        });
        return formIsValid;

    }
    // this.user_id =  cookie.get("user_id")?cookie.get("user_id"):null;
    toggleCheckBox = () => {
        this.state.fields.finalSubmission = !(this.state.fields.finalSubmission);
        this.setState({fields: this.state.fields});
        console.log(this.state.fields.finalSubmission);
    }

    handleInputChange = event => {
        this.state.fields[event.target.name] = event.target.value
        this.setState({
            fields: this.state.fields
        });
        console.log(event);
    }

    handleSelectChange = ({value}, {name}) => {
        this.state.fields[name] = value;
        this.setState({
            fields: this.state.fields
        });
        if(name === 'optimizer') {
            this.setState(fields => ({
                ...fields,
                ...initialSecondaryState
            }));
        }
        if (name.includes("_comment")) {

        }
    }

    render() {
        console.log(this.state);
        const {epochs, batchSize, lossFunction, optimizer, learningRate, epsilon, weightDecay, rho, learningRateDecay, initialAccumulator, alpha, lambda, momentum, epochs_comment, batchSize_comment, lossFunction_comment, optimizer_comment, learningRate_comment, epsilon_comment, weightDecay_comment, rho_comment, learningRateDecay_comment, initialAccumulator_comment, alpha_comment, lambda_comment, momentum_comment, finalSubmission, epochs_comment_other,batchSize_comment_other,lossFunction_comment_other,optimizer_comment_other,learningRate_comment_other,epsilon_comment_other,weightDecay_comment_other,rho_comment_other,learningRateDecay_comment_other,initialAccumulator_comment_other,alpha_comment_other,lambda_comment_other,momentum_comment_other,beta2_comment,beta1_comment,beta2_comment_other,beta1_comment_other,beta1,beta2} = this.state.fields;
        return (
        <>
            {(this.user_id === null) && (<h1>Fill in your background information!</h1>)}
            {(this.user_id !== null) && (
                <form disabled>
                <fieldset disabled={this.isTraining}>
                <Row >

                    <label>Epochs:</label>
                    <InputContainer>
                        <Input
                            name="epochs"
                            placeholder="Enter Number of Epochs"
                            type="number"
                            fluid
                            value={epochs}
                            onChange={this.handleInputChange}
                        />
                        <div className="errorMsg">{this.state.errors.epochs}</div>

                    </InputContainer>
                    <CommentContainer>
                        <Select
                            name="epochs_comment"
                            placeholder="Select your Comment"
                            options={CommentOptions}
                            value={findComment(epochs_comment)}
                            onChange={this.handleSelectChange}/>
                       { (epochs_comment == 5 ) && (
                        <Input
                            className = "other_comment_container"
                            name="epochs_comment_other"
                            placeholder="Please enter your comment here"
                            type="text"
                            fluid
                            value={epochs_comment_other}
                            onChange={this.handleInputChange}
                        />
                        )}
                        <div className="errorMsg">{this.state.errors.epochs_comment_other}</div>

                    </CommentContainer>
                </Row>

                <Row >
                    <label>Batch Size:</label>
                    <InputContainer>
                        <Input
                            name="batchSize"
                            placeholder="Enter Batch Size"
                            type="number"
                            fluid
                            value={batchSize}
                            onChange={this.handleInputChange}
                        />
                        <div className="errorMsg">{this.state.errors.batchSize}</div>
                    </InputContainer>
                    <CommentContainer>
                        <Select
                            name="batchSize_comment"
                            placeholder="Select your Comment"
                            options={CommentOptions}
                            value={findComment(batchSize_comment)}
                            onChange={this.handleSelectChange}/>
                        { (batchSize_comment == 5 ) && (
                        <Input
                            className = "other_comment_container"
                            name="batchSize_comment_other"
                            placeholder="Please enter your comment here"
                            type="text"
                            fluid
                            value={batchSize_comment_other}
                            onChange={this.handleInputChange}
                        />
                        )}
                        <div className="errorMsg">{this.state.errors.batchSize_comment_other}</div>
                    </CommentContainer>
                </Row>

                <Row >
                    <label>Loss Function:</label>
                    <InputContainer>
                        <Select
                            name="lossFunction"
                            placeholder="Select Loss Function"
                            options={LossFunctions}
                            value={findSelectedLossFunction(lossFunction)}
                            onChange={this.handleSelectChange}
                        />
                        <div className="errorMsg">{this.state.errors.lossFunction}</div>
                    </InputContainer>
                    <CommentContainer>
                        <Select
                            name="lossFunction_comment"
                            placeholder="Select your Comment"
                            options={CommentOptions}
                            value={findComment(lossFunction_comment)}
                            onChange={this.handleSelectChange}/>
                        { (lossFunction_comment == 5 ) && (
                        <Input
                            className = "other_comment_container"
                            name="lossFunction_comment_other"
                            placeholder="Please enter your comment here"
                            type="text"
                            fluid
                            value={lossFunction_comment_other}
                            onChange={this.handleInputChange}
                        />
                        )}
                        <div className="errorMsg">{this.state.errors.lossFunction_comment_other}</div>

                    </CommentContainer>
                </Row>

                <Row >
                    <label>Optimizer:</label>
                    <InputContainer>
                        <Select
                            name="optimizer"
                            placeholder="Select type of Optimizer"
                            options={Optimizers}
                            value={findSelectedOptimizer(optimizer)}
                            onChange={this.handleSelectChange}
                        />
                        <div className="errorMsg">{this.state.errors.optimizer}</div>
                    </InputContainer>
                    <CommentContainer>
                        <Select
                            name="optimizer_comment"
                            placeholder="Select your Comment"
                            options={CommentOptions}
                            value={findComment(optimizer_comment)}
                            onChange={this.handleSelectChange}/>
                        { (optimizer_comment == 5 ) && (
                        <Input
                            className = "other_comment_container"
                            name="optimizer_comment_other"
                            placeholder="Please enter your comment here"
                            type="text"
                            fluid
                            value={optimizer_comment_other}
                            onChange={this.handleInputChange}
                        />
                        )}
                        <div className="errorMsg">{this.state.errors.optimizer_comment_other}</div>
                    </CommentContainer>
                </Row>

                {(optimizer === 'adam_optimizer' || optimizer === 'ada_delta' || optimizer === 'ada_grad' || optimizer === 'averaged_sgd' || optimizer === 'rms_prop' || optimizer === 'sgd') && (
                    <Row >
                        <label>Learning Rate:</label>
                        <InputContainer>
                            <Input
                                name="learningRate"
                                placeholder="Enter Learning Rate"
                                type="number"
                                fluid
                                value={learningRate}
                                onChange={this.handleInputChange}
                            />
                        </InputContainer>
                        <CommentContainer>
                            <Select
                                name="learningRate_comment"
                                placeholder="Select your Comment"
                                options={CommentOptions}
                                value={findComment(learningRate_comment)}
                                onChange={this.handleSelectChange}/>
                        { (learningRate_comment == 5 ) && (
                        <Input
                            className = "other_comment_container"
                            name="learningRate_comment_other"
                            placeholder="Please enter your comment here"
                            type="text"
                            fluid
                            value={learningRate_comment_other}
                            onChange={this.handleInputChange}
                        />
                        )}
                        <div className="errorMsg">{this.state.errors.learningRate_comment_other}</div>
                        </CommentContainer>
                    </Row>
                )}

                {(optimizer === 'adam_optimizer' || optimizer === 'ada_delta' || optimizer === 'rms_prop') && (
                    <Row >
                        <label>Epsilon:</label>
                        <InputContainer>
                            <Input
                                name="epsilon"
                                placeholder="Enter Epsilon Value"
                                type="number"
                                fluid
                                value={epsilon}
                                onChange={this.handleInputChange}
                            />
                        </InputContainer>
                        <CommentContainer>
                            <Select
                                name="epsilon_comment"
                                placeholder="Select your Comment"
                                options={CommentOptions}
                                value={findComment(epsilon_comment)}
                                onChange={this.handleSelectChange}/>
                            { (epsilon_comment == 5 ) && (
                        <Input
                            className = "other_comment_container"
                            name="epsilon_comment_other"
                            placeholder="Please enter your comment here"
                            type="text"
                            fluid
                            value={epsilon_comment_other}
                            onChange={this.handleInputChange}
                        />
                        )}
                        <div className="errorMsg">{this.state.errors.epsilon_comment_other}</div>
                        </CommentContainer>
                    </Row>
                )}

                {(optimizer === 'adam_optimizer' || optimizer === 'ada_delta' || optimizer === 'ada_grad' || optimizer === 'averaged_sgd' || optimizer === 'rms_prop' || optimizer === 'sgd') && (
                    <Row >
                        <label>Weight Decay:</label>
                        <InputContainer>
                            <Input
                                name="weightDecay"
                                placeholder="Enter Weight Decay Value"
                                type="number"
                                fluid
                                value={weightDecay}
                                onChange={this.handleInputChange}
                            />
                        </InputContainer>
                        <CommentContainer>
                            <Select
                                name="weightDecay_comment"
                                placeholder="Select your Comment"
                                options={CommentOptions}
                                value={findComment(weightDecay_comment)}
                                onChange={this.handleSelectChange}/>
                            { (weightDecay_comment == 5 ) && (
                        <Input
                            className = "other_comment_container"
                            name="weightDecay_comment_other"
                            placeholder="Please enter your comment here"
                            type="text"
                            fluid
                            value={weightDecay_comment_other}
                            onChange={this.handleInputChange}
                        />
                        )}
                        <div className="errorMsg">{this.state.errors.weightDecay_comment_other}</div>
                        </CommentContainer>
                    </Row>
                )}

                {(optimizer === 'ada_delta') && (
                    <Row >
                        <label>RHO:</label>
                        <InputContainer>
                            <Input
                                name="rho"
                                placeholder="Enter RHO Value"
                                type="number"
                                fluid
                                value={rho}
                                onChange={this.handleInputChange}
                            />
                        </InputContainer>
                        <CommentContainer>
                            <Select
                                name="rho_comment"
                                placeholder="Select your Comment"
                                options={CommentOptions}
                                value={findComment(rho_comment)}
                                onChange={this.handleSelectChange}/>
                                { (rho_comment == 5 ) && (
                        <Input
                            className = "other_comment_container"
                            name="rho_comment_other"
                            placeholder="Please enter your comment here"
                            type="text"
                            fluid
                            value={rho_comment_other}
                            onChange={this.handleInputChange}
                        />
                        )}
                        <div className="errorMsg">{this.state.errors.rho_comment_other}</div>
                        </CommentContainer>
                    </Row>
                )}

                {(optimizer === 'ada_grad') && (
                    <Row >
                        <label>Learning Rate Decay:</label>
                        <InputContainer>
                            <Input
                                name="learningRateDecay"
                                placeholder="Enter Learning Rate Decay"
                                type="number"
                                fluid
                                value={learningRateDecay}
                                onChange={this.handleInputChange}
                            />
                        </InputContainer>
                        <CommentContainer>
                            <Select
                                name="learningRateDecay_comment"
                                placeholder="Select your Comment"
                                options={CommentOptions}
                                value={findComment(learningRateDecay_comment)}
                                onChange={this.handleSelectChange}/>
                            { (learningRateDecay_comment == 5 ) && (
                        <Input
                            className = "other_comment_container"
                            name="learningRateDecay_comment_other"
                            placeholder="Please enter your comment here"
                            type="text"
                            fluid
                            value={learningRateDecay_comment_other}
                            onChange={this.handleInputChange}
                        />
                        )}
                        <div className="errorMsg">{this.state.errors.learningRateDecay_comment_other}</div>
                        </CommentContainer>
                    </Row>

                )}

                {(optimizer === 'ada_grad') && (
                    <Row >
                        <label>Initial Accumulator Value:</label>
                        <InputContainer>
                            <Input
                                name="initialAccumulator"
                                placeholder="Enter Initial Accumulator"
                                type="number"
                                fluid
                                value={initialAccumulator}
                                onChange={this.handleInputChange}
                            />
                        </InputContainer>
                        <CommentContainer>
                            <Select
                                name="initialAccumulator_comment"
                                placeholder="Select your Comment"
                                options={CommentOptions}
                                value={findComment(initialAccumulator_comment)}
                                onChange={this.handleSelectChange}/>
                                { (initialAccumulator_comment == 5 ) && (
                        <Input
                            className = "other_comment_container"
                            name="initialAccumulator_comment_other"
                            placeholder="Please enter your comment here"
                            type="text"
                            fluid
                            value={initialAccumulator_comment_other}
                            onChange={this.handleInputChange}
                        />
                        )}
                        <div className="errorMsg">{this.state.errors.initialAccumulator_comment_other}</div>
                        </CommentContainer>
                    </Row>

                )}

                {(optimizer === 'averaged_sgd' || optimizer === 'rms_prop') && (
                    <Row >
                        <label>Alpha:</label>
                        <InputContainer>
                            <Input
                                name="alpha"
                                placeholder="Enter Alpha Value"
                                type="number"
                                fluid
                                value={alpha}
                                onChange={this.handleInputChange}
                            />
                        </InputContainer>
                        <CommentContainer>
                            <Select
                                name="alpha_comment"
                                placeholder="Select your Comment"
                                options={CommentOptions}
                                value={findComment(alpha_comment)}
                                onChange={this.handleSelectChange}/>
                                { (alpha_comment == 5 ) && (
                        <Input
                            className = "other_comment_container"
                            name="alpha_comment_other"
                            placeholder="Please enter your comment here"
                            type="text"
                            fluid
                            value={alpha_comment_other}
                            onChange={this.handleInputChange}
                        />
                        )}
                        <div className="errorMsg">{this.state.errors.alpha_comment_other}</div>
                        </CommentContainer>
                    </Row>

                )}

                {(optimizer === 'averaged_sgd') && (
                    <Row >
                        <label>Lambda:</label>
                        <InputContainer>
                            <Input
                                name="lambda"
                                placeholder="Enter Lambda Value"
                                type="number"
                                fluid
                                value={lambda}
                                onChange={this.handleInputChange}
                            />
                        </InputContainer>
                        <CommentContainer>
                            <Select
                                name="lambda_comment"
                                placeholder="Select your Comment"
                                options={CommentOptions}
                                value={findComment(lambda_comment)}
                                onChange={this.handleSelectChange}/>
                                { (lambda_comment == 5 ) && (
                        <Input
                            className = "other_comment_container"
                            name="lambda_comment_other"
                            placeholder="Please enter your comment here"
                            type="text"
                            fluid
                            value={lambda_comment_other}
                            onChange={this.handleInputChange}
                        />
                        )}
                        <div className="errorMsg">{this.state.errors.lambda_comment_other}</div>
                        </CommentContainer>
                    </Row>

                )}

                {(optimizer === 'rms_prop' || optimizer === 'sgd') && (
                    <Row >
                        <label>Momentum:</label>
                        <InputContainer>
                            <Input
                                name="momentum"
                                placeholder="Enter Momentum Value"
                                type="number"
                                fluid
                                value={momentum}
                                onChange={this.handleInputChange}
                            />
                        </InputContainer>
                        <CommentContainer>
                            <Select
                                name="momentum_comment"
                                placeholder="Select your Comment"
                                options={CommentOptions}
                                value={findComment(momentum_comment)}
                                onChange={this.handleSelectChange}/>
                            { (momentum_comment == 5 ) && (
                        <Input
                            className = "other_comment_container"
                            name="momentum_comment_other"
                            placeholder="Please enter your comment here"
                            type="text"
                            fluid
                            value={momentum_comment_other}
                            onChange={this.handleInputChange}
                        />
                        )}
                        <div className="errorMsg">{this.state.errors.momentum_comment_other}</div>
                        </CommentContainer>
                    </Row>

                )}

                {(optimizer === 'adam_optimizer') && (
                    <Row >
                        <label>Beta1:</label>
                        <InputContainer>
                            <Input
                                name="beta1"
                                placeholder="Enter Beta1 Value"
                                type="number"
                                fluid
                                value={beta1}
                                onChange={this.handleInputChange}
                            />
                        </InputContainer>
                        <CommentContainer>
                            <Select
                                name="beta1_comment"
                                placeholder="Select your Comment"
                                options={CommentOptions}
                                value={findComment(beta1_comment)}
                                onChange={this.handleSelectChange}/>
                            { (beta1_comment == 5 ) && (
                        <Input
                            className = "other_comment_container"
                            name="beta1_comment_other"
                            placeholder="Please enter your comment here"
                            type="text"
                            fluid
                            value={beta1_comment_other}
                            onChange={this.handleInputChange}
                        />
                        )}
                        <div className="errorMsg">{this.state.errors.beta1_comment_other}</div>
                        </CommentContainer>
                    </Row>

                )}

                {(optimizer === 'adam_optimizer') && (
                    <Row >
                        <label>Beta2:</label>
                        <InputContainer>
                            <Input
                                name="beta2"
                                placeholder="Enter Beta2 Value"
                                type="number"
                                fluid
                                value={beta2}
                                onChange={this.handleInputChange}
                            />
                        </InputContainer>
                        <CommentContainer>
                            <Select
                                name="beta2_comment"
                                placeholder="Select your Comment"
                                options={CommentOptions}
                                value={findComment(beta2_comment)}
                                onChange={this.handleSelectChange}/>
                            { (beta2_comment == 5 ) && (
                        <Input
                            className = "other_comment_container"
                            name="beta2_comment_other"
                            placeholder="Please enter your comment here"
                            type="text"
                            fluid
                            value={beta2_comment_other}
                            onChange={this.handleInputChange}
                        />
                        )}
                        <div className="errorMsg">{this.state.errors.beta2_comment_other}</div>
                        </CommentContainer>
                    </Row>

                )}

                <Row >
                    <InputContainer>
                        <Button
                          loading={this.isTraining}
                          primary
                          fluid
                          onClick={(e) => {
                             e.preventDefault();
                             console.log(formData(this.state.fields))
                             if ( this.validateForm() ) {
                                this.postData(formData(this.state.fields),this.user_id);
                                this.isTraining=true;
                                this.setCookies(this.isTraining);
                                this.startPolling(this.user_id)
                             }
                            }}>Submit Job</Button>

                    </InputContainer>
                    <CommentContainer>
                            <Checkbox name="finalSubmission" checked={finalSubmission} label= "Select this to indicate your final submission" onChange={this.toggleCheckBox}/>

                        </CommentContainer>
                    </Row>
                </fieldset>
            </form>
            )}
            <Transition visible={this.isTraining}  animation='scale' duration={500}>
              <div class="row">
                  <center>
                    <Button  loading={false} color='teal'

                      onClick={(e) => {
                            window.open("http://"+Server_Config.visdom_address+":"+Server_Config.visdom_port+"/", "_blank");

                        }}>Training in progress! Click here to see intermediate results</Button>

                    <Button  loading={false} color='red'
                        onClick={(e) => {
                            this.cancelJob(this.user_id);
                        }}>Cancel training of the model</Button>
                  </center>
                </div>
            </Transition>

     </>

        )
    }

}

export default Tune;
