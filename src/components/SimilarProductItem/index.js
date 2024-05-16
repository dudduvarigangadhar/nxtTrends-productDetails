import './index.css'

const SimilarProductItem = props => {
  const {similarProducts} = props

  return (
    <div className="similar-products-list-container">
      <h1 className="similar-products-heading">Similar Products</h1>
      <div className="similar-product-container">
        {similarProducts.map(eachItem => (
          <li key={eachItem.id} className="list-item">
            <img
              src={eachItem.imageUrl}
              alt="similar product"
              className="similar-product-image"
            />
            <h1 className="similar-product-heading">{eachItem.title}</h1>
            <p className="similar-product-brand">by {eachItem.brand}</p>
            <div className="price-and-rating-container">
              <p className="similar-product-price">Rs {eachItem.price}/-</p>
              <div className="similar-product-rating-container">
                <p className="similar-product-rating">{eachItem.rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="similar-product-rating-img"
                />
              </div>
            </div>
          </li>
        ))}
      </div>
    </div>
  )
}

export default SimilarProductItem
