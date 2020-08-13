import React , {Component} from 'react';
import {Input, Button} from 'semantic-ui-react'
import Cookies from "universal-cookie";
import {withRouter, Link} from 'react-router-dom';
import './index.css';
// import Img from

const cookie = new Cookies();

class About extends Component{
    state = {
        terms_agreed: cookie.get('terms_agreed')?cookie.get('terms_agreed'):false,
        terms_agreed_content: cookie.get('terms_agreed')?'Terms Agreed!':'',
    }

    nextPath(path) {
        this.props.history.push(path);
    }

    render(){
        return (
                <div class="container">
                    <div class="page-header">
                      <center><h1>Experiment Details</h1></center>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-12" >

                                </div>
                                <div class="col-md-12" >
                                    <h3><u>Task in hand</u></h3>
                                    <div id="contract-area">
                                        <p>The task is to find the optimal set of hyperparameters maximizing the final performance metric, that is, the accuracy of the model on the test set. You will be asked to submit the values of different hyperparameters exposed by the model using a form. We encourage you to use the comments field next to each  hyperparameter to submit your line of thoughts. Upon submission you can view intermediate performance (loss value) of the model on the training data for each batch and epoch. You can use these intermediate results to pre-maturely end the training and submit new choice for the hyperparameters. After training of the model is finished, the accuracy of the model on validation set is displayed in the results tab.
                                        </p>
                                        <p>
                                            This task can be repeated over multiple times until you think the performance cannot be improved further by updating Hyperparameter values or time limit is reached. In order to submit your final choice of hyperparameters, select the checkbox next to the submit button.
                                        </p>
                                        <img src="./flow-160.png" />
                                    </div>
                                </div>
                                <div class="col-md-12" >
                                    <h3><u>Hyperparameters used</u></h3>
                                    <div id="contract-area">
                                        <p>The hyperparameters involved in the experiment are divided into two categories, mandatory and non-mandatory. The mandatory hyperparameters are necessary and required to train the model where as non-mandatory hyperparameters are subjected to the choice of your optimizer algorithm. If not specified, the default values for these non-mandatory hyperparameters are used to train the model. However, dividing these hyperparameters into these categories does not necessarily mean that mandatory hyperparameters are more important and impact the performance of the model more than other category.
                                        </p>
                                        <p>A brief information and default-values (used by PyTorch) is provided below for each Hyperparameter:
                                        </p>
                                        <h5><u>Mandatory hyperparameters</u></h5>
                                        <ul>
                                            <li><b>Epoch</b> : epoch is defined as the number of iterations over the dataset. Minimum value is 1.
                                            </li>
                                            <li>
                                                <b>Batch size</b> : batch size is the total number of training samples present in a single batch. Minimum value is 1.
                                            </li>
                                            <li>
                                                <b>Loss function</b> : Every model learn by means of a loss function. It is a method of evaluating how well the model has learnt the given data. If the prediction deviates too much from truth results, loss function is usually high. There are different types of loss function available to choose from and each options is explained below:
                                                    <ul>
                                                        <li><b>Cross entropy</b> : Cross entropy loss, or log loss, measures the performance of a classification model whose output is a probability value between 0 and 1. Cross-entropy loss increases as the predicted probability diverges from the actual label. So predicting a probability of 0.1 when the actual observation label is 1 would be bad and result in a high loss value. A perfect model would have a log loss of 0. </li>
                                                        <li><b>L1 loss</b> : It is also known as L1-norm loss function. L1 loss is basically minimizing the sum of the absolute differences between the target value and the estimated values. A perfect model would have a log loss of 0. </li>
                                                        <li><b>Mean squared loss</b> :  It is also known as L2-norm loss function. It is basically minimizing the sum of the square of the differences between the target value and the estimated values.</li>
                                                        <li><b>Negative likelihood</b> : The negative log-likelihood becomes high at smaller values, where it can reach infinite loss, and becomes less at larger values.</li>

                                                    </ul>
                                            </li>
                                            <li>
                                                <b>Optimizer  algorithm</b> :  During the training process, we tweak and change the parameters (weights) of our model to try and minimize that loss function, and make our predictions as correct as possible. But how exactly do you do that? How do you change the parameters of your model, by how much, and when? Optimizer together the loss function and model parameters by updating the model in response to the output of the loss function. In simpler terms, optimizers shape and mold your model into its most accurate possible form. The available choices for the Optimizer are explained below:
                                                    <ul>

                                                        <li><b>Adam optimizer</b>
                                                         </li>
                                                        <li><b>Adadelta</b>
                                                         </li>
                                                        <li><b>Averaged stochastic gradient</b>
                                                         </li>
                                                        <li><b>RMSprop</b>
                                                        </li>
                                                        <li><b>Stochastic gradient</b>
                                                         </li>
                                                        <li><b>Adagrad</b>
                                                         </li>

                                                    </ul>
                                            </li>
                                            </ul>

                                            <h5><u>Non-mandatory hyperparameters</u></h5>
                                        <ul>
                                                <li> <b>Learning rate</b> : Learning rate is a hyper-parameter that controls how much we are adjusting the weights of our network with respect the loss gradient. It is used by <b>all</b> optimization algorithms mentioned above. (Default value: 0.001)
                                                </li>
                                                <li> <b>Weight decay</b> : When training neural networks, it is common to use weight decay, where after each update, the weights are multiplied by a factor slightly less than 1. This prevents the weights from growing too large, and can be seen as gradient descent on a quadratic regularization term. It is used by <b>all</b> optimization algorithms mentioned above. (Default value: 0)</li>
                                                <li> <b>Rho</b> : Rho is a coefficient used for computing a running average of squared gradients. It is used only by <b>Adadelta</b> optimization algorithm. (Default value: 0.9)</li>

                                                <li> <b>Lambda</b> : Lambd is used as a decay term for gradient update. It is used by <b>avg_sgd</b>. (Default value: 0)</li>
                                                <li> <b>Alpha</b> : Alpha is used as a smoothing constant. It is used by <b>rms,avg_sgd</b>. (Default value: 0.99)</li>
                                                <li> <b>Epsilon</b> : Sometimes the value of gradient could be really close to 0. Then, the value of the weights could blow up. To prevent the gradients from blowing up, epsilon could be included in the denominator. It is used by <b>rms,adam,adadelta</b>. (Default value: 0.00001)</li>
                                                <li> <b>Momentum</b> Momentum helps accelerate gradients vectors in the right directions, thus leading to faster converging. It is used by <b>rms and sgd</b>. (Default value: 0)</li>
                                                <li> <b>Learning rate decay</b> :  It specifies the rate of decay for your learning rate. It is used by <b>Adagrad</b>. (Default value: 0)
                                                </li>
                                                <li> <b>Initial Aaccumulator value</b> : It defines the starting values for accumulate gradient and accumulate updates. It is used by only <b>adagrad</b>. (Default value: 0)</li>
                                                <li> <b>Beta1 and Beta2</b>:These are the coefficients used for computing running averages of gradient and its square. It is used by <b>Adam</b>. (Default value: 0.9, 0.999)
                                                </li>


                                        </ul>


                                    </div>
                                    <h3><u>References</u></h3>
                                    <ol>
                                        <li>http://www.chioka.in/differences-between-l1-and-l2-as-loss-function-and-regularization/</li>
                                        <li>https://ml-cheatsheet.readthedocs.io/en/latest/loss_functions.html#mae-l1</li>
                                        <li>https://pytorch.org/docs/stable/index.html</li>
                                        <li>https://metacademy.org/graphs/concepts/weight_decay_neural_networks               </li>
                                    </ol>



                                </div>
                            </div>
                        </div>
                    </div>
                                        <div class="row">
                                            <Button  primary



                                              onClick={(e) => {
                                                    e.preventDefault();
                                                    this.nextPath('/backgroundinfo');
                                                }}>Next</Button>
                                        </div>

                </div>
        );
    }
}
export default withRouter(About);
