import './index.css'

const DishTab = props => {
  const {menuData, onChangeMenuTab, isActive} = props
  const {menuCategory, menuCategoryId} = menuData

  const onMenuTab = () => {
    onChangeMenuTab(menuCategoryId)
  }
  return (
    <li className="menu-item-container">
      <button
        type="button"
        className={`menu-tab-button menu-category-name ${
          isActive ? 'color-menu-text' : ''
        }`}
        onClick={onMenuTab}
      >
        {menuCategory}
      </button>
    </li>
  )
}
export default DishTab
