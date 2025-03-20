import {Component} from 'react'
import './index.css'

class DishItem extends Component {
  state = {quantity: 0}

  onIncrease = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
    const {incrementCartCount} = this.props
    incrementCartCount()
  }

  onDecrease = () => {
    const {decrementCartCount} = this.props
    const {quantity} = this.state

    if (quantity > 0) {
      this.setState({quantity: quantity - 1})
      decrementCartCount()
    }
  }

  render() {
    const {dish} = this.props
    const {quantity} = this.state

    const {
      dishName,
      dishImage,
      dishCalories,
      dishAvailability,
      dishCurrency,
      dishDescription,
      dishPrice,
      addonCat,
    } = dish

    return (
      <li className="dish-item-card">
        <div
          className={`circle-container ${
            dishPrice > 10 ? 'high-rate-dish' : ''
          }`}
        >
          <p className={`circle ${dishPrice > 10 ? 'high-rate-circle' : ''}`} />
        </div>
        <div className="content-card">
          <div className="dish-content-container">
            <h1 className="dish-name">{dishName}</h1>
            <p className="dish-currency">{`${dishCurrency} ${dishPrice}`}</p>
            <p className="dish-description">{dishDescription}</p>

            {dishAvailability ? (
              <div className="quantity-container">
                <button
                  type="button"
                  className="button-control"
                  onClick={this.onDecrease}
                >
                  -
                </button>
                <p className="quantity">{quantity}</p>
                <button
                  type="button"
                  className="button-control"
                  onClick={this.onIncrease}
                >
                  +
                </button>
              </div>
            ) : (
              <p className="not-available-text">Not Available</p>
            )}
            {addonCat.length ? (
              <p className="customization-text">Customizations available</p>
            ) : (
              ''
            )}
          </div>
          <p className="calorie-num calorie-num-sm">{`${dishCalories} calories`}</p>

          <div className="cal-card">
            <p className="calorie-num calorie-num-lg">{`${dishCalories} calories`}</p>
            <img src={dishImage} alt={dishName} className="dish-image" />
          </div>
        </div>
      </li>
    )
  }
}
export default DishItem
