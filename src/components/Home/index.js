import {Component} from 'react'
import DishTab from '../DishTab'
import DishItem from '../DishItem'
import Header from '../Header'
import './index.css'

class Home extends Component {
  state = {data: [], dishesList: [], activeTabId: '11', cartCount: 0}

  componentDidMount() {
    this.getDishDetails()
  }

  onChangeActiveMenuTab = id => {
    const {data} = this.state
    console.log('current data', data)
    const activeTab = data.find(each => each.menuCategoryId === id)
    console.log(activeTab.categoryDishes)
    this.setState({activeTabId: id, dishesList: activeTab.categoryDishes})
  }

  incrementCartCount = () => {
    this.setState(prevState => ({cartCount: prevState.cartCount + 1}))
  }

  decrementCartCount = () => {
    this.setState(prevState => ({
      cartCount: prevState.cartCount > 0 ? prevState.cartCount - 1 : 0,
    }))
  }

  getDishDetails = async () => {
    try {
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

        this.setState({
          data: updatedTableMenuData,
          dishesList: updatedTableMenuData[0].categoryDishes,
          activeTabId: updatedTableMenuData[0].menuCategoryId,
        })
      }
    } catch (error) {
      console.log('api not correct')
    }
  }

  render() {
    const {data, activeTabId, dishesList, cartCount} = this.state
    console.log(data)
    console.log('dishesList', dishesList)
    return (
      <>
        <Header cartCount={cartCount} />
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
              incrementCartCount={this.incrementCartCount}
              decrementCartCount={this.decrementCartCount}
            />
          ))}
        </ul>
      </>
    )
  }
}
export default Home
