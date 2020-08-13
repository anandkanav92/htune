import React from 'react';
import styled from 'styled-components';
import {withRouter, Link} from 'react-router-dom';
import Cookies from "universal-cookie";

const cookie = new Cookies();


const MenuBar = styled.div`
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: stretch;
    background-color: #f8f8f8;
    border-bottom: 1px solid #efefef;
`;

const AppHeading = styled.div`
    // width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    font-weight:bold;
    padding-left: 10px;
    padding-right: 10px;
    margin-right: 10px;
    float: left;
`;
const MenuItemContainer = styled.div`
    // width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
    background-color: #f8f8f8;
    border-bottom: 1px solid #efefef;
`;
const MenuItem = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    padding-left: 10px;
    padding-right: 10px;
    margin-right: 10px;
    cursor: pointer;
    float: left;

    a {
        color: ${props => props.active ? 'rgba(0, 0 , 0, 0.9)': 'rgba(0, 0, 0, 0.5)'};

        &:hover{
            color: rgba(0, 0, 0, 0.9);
        }
    }
`;

const Header = ({location}) => (
    <MenuBar>
        <AppHeading >
            Hyperparameter Optimization
        </AppHeading>
        <MenuItemContainer>

            <MenuItem active={location.pathname === '/terms'} >
                <Link to='/terms'>Terms</Link>
            </MenuItem>


            <MenuItem active={location.pathname === '/about'} >
                <Link to='/about'>About</Link>
            </MenuItem>

            <MenuItem active={location.pathname === '/backgroundinfo' && cookie.get('terms_agreed')?true:false}>
                <Link to='/backgroundinfo'>Background Information</Link>
            </MenuItem>

            <MenuItem active={location.pathname === '/tune' && cookie.get('terms_agreed')?true:false} >
                <Link to='/tune'>Tune It</Link>
            </MenuItem>

            <MenuItem active={location.pathname === '/results' && cookie.get('terms_agreed')?true:false}>
                <Link to='/results'>Results</Link>
            </MenuItem>
        </MenuItemContainer>
    </MenuBar>
);

export default withRouter(Header);
