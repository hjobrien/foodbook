import React from 'react';

class RecipeListItem extends React.Component {
    render(){
        return (
            <div>
                <h1>{this.props.name}</h1>
                <p>{this.props.desc}</p>
            </div>
        )
    }
}

export default RecipeListItem