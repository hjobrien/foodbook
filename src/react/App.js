import React from 'react';
import { channels } from '../shared/constants';

import './css/App.css';

import RecipeList from './RecipeList.js'
import AddRecipeButton from './AddRecipeButton.js'
import AddRecipeDialogue from './AddRecipeDialog.js'
import Store from './Store.js'

const { ipcRenderer } = window;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appName: '',
      appVersion: '',
    };
  }

  componentDidMount(){
    ipcRenderer.send(channels.APP_INFO);
    ipcRenderer.on(channels.APP_INFO, (event, arg) => {
      ipcRenderer.removeAllListeners(channels.APP_INFO);
      const { appName, appVersion } = arg;
      this.setState({ appName, appVersion });
    });
  }


  render() {
    const { appName, appVersion} = this.state;
    return (
      <Store.Container>
        <div className="App">
          <header className="App-header">
            <AddRecipeButton/>
          </header>
          <AddRecipeDialogue/>
          <RecipeList/>
          <footer>
            <div id="version-data">
                <p>{appName} version {appVersion}</p>
            </div>
          </footer>
        </div>
      </Store.Container>
    );
  }
}

export default App;
