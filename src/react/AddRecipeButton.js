import React from 'react';

import './css/AddRecipe.css'

import Store from './Store.js'

class AddRecipeButton extends React.Component {

    addRecipe = () => {
        let store = this.props.store;
        console.log("clicked");
        store.set('showAddRecipeScreen')(true)
        return false;
    }

    render(){
        return (
        <div id="AddRecipeButton" onClick={this.addRecipe}>
            Add Recipe
        </div>)
    }
}

export default Store.withStore(AddRecipeButton);