import React from 'react';

import Card from './card.js'

/**
 * Board Model
 */
class Board extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        cards: props.cards,
        rows: props.rows,
        cols: props.cols,
        };
    }

    render(){
        return (
        <div className="board-wrapper">
            {this.state.cards.map((row, index) => (
            <div className="card-row" key={index}>
                {row.map((card, index_c) => (
                <Card color={card.props.color} symbol={card.props.symbol} ee={card.props.ee} key={index_c}/>
                ))}
            </div>
            ))}
        </div>
        )
    }

}

export default Board;