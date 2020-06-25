import React from 'react';
import { channels } from '../shared/constants';

import './css/App.css';

import RecipeListItem from './RecipeListItem.js'
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
      numRecipies: 0,
      recipeList: [],
    };
    ipcRenderer.send(channels.APP_INFO);
    ipcRenderer.on(channels.APP_INFO, (event, arg) => {
      ipcRenderer.removeAllListeners(channels.APP_INFO);
      const { appName, appVersion } = arg;
      this.setState({ appName, appVersion });
    });
    this.getRecipies();

  }

  getRecipies() {
    fetch('http://127.0.0.1:5000/getFirst')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      this.setState({numRecipies: data.num_entries})
      this.setState({recipeList: data.entries})
    })
  }

  renderRecipeList(recipies) {
    return recipies.map(recipe => (<RecipeListItem key={recipe.name} name={recipe.name} desc={recipe.description}/>));
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
          <div id="recipe-list">
            <div>
              {this.renderRecipeList(this.state.recipeList)}
            </div>
          </div>

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
