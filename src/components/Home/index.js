import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import {Link} from 'react-router-dom'

import './index.css'

import Header from '../Header'
import Footer from '../Footer'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 3,
        infinite: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
  ],
}

class Home extends Component {
  state = {
    trendingMoves: [],
    trendingMovesAPiStatus: apiStatusConstants.initial,
    topRatedMovies: [],
    topRatedMoviesStatus: apiStatusConstants.initial,
    originals: [],
    originalsApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getTrendingMovies()
    this.getTopRatedMovies()
    this.getOriginals()
  }

  getTrendingMovies = async () => {
    this.setState({trendingMovesAPiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl =
      'https://bb4zsgwzaa.execute-api.ap-south-1.amazonaws.com/beta/ma/trending-movies'
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
        overview: eachItem.overview,
        posterPath: eachItem.poster_path,
        title: eachItem.title,
      }))

      this.setState({
        trendingMoves: updatedData,
        trendingMovesAPiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({trendingMovesAPiStatus: apiStatusConstants.failure})
    }
  }

  getTopRatedMovies = async () => {
    this.setState({topRatedMoviesStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl =
      'https://bb4zsgwzaa.execute-api.ap-south-1.amazonaws.com/beta/ma/top-rated-movies'
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
        overview: eachItem.overview,
        posterPath: eachItem.poster_path,
        title: eachItem.title,
      }))

      this.setState({
        topRatedMovies: updatedData,
        topRatedMoviesStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({topRatedMoviesStatus: apiStatusConstants.failure})
    }
  }

  getOriginals = async () => {
    this.setState({originalsApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl =
      'https://bb4zsgwzaa.execute-api.ap-south-1.amazonaws.com/beta/ma/originals'
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
        overview: eachItem.overview,
        posterPath: eachItem.poster_path,
        title: eachItem.title,
      }))

      this.setState({
        originals: updatedData,
        originalsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({originalsApiStatus: apiStatusConstants.failure})
    }
  }

  renderMoviesList = moviesList => (
    <Slider {...settings}>
      {moviesList.map(movie => {
        const movieImage = `https://image.tmdb.org/t/p/original/${movie.posterPath}`
        return (
          <Link to={`/movies/${movie.id}`} style={{textDecoration: 'none'}}>
            <div className="react-slick-item" key={movie.id}>
              <img
                className="poster"
                src={movieImage}
                width="100%"
                height="100%"
                alt={`${movie.title}`}
              />
            </div>
          </Link>
        )
      })}
    </Slider>
  )

  renderHomePageMovie = () => {
    const {originals} = this.state

    const movieIndex = Math.floor(Math.random() * (originals.length - 0))
    const movie = originals[movieIndex]

    return (
      <div
        className="homepage-movie"
        style={{
          backgroundImage:
            'url(' +
            `https://image.tmdb.org/t/p/original/${movie.backdropPath}` +
            ')',
          backgroundSize: 'cover',
        }}
      >
        <h1 className="movie-title">{movie.title}</h1>
        <p className="movie-description">{movie.overview}</p>
        <button className="movie-play-button" type="button">
          Play
        </button>
      </div>
    )
  }

  renderLoadingView = () => (
    <div testid="loader">
      <Loader type="Circles" color="#3b82f6" height="50" width="50" />
    </div>
  )

  renderFailureView = failureView => (
    <div className="home-page-movie-container">
      <img
        src="https://res.cloudinary.com/boya-santhosh/image/upload/v1636988026/alert-triangle_quvos6.png"
        alt="failure view"
        className="failure-view-image"
      />
      <p>Something went wrong. Please try again</p>
      <button onClick={failureView} className="movie-play-button" type="button">
        Try again
      </button>
    </div>
  )

  renderViewBasedOnStatus = (
    apiStatus,
    renderSuccessView,
    moviesList,
    failureView,
  ) => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderSuccessView(moviesList)
      case apiStatusConstants.failure:
        return this.renderFailureView(failureView)
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {
      originalsApiStatus,
      topRatedMoviesStatus,
      trendingMovesAPiStatus,
      originals,
      topRatedMovies,
      trendingMoves,
    } = this.state
    return (
      <div className="home-page-container">
        <Header isInSearchRoute={false} />
        {this.renderViewBasedOnStatus(
          originalsApiStatus,
          this.renderHomePageMovie,
          [],
          this.getOriginals,
        )}
        <div>
          <h1 className="section-heading">Trending Now</h1>
          {this.renderViewBasedOnStatus(
            trendingMovesAPiStatus,
            this.renderMoviesList,
            trendingMoves,
            this.getTrendingMovies,
          )}
        </div>
        <div>
          <h1 className="section-heading">Top Rated</h1>
          {this.renderViewBasedOnStatus(
            topRatedMoviesStatus,
            this.renderMoviesList,
            topRatedMovies,
            this.getTopRatedMovies,
          )}
        </div>
        <div>
          <h1 className="section-heading">Originals </h1>
          {this.renderViewBasedOnStatus(
            originalsApiStatus,
            this.renderMoviesList,
            originals,
            this.getOriginals,
          )}
        </div>
        <Footer />
      </div>
    )
  }
}

export default Home
