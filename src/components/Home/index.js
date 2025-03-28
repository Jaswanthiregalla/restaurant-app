import {Component} from 'react'
import Loader from 'react-loader-spinner'
import DishTab from '../DishTab'
import DishItem from '../DishItem'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  restaurantName = ''

  state = {
    data: [],
    dishesList: [],
    activeTabId: '11',
    cartCount: 0,
    dishQuantities: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getDishDetails()
  }

  updatedDishQuantities = (dishId, quantityChange) => {
    this.setState(prevState => {
      const prevQuantity = prevState.dishQuantities[dishId]
      const updatedQuantity = prevQuantity + quantityChange
      if (updatedQuantity < 0) {
        return prevState
      }
      const updatedDishQuantities = {
        ...prevState.dishQuantities,
        [dishId]: updatedQuantity >= 0 ? updatedQuantity : 0,
      }
      const newCartCount = Object.values(updatedDishQuantities).reduce(
        (initial, quantity) => initial + quantity,
        0,
      )
      return {
        dishQuantities: updatedDishQuantities,
        cartCount: newCartCount,
      }
    })
  }

  onChangeActiveMenuTab = id => {
    const {data} = this.state
    console.log('current data', data)
    const activeTab = data.find(each => each.menuCategoryId === id)
    console.log(activeTab.categoryDishes)
    this.setState({activeTabId: id, dishesList: activeTab.categoryDishes})
  }

  getDishDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl =
      'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const tableMenuList = data[0].table_menu_list
      this.restaurantName = data[0].restaurant_name
      console.log(tableMenuList)
      const updatedTableMenuData = tableMenuList.map(each => ({
        menuCategory: each.menu_category,
        menuCategoryId: each.menu_category_id,
        menuCategoryImage: each.menu_category_image,
        categoryDishes: each.category_dishes.map(dish => ({
          dishId: dish.dish_id,
          dishName: dish.dish_name,
          dishImage: dish.dish_image,
          dishCalories: dish.dish_calories,
          dishAvailability: dish.dish_Availability,
          dishCurrency: dish.dish_currency,
          dishDescription: dish.dish_description,
          dishPrice: dish.dish_price,
          addonCat: dish.addonCat,
        })),
      }))

      const initialQuantities = {}
      updatedTableMenuData.forEach(category => {
        category.categoryDishes.forEach(dish => {
          initialQuantities[dish.dishId] = 0
        })
      })

      this.setState({
        data: updatedTableMenuData,
        dishesList: updatedTableMenuData[0].categoryDishes,
        activeTabId: updatedTableMenuData[0].menuCategoryId,
        dishQuantities: initialQuantities,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  /* eslint-disable class-methods-use-this */
  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
        alt="No Dishes"
        className="no-dishes-img"
      />
      <h2 className="no-dishes-text">No Dishes Available</h2>
      <p>Please check back later!</p>
    </div>
  )

  /* eslint-disable class-methods-use-this */
  renderLoaderView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => {
    const {
      data,
      activeTabId,
      dishesList,
      cartCount,
      dishQuantities,
    } = this.state
    return (
      <>
        <Header cartCount={cartCount} restaurantName={this.restaurantName} />
        <ul className="menu-tabs-container">
          {data.map(each => (
            <DishTab
              key={each.menuCategoryId}
              menuData={each}
              onChangeMenuTab={this.onChangeActiveMenuTab}
              isActive={each.menuCategoryId === activeTabId}
            />
          ))}
        </ul>
        <ul className="dish-items-container">
          {dishesList.map(each => (
            <DishItem
              key={each.dishId}
              dish={each}
              updatedDishQuantities={this.updatedDishQuantities}
              quantity={dishQuantities[each.dishId]}
            />
          ))}
        </ul>
      </>
    )
  }

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }
}
export default Home
