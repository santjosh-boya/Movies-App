import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class PopularRoute extends Component {
  state = {
    popularMovies: [],
    popularMoviesApiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getPopularMovies()
  }

  getPopularMovies = async () => {
    this.setState({popularMoviesApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl =
      'https://bb4zsgwzaa.execute-api.ap-south-1.amazonaws.com/beta/ma/popular-movies'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.results.map(eachItem => ({
        backdropPath: eachItem.backdrop_path,
        id: eachItem.id,
        posterPath: eachItem.poster_path,
        title: eachItem.title,
      }))

      this.setState({
        popularMovies: updatedData,
        popularMoviesApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({popularMoviesApiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div testid="loader">
      <Loader type="Circles" color="#3b82f6" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="home-page-movie-container">
      <img
        src="https://res.cloudinary.com/boya-santhosh/image/upload/v1636988026/alert-triangle_quvos6.png"
        alt="failure view"
        className="failure-view-image"
      />
      <p>Something went wrong. Please try again</p>
      <button
        className="movie-play-button"
        onClick={this.getPopularMovies}
        type="button"
      >
        Try Again
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {popularMovies} = this.state

    return (
      <ul className="similar-movies-container route-container list-styles">
        {popularMovies.map(movie => (
          <Link
            to={`/movies/${movie.id}`}
            style={{textDecoration: 'none'}}
            key={movie.id}
          >
            <li>
              <img
                src={`https://image.tmdb.org/t/p/original/${movie.posterPath}`}
                alt={movie.title}
                className="similar-movies"
              />
            </li>
          </Link>
        ))}
      </ul>
    )
  }

  renderViewBasedOnStatus = () => {
    const {popularMoviesApiStatus} = this.state

    switch (popularMoviesApiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderViewBasedOnStatus()}
        <Footer />
      </div>
    )
  }
}

export default PopularRoute
