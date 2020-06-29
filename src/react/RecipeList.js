import React from 'react';

import Store from './Store.js'
import RecipeListItem from './RecipeListItem.js'
import {filter} from 'rxjs/operators'


class RecipeList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          numRecipies: 0,
          recipeList: [],
        };

    }

    componentDidMount(){
        this.getRecipies();
        this.props.store.on("recipeListStale")
        .pipe(filter(newVal => newVal)) // only care about when it was set to true
        .subscribe(this.getRecipies)
    }

    updateRecipeList(data){
      this.setState({numRecipies: data.num_entries, recipeList: data.entries});

    }

    getRecipies = () => {
        fetch('http://127.0.0.1:5000/getFirst')
        .then(response => response.json())
        .then(data => this.updateRecipeList(data))
        .then(_ => console.log(this.state))
    }


    renderRecipeList() {
    return this.state.recipeList.map(recipe => (<RecipeListItem key={recipe.name} name={recipe.name} desc={recipe.description}/>));
    }

    render() {
        return (
        <div id="recipe-list">
          <div>
            {this.renderRecipeList()}
          </div>
        </div>
        );
    }
}

export default Store.withStore(RecipeList);