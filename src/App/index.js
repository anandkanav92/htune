import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import styled from 'styled-components';
import Header from '../Header';
import About from '../About';
import Tune from '../Tune';
import Results from '../Results';
import Terms from '../Terms';
import Background from '../Background';

const Container = styled.div`
    width: 70%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
`;

const App = () => (
    <React.Fragment>
        <Header />
        <Container>
            <Route exact path='/' render={() => <Redirect to={'/terms'} />} />
            <Route exact path='/backgroundinfo' component={Background} />
            <Route exact path='/about' component={About} />
            <Route exact path='/tune' component={Tune} />
            <Route exact path='/results' component={Results} />
            <Route exact path='/terms' component={Terms} />
        </Container>
    </React.Fragment>
);

export default App;
