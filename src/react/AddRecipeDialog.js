import React from 'react';

import "./css/AddRecipe.css"

import Store from './Store.js'

class AddRecipeDialogue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name: '', ingredients: '', description: ''};
        this.handleFormChangeFactory = this.handleFormChangeFactory.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

      }
    handleFormChangeFactory(formField){
        return (event) => {
            let newState = {};
            newState[formField] =  event.target.value;
            this.setState(newState)
        }
    }

    handleSubmit(event){
        event.preventDefault();
        this.props.store.set("showAddRecipeScreen")(false)
        fetch('http://127.0.0.1:5000/addRecipe', {
            method: 'POST',
            body: JSON.stringify(this.state)
        })
        .then(response => response.json())
        .then(data => this.props.store.set("recipeListStale")(true));
    }

    onKeyPress(event) {
        if (event.which === 13 /* Enter */) {
          event.preventDefault();
        }
    }

    render(){
        let store = this.props.store;
        const numCols = 50;
        return store.get('showAddRecipeScreen') &&
        <div id="AddRecipeDialogBackground">
            <div id="AddRecipeDialog">
                <form onSubmit={this.handleSubmit}>
                    <label>Name
                        <br></br>
                        <textarea rows="1" cols={numCols} onChange={this.handleFormChangeFactory("name")} className="AddRecipeDialogFormMember">
                        </textarea>
                    </label>
                    <br></br>

                    <label >Ingredients (new line separated)
                        <br></br>
                        <textarea rows="10" cols={numCols} onChange={this.handleFormChangeFactory("ingredients")} className="AddRecipeDialogFormMember">
                        </textarea>
                    </label>
                    <br></br>

                    <label>Description
                        <br></br>
                        <textarea rows="1" cols={numCols} onChange={this.handleFormChangeFactory("description")} className="AddRecipeDialogFormMember">
                        </textarea>
                    </label>
                    <br></br>

                    <input type="submit" value="Submit"></input>
                </form>
            </div>
        </div>
    }
}

export default Store.withStore(AddRecipeDialogue)