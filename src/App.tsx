import React, { Component, Fragment } from 'react';
// See https://material-ui.com/style/css-baseline/
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.scss';

import axios from 'axios';
import { container, lazyInject } from "./ioc";
import { ContentService } from './services/ContentService';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';

// see https://material.io/tools/icons/?style=baseline
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import BuildIcon from '@material-ui/icons/Build';
import PersonIcon from '@material-ui/icons/Person';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

class Props {
  // TODO this.props.container is missing
}

class State {
  constructor(public mobileOpen: boolean, public headerContent: HeaderContent) {}
}

export class HeaderContent {
  constructor(public locale: string|null, public title: string, public content: string) {}
}

/**
 * This version adapted from https://material-ui.com/demos/drawers/#responsive-drawer
 */
class App extends Component<any, State> {

  // @lazyInject("contentService") is broken with React: https://github.com/inversify/InversifyJS/issues/1026
  private readonly contentService: ContentService = container.get("contentService");

  constructor(props: any){
      super(props);
      this.state = new State(false, new HeaderContent(null, '', 'Loading...'));
  }
  // Using a lambda so we don't have to bind: https://stackoverflow.com/questions/36106384/reactjs-typescript-event-this-undefined
  handleDrawerToggle = () => {
    this.setState((state) => ({ ...state, mobileOpen: !this.state.mobileOpen }));
  };
  // The returned promise is just for testing because setState() is asynchronous.
  public componentDidMount(): Promise<HeaderContent> {
    return new Promise((resolve, reject) => {
      this.contentService.loadHeader().then(content => {
        this.setState(state => ({ ...state, headerContent: content }), () => resolve(content));
      }).catch(error => {
        // TODO mockAxios does not call thenFn with a catch() in ContentService:
        let content = new HeaderContent('', 'HTTP request failed', '<pre>' + JSON.stringify(error, null, 2) + '</pre>');
        this.setState(state => ({ ...state, headerContent: content }), () => resolve(content));
      })
    });
  }
  render() {
    const drawer = (
      <div className="drawer-paper" >
        {/* Width is not inherited from <Drawer/> below, hence 'drawer-paper' again. */}
        <div className="toolbar" />
        <Divider />
        <List>
          {/* TODO A structure with menu items would be nice, but what about the icons? */}
          <ListItem button key="Dashboard">
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" className="menu-label"/>
          </ListItem>
          <ListItem button key="Customer Search">
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="Customer Search" className="menu-label"/>
          </ListItem>
          <ListItem button key="Site Management">
            <ListItemIcon><BuildIcon /></ListItemIcon>
            <ListItemText primary="Site Management" className="menu-label"/>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button key="Account">
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary="Account" className="menu-label"/>
          </ListItem>
          <ListItem button key="Support">
            <ListItemIcon><HelpOutlineIcon /></ListItemIcon>
            <ListItemText primary="Support" className="menu-label"/>
          </ListItem>
          <ListItem button key="Sign Out">
            <ListItemIcon><PowerSettingsNewIcon /></ListItemIcon>
            <ListItemText primary="Sign Out" className="menu-label"/>
          </ListItem>
        </List>
      </div>
    );

    return (
      <div className="root">
        <CssBaseline />
        <AppBar position="fixed" className="app-bar">
          <Toolbar>
            <IconButton color="inherit" aria-label="Open drawer"
              onClick={this.handleDrawerToggle} className="menu-button">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>React Navigation</Typography>
          </Toolbar>
        </AppBar>
        <nav className="drawer">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden mdUp implementation="css">
            <Drawer className="drawer-paper" variant="temporary" open={this.state.mobileOpen}
              container={this.props.container} anchor="left" onClose={this.handleDrawerToggle}>
              {drawer}
            </Drawer>
          </Hidden>
          {/* NOTE: smUp vs xsDown may come from the JS theme, which is a problem if we use SASS. */}
          <Hidden smDown implementation="css">
            <Drawer className="drawer-paper" variant="permanent" open>
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className="content">
          <div className="toolbar" />
          <Typography variant="h6" >{ this.state.headerContent.title }</Typography>
          <Typography paragraph dangerouslySetInnerHTML={{ __html: this.state.headerContent.content }} />
        </main>
      </div>
    );
  }
}

export default App;
