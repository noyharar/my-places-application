import React, {Fragment} from 'react';
import './MainNavigation.css';
import MainHeader from "./MainHeader";
import SideDrawer from "./SideDrawer";
import {Link, NavLink} from "react-router-dom"
import NavLinks from "./NavLinks";

const MainNavigation = props => {
    return (
        <Fragment>
            <SideDrawer>
                <nav className="main-navigation__drawer-nav">
                    <NavLinks></NavLinks>
                </nav>
            </SideDrawer>
            <MainHeader>
                <button className="main-navigation__menu-btn">
                    <span/>
                    <span/>
                    <span/>
                </button>
                <h1 className="main-navigation__title-">
                    <Link to="/">YourPlaces</Link>
                </h1>
                <nav className="main-navigation__header-nav">
                    <NavLinks></NavLinks>
                </nav>
            </MainHeader>
        </Fragment>
    );
};

export default MainNavigation;
