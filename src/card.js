import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Card Model
 */
class Card extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        symbol: props.symbol,
        color: props.color,
        isFlipped: false, // True if card is flipped, showing the symbol and color
        };

        this.ee = props.ee;
    }

    getColor(){
        return this.state.color;
    }

    getSymbol(){
        return this.state.symbol;
    }

    isFlipped(){
        return this.state.isFlipped;
    }

    revealCard(){
        this.setState({
        isFlipped: true
        });
    }

    hideCard(){
        this.setState({
        isFlipped: false
        });
    }

    render() {
        if (this.state.isFlipped){
        return (
            <div className="card">
            <div className="center-fas-icon">
                <FontAwesomeIcon icon={"fa-solid " + this.state.symbol} className={this.state.color + "-iconcolor"} />
            </div>
            </div>
        );
        } else {
        return (
            <div className="card" onClick={() => this.ee.emit('cardClicked', this)}>
            <div className="center-fas-icon">
                <FontAwesomeIcon icon="fa-solid fa-file"  className="hidden-card-background"/>
            </div>
            </div>
        );
        }
    }

}

export default Card;