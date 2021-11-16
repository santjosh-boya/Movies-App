import {Link} from 'react-router-dom'
import {ImSearch} from 'react-icons/im'
import './index.css'

const Header = props => {
  const onClickProfile = () => {}

  const onClickSearchIcon = () => {
    const {searchText, onClickSearch} = props
    if (searchText !== '') onClickSearch()
  }

  const {isInSearchRoute, searchText, onChangeSearchText} = props

  return (
    <div className="header-container">
      <div className="header-left-container">
        <ul className="header-list-style">
          <li>
            <Link to="/">
              <img
                src="https://res.cloudinary.com/boya-santhosh/image/upload/v1636972160/Group_7399_y69w3v.png"
                alt="website logo"
                className="header-website-logo"
              />
            </Link>
          </li>
          <li>
            <Link to="/" className="link-header">
              Home
            </Link>
          </li>
          <li>
            <Link className="link-header" to="/popular">
              Popular
            </Link>
          </li>
        </ul>
      </div>
      <div className="header-right-container">
        {isInSearchRoute ? (
          <>
            <input
              type="search"
              value={searchText}
              onChange={onChangeSearchText}
            />
            <button type="button" onClick={onClickSearchIcon}>
              <ImSearch className="search-icon" />
            </button>
          </>
        ) : (
          <button
            className="search-button"
            testid="searchButton"
            type="button"
            onClick={onClickProfile}
          >
            <Link to="/search">
              <ImSearch className="search-icon" />
            </Link>
          </button>
        )}
        <Link to="/account">
          <img
            src="https://res.cloudinary.com/boya-santhosh/image/upload/v1636977978/Avatar_wtsdrg.png"
            alt="profile"
          />
        </Link>
      </div>
    </div>
  )
}

export default Header
