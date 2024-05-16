import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Header from '../Header'

import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiConstantsStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiConstantsStatus.initial,
    productDetails: [],
    similarProducts: [],
    countItems: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({
      apiStatus: apiConstantsStatus.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const jwtToken = Cookies.get('jwt_token')
    const {id} = params
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        id: data.id,
        availability: data.availability,
        description: data.description,
        brand: data.brand,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        title: data.title,
        totalReviews: data.total_reviews,
      }

      const similarData = data.similar_products.map(eachItem => ({
        availability: eachItem.availability,
        brand: eachItem.brand,
        description: eachItem.description,
        imageUrl: eachItem.image_url,
        id: eachItem.id,
        price: eachItem.price,
        rating: eachItem.rating,
        style: eachItem.style,
        title: eachItem.title,
        totalReviews: eachItem.total_reviews,
      }))

      this.setState({
        productDetails: updatedData,
        similarProducts: similarData,
        apiStatus: apiConstantsStatus.success,
      })
    } else {
      this.setState({
        apiStatus: apiConstantsStatus.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
    </div>
  )

  renderApiStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiConstantsStatus.success:
        return this.renderProductsList()
      case apiConstantsStatus.failure:
        return this.renderFailureView()
      case apiConstantsStatus.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onDecreaseCount = () => {
    const {countItems} = this.state
    if (countItems > 1) {
      this.setState(prevState => ({countItems: prevState.countItems - 1}))
    }
  }

  onAddCount = () => {
    this.setState(prevState => ({countItems: prevState.countItems + 1}))
  }

  continueShopping = () => {
    const {history} = this.props
    return history.replace('/products')
  }

  renderProductsList = () => {
    const {productDetails, countItems, similarProducts} = this.state
    const {
      imageUrl,
      title,
      price,
      availability,
      description,
      brand,
      rating,
      totalReviews,
    } = productDetails
    return (
      <div>
        <div className="product-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="product-details-container">
            <h1 className="title">{title}</h1>
            <p className="price">Rs {price}/- </p>
            <div className="ratings-and-review-container">
              <div className="ratings-block">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-img"
                />
              </div>
              <p className="total-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <p className="brand-and-availability">Available: {availability}</p>
            <p className="brand-and-availability">Brand: {brand}</p>
            <hr className="horizontal-line" />
            <div className="add-items-container">
              <button
                type="button"
                data-testid="minus"
                className="icon-button"
                onClick={this.onDecreaseCount}
              >
                <BsDashSquare className="increment-or-decrement" />
              </button>

              <p className="count-items">{countItems}</p>

              <button
                type="button"
                data-testid="plus"
                className="icon-button"
                onClick={this.onAddCount}
              >
                <BsPlusSquare className="increment-or-decrement" />
              </button>
            </div>
            <button type="button" className="add-to-cart">
              ADD TO CART
            </button>
          </div>
        </div>
        <div>
          <SimilarProductItem similarProducts={similarProducts} />
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <>
      <div className="failure-view-container">
        <div className="failure-content">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
            alt="error view"
            className="error-view-image"
          />
          <h1 className="product-not-found">Product Not Found</h1>
          <button
            type="button"
            className="continue-shopping-btn"
            onClick={this.continueShopping}
          >
            continue shopping
          </button>
        </div>
      </div>
    </>
  )

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <>
        <Header />
        {this.renderApiStatus()}
      </>
    )
  }
}

export default ProductItemDetails
