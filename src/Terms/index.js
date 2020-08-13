import React , {Component} from 'react';
import {Input, Button} from 'semantic-ui-react'
import Cookies from "universal-cookie";
import {withRouter, Link} from 'react-router-dom';
import './index.css';

const cookie = new Cookies();


class Terms extends Component{

  state = {
      terms_agreed: cookie.get('terms_agreed')=='true'?true:false,
      terms_agreed_content: cookie.get('terms_agreed')?'Terms Agreed!':'',

  }

  nextPath(path) {
    this.props.history.push(path);
  }
  render(){
    return (
    <div class="container">
      <div class="page-header">
          <center><h1>Black Magic in Deep Learning</h1></center>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="row">
            <div class="col-md-12" >
              <center><h3>Delft University of Technology</h3></center>
            </div>
            <div class="col-md-12" >
              <div id="contract-area">
                <p>Welcome to the study that examines how one’s background and experience can affect the final accuracy of a deep learning model. Before taking part in the study, please read this consent form carefully and click on the <b> I Agree </b> button at the bottom of the page only if you understand the statements and freely consent to participate in the study.</p>
                <p>The purpose of this study is to evaluate how having a prior knowledge and experience in the field of deep learning impact the choices made while tuning the hyperparameters of a deep learning model and the final performance. The experiment is conducted by Kanav Anand, MSc student at the Delft University of Technology for pure research purposes.</p>
                <p>Your participation in the experiment is voluntary. If you are not suitable for the experiment or/and decide to not participate in this study or withdraw in the middle of the experiment, you will not be penalized. You do not have to give an explanation for your withdrawal.</p>
                <p>Participation in the study will take approximately 60-120 minutes. It involves the following steps:</p>
                <ul>
                  <li>The first step is to familiarize with the problem in hand.</li>
                  <li>The second step requires you to fill in some educational background information. These responses are confidential and will be used only for research purposes.</li>
                  <li>The third step requires you to submit values of hyperparameters. After submission you can view the intermediate training results.</li>
                  <li> The final step is to submit the optimal values of hyperparameters found during this experiment.</li>

                </ul>
                 <p>To protect your confidentiality, this study is fully anonymous and does not include any information that could identify you personally. The results of this study will only be used for research purposes. If you have any further questions related to this study, don’t hesitate to contact Kanav Anand (k.anand@student.tudelft.nl).</p>

                <p>This research has been reviewed by TU Delft’s Human Research Ethics Committee.</p>

                <p><b> If you are 18 years of age or older, understand the statements above and freely consent to participate in our please, click on I Agree button to begin the study. </b> </p>
              </div>

                </div>
            </div>
        </div>

    </div>
    <div class="row">
      <center>
        <Button  primary disabled={this.state.terms_agreed}


          onClick={(e) => {
            e.preventDefault();
            cookie.set('terms_agreed',true, {path: "/"});
            this.setState({
              terms_agreed : true,
              terms_agreed_content : 'Terms Agreed!'
            });
            this.nextPath('/about');

            }}>I AGREE</Button>
          <div className="errorMsg" > {this.state.terms_agreed_content}</div>
      </center>
    </div>

</div>
    );
  }

}

export default withRouter(Terms);






