import React from 'react';
import { useFetch } from "./hooks";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Cookies from "universal-cookie";
import {Server_Config} from './../server_config';

const cookie = new Cookies();

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});


/*function createData(epochs, batchSize, lossFunction, optimizer, learningRate, epsilon, weightDecay, rho, learningRateDecay, initialAccumulator, alpha, lambda, momentum, accuracy) {
  id += 1;
  return { id, epochs.value, batchSize.value, lossFunction.value, optimizer.value, learningRate.value, epsilon.value, weightDecay.value, rho.value, learningRateDecay.value, initialAccumulator.value, alpha.value, lambda.value, momentum.value, accuracy};
}*/

// function createData1(params,accuracy) {
//   id += 1;
//   return { id, params.epochs.value, params.batchSize.value, params.lossFunction.value, params.optimizer.value, params.learningRate.value, params.epsilon.value, params.weightDecay.value, params.rho.value, params.learningRateDecay.value, params.initialAccumulator.value, params.alpha.value, params.lambda.value, params.momentum.value, accuracy};
// }


// const Results = () => (<div>Results</div>);
function CustomizedTable(props) {
  const { classes } = props;
  const user_id = cookie.get("user_id")? cookie.get("user_id") : null;

  if (user_id !== null) {
    const [data, loading, quantity] = useFetch(
      "http://"+Server_Config.server_address+":"+Server_Config.port+"/get_results?user_id="+user_id
    );
    return (
    <>
      {(user_id===null) && (<h1>Fill in your background information!</h1>)}
      {(user_id!==null && loading) && (<h1>Results for user:{user_id} Loading...</h1>)}
      {(user_id!==null && !loading && quantity===0) && (
        <h1>No results found for user:{user_id}:{quantity}</h1>
      )}
      {(user_id!==null && !loading && quantity!==0) && (
         <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <CustomTableCell align="right">#</CustomTableCell>
                <CustomTableCell align="right">epochs</CustomTableCell>
                <CustomTableCell align="right">batchSize</CustomTableCell>
                <CustomTableCell align="right">lossFunction</CustomTableCell>
                <CustomTableCell align="right">optimizer</CustomTableCell>
                <CustomTableCell align="right">learningRate</CustomTableCell>
                <CustomTableCell align="right">epsilon </CustomTableCell>
                <CustomTableCell align="right">weightDecay</CustomTableCell>
                <CustomTableCell align="right">rho</CustomTableCell>
                <CustomTableCell align="right">learningRateDecay</CustomTableCell>
                <CustomTableCell align="right">initialAccumulator</CustomTableCell>
                <CustomTableCell align="right">alpha </CustomTableCell>
                <CustomTableCell align="right">lambda</CustomTableCell>
                <CustomTableCell align="right">momentum</CustomTableCell>
                <CustomTableCell align="right">beta1</CustomTableCell>
                <CustomTableCell align="right">beta2</CustomTableCell>

                <CustomTableCell align="right">accuracy</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {data.map(({ params,accuracy,index }) => (
              <TableRow className={classes.row} >
                <CustomTableCell align="right">{index}</CustomTableCell>
                <CustomTableCell align="right">{params.epochs.value===''?'-':params.epochs.value}</CustomTableCell>
                <CustomTableCell align="right">{params.batchSize.value===''?'-':params.batchSize.value}</CustomTableCell>
                <CustomTableCell align="right">{params.lossFunction.value===''?'-':params.lossFunction.value}</CustomTableCell>
                <CustomTableCell align="right">{params.optimizer.value ===''?'-':params.optimizer.value}</CustomTableCell>
                <CustomTableCell align="right">{params.learningRate.value ===''?'-':params.learningRate.value}</CustomTableCell>
                <CustomTableCell align="right">{params.epsilon.value ===''?'-':params.epsilon.value} </CustomTableCell>
                <CustomTableCell align="right">{params.weightDecay.value ===''?'-':params.weightDecay.value}</CustomTableCell>
                <CustomTableCell align="right">{params.rho.value ===''?'-':params.rho.value}</CustomTableCell>
                <CustomTableCell align="right">{params.learningRateDecay.value ===''?'-':params.learningRateDecay.value}</CustomTableCell>
                <CustomTableCell align="right">{params.initialAccumulator.value ===''?'-':params.initialAccumulator.value}</CustomTableCell>
                <CustomTableCell align="right">{params.alpha.value ===''?'-':params.alpha.value} </CustomTableCell>
                <CustomTableCell align="right">{params.lambda.value ===''?'-':params.lambda.value}</CustomTableCell>
                <CustomTableCell align="right">{params.momentum.value ===''?'-':params.momentum.value}</CustomTableCell>
                <CustomTableCell align="right">{params.beta1.value ===''?'-':params.beta1.value}</CustomTableCell>
                <CustomTableCell align="right">{params.beta2.value ===''?'-':params.beta2.value}</CustomTableCell>

                {(accuracy===-3) && (<CustomTableCell align="right">Cancelled</CustomTableCell>)}
                {(accuracy===-2) && (<CustomTableCell align="right">Training</CustomTableCell>)}
                {(accuracy===-1) && (<CustomTableCell align="right">NAN thrown</CustomTableCell>)}
                {(accuracy>=0) && (<CustomTableCell align="right">{(accuracy*100)+'%'}</CustomTableCell>)}

              </TableRow>

          ))}

            </TableBody>
          </Table>
        </Paper>
      )}

    </>
  );
  } else {
    return (
    <>
      <h1>Fill in your background information!</h1>
    </>
    );
  }



}

CustomizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(CustomizedTable);
// export default Results;


