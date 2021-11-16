import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <>
    <div className="not-found-container">
      <img
        src="https://res.cloudinary.com/boya-santhosh/image/upload/v1637036514/snow-removal-machine-working-high-ski-slope-snowstorm_454047-2149_1_kr8nfp.png"
        alt="not found"
        className="not-found-img"
      />
      <h1 className="page-not-found-heading">Lost Your Way ?</h1>
      <p className="page-not-found-description">
        Sorry, we cannot find that page. You will find lots to explore on the
        home page.
      </p>
      <Link to="/" style={{textDecoration: 'none'}}>
        <button type="button" className="home-btn">
          Go to Home
        </button>
      </Link>
    </div>
  </>
)

export default NotFound
