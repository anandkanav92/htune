export const LossFunctions = [
    {label: 'Cross Entropy', value: 'cross_entropy'},
    {label: 'L1 Loss', value: 'l1_loss'},
    {label: 'Mean Squared Loss', value: 'mean_squared_loss'},
    {label: 'Negative Loss Likelihood', value: 'negative_log_likelihood'},
];

export const Optimizers = [
    {label: 'Adam Optimizer', value: 'adam_optimizer'},
    {label: 'Ada Delta', value: 'ada_delta'},
    {label: 'Ada Gradient', value: 'ada_grad'},
    {label: 'Averaged Stochastic Gradient Descent', value: 'averaged_sgd'},
    {label: 'Root Mean Square Prop', value: 'rms_prop'},
    {label: 'Stochastic Gradient Descent', value: 'sgd'},
];

export const CommentOptions = [
    {label: 'It is just a guess.', value: 1},
    {label: 'It is the suggested default value.', value: 2},
    {label: 'It is the value that has worked well for me in the past.', value: 3},
    {label: 'It is the value I learnt from previous submissions ', value: 4},
    {label: 'Other', value: 5}
]

// {"epoch": {"comments": "", "value": 1.0}, "batch_size": {"comments": "", "value": 100.0}, "learning_rate": {"comments": "", "value": 0.0001}, "eps": {"comments": "", "value": 0.0001}, "weight_decay": {"comments": "", "value": 1e-05}, "rho": {"comments": "", "value": ""}, "lr_decay": {"comments": "", "value": ""}, "initial_accumulator_value": {"comments": "", "value": ""}, "alpha": {"comments": "", "value": 0.01}, "lambd": {"comments": "", "value": ""}, "momentum": {"comments": "", "value": 0.1}, "loss_function": {"comments": "", "value": "negative_log_likelihood"}, "optimizer": {"comments": "", "value": "rms_prop"}}
