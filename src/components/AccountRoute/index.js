import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'

import './index.css'

class AccountRoute extends Component {
  onLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  renderAccountDetails = () => (
    <div className="account-route-styles">
      <h1>Account</h1>
      <div>
        <p>Member ship</p>
        <p>prathyusha@gmail.com</p>
        <p>Password : **************</p>
      </div>
      <div>
        <p>Plan details </p>
        <p>Premium</p>
        <p>Ultra HD</p>
      </div>
      <button onClick={this.onLogout} type="button">
        Logout
      </button>
    </div>
  )

  render() {
    return (
      <div>
        <Header />
        {this.renderAccountDetails()}
        <Footer />
      </div>
    )
  }
}

export default AccountRoute
