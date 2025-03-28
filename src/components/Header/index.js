import {AiOutlineShoppingCart} from 'react-icons/ai'
import './index.css'

const Header = ({cartCount, restaurantName}) => (
  <div className="header-container">
    <h1 className="cafe-heading">{restaurantName}</h1>
    <div className="icon-count-container">
      <p className="orders-text">My Orders</p>
      <AiOutlineShoppingCart className="cart-icon" />

      <span className="count-value">{cartCount}</span>
    </div>
  </div>
)
export default Header
