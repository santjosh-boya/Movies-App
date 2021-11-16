import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class SearchRoute extends Component {
  state = {
    searchText: '',
    searchResults: [],
    searchResultsApiStatus: apiStatusConstants.initial,
  }

  getSearchedMovies = async () => {
    const {searchText} = this.state
    this.setState({searchResultsApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://bb4zsgwzaa.execute-api.ap-south-1.amazonaws.com/beta/ma/movies-search?query=${searchText}`
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
        searchResults: updatedData,
        searchResultsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({searchResultsApiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSearchText = event => {
    this.setState({searchText: event.target.value})
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
        onClick={this.getSearchedMovies}
        className="movie-play-button"
        type="button"
      >
        Try again
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {searchResults, searchText} = this.state

    if (!searchResults.length) {
      return (
        <div className="home-page-movie-container">
          <img
            src="https://res.cloudinary.com/boya-santhosh/image/upload/v1637062401/Group_7394_ybumsd.png"
            alt="no movies"
            className="failure-view-image"
          />
          <p>Your search for {searchText} did not find any matches.</p>
        </div>
      )
    }
    return (
      <ul className="similar-movies-container route-container list-styles">
        {searchResults.map(movie => (
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
    const {searchResultsApiStatus} = this.state

    switch (searchResultsApiStatus) {
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
    const {searchText} = this.state

    return (
      <div className="route-container ">
        <Header
          isInSearchRoute
          onClickSearch={this.getSearchedMovies}
          searchText={searchText}
          onChangeSearchText={this.onChangeSearchText}
        />
        {this.renderViewBasedOnStatus()}
        <Footer />
      </div>
    )
  }
}

export default SearchRoute
