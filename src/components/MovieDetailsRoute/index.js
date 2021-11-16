import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import Header from '../Header'

import './index.css'
import Footer from '../Footer'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class MovieDetailsRoute extends Component {
  state = {
    movieDetails: {},
    movieDetailsApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getMovieDetails()
  }

  getMovieDetails = async () => {
    this.setState({movieDetailsApiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://bb4zsgwzaa.execute-api.ap-south-1.amazonaws.com/beta/ma/movies/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()
      const {movie} = fetchedData
      const updatedData = {
        adult: movie.adult,
        backdropPath: movie.backdrop_path,
        budget: movie.budget,
        id: movie.id,
        overview: movie.overview,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
        runtime: movie.runtime,
        title: movie.title,
        voteAverage: movie.vote_average,
        voteCount: movie.vote_count,
        genres: movie.genres.map(genre => ({
          id: genre.id,
          name: genre.name,
        })),
        similarMovies: movie.similar_movies.map(similarMovie => ({
          backdropPath: similarMovie.backdrop_path,
          id: similarMovie.id,
          posterPath: similarMovie.poster_path,
          title: similarMovie.title,
        })),
        spokenLanguages: movie.spoken_languages.map(lang => ({
          id: lang.id,
          englishName: lang.english_name,
        })),
      }
      this.setState({
        movieDetails: updatedData,
        movieDetailsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({movieDetailsApiStatus: apiStatusConstants.failure})
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
        onClick={this.getMovieDetails}
        type="button"
      >
        Try Again
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {movieDetails} = this.state
    return (
      <div>
        <div
          style={{
            backgroundImage:
              'url(' +
              `https://image.tmdb.org/t/p/original/${movieDetails.backdropPath}` +
              ')',
            backgroundSize: 'cover',
          }}
          className="movie-poster-styles"
        >
          <h1>{movieDetails.title}</h1>
          <div className="similar-movies-container">
            <p className="movie-description-details">
              {parseInt(movieDetails.runtime / 60, 10)}h{' '}
              {movieDetails.runtime % 60}m
            </p>
            <p className="movie-description-details">
              {movieDetails.adult ? 'A' : 'UA'}
            </p>
            <p>{movieDetails.releaseDate}</p>
          </div>
          <p>{movieDetails.overview}</p>
          <button className="movie-play-button" type="button">
            Play
          </button>
        </div>
        <div className="movie-details-container">
          <div className="movie-overview-container">
            <div>
              <h1>Genres</h1>
              <ul className="list-styles">
                {movieDetails.genres.map(genre => (
                  <li key={genre.id}>
                    <p>{genre.name}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h1>Audio Available</h1>
              <ul className="list-styles">
                {movieDetails.spokenLanguages.map(lang => (
                  <li key={lang.id}>
                    <p>{lang.englishName}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h1>Rating Count</h1>
              <p>{movieDetails.voteCount}</p>
              <h1>Rating Average</h1>
              <p>{movieDetails.voteAverage}</p>
            </div>
            <div>
              <h1>Budget</h1>
              <p>{movieDetails.budget}</p>
              <h1>Release Date</h1>
              <p>{movieDetails.releaseDate}</p>
            </div>
          </div>
          <div>
            <h1>More like this </h1>
            <ul className="similar-movies-container list-styles">
              {movieDetails.similarMovies.map(movie => (
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
          </div>
        </div>
      </div>
    )
  }

  renderViewBasedOnStatus = () => {
    const {movieDetailsApiStatus} = this.state

    switch (movieDetailsApiStatus) {
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

export default MovieDetailsRoute
