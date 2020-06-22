import React from 'react';

import "./css/RecipeListItem.css"

class RecipeListItem extends React.Component {
    render(){
        return (
            <div className="item">
                <div className="recipe-list-item-title">{this.props.name}</div>
                <div className="recipe-list-item-desc">{this.props.desc}</div>
            </div>
        )
    }
}

export default RecipeListItem