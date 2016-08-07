import React, { PropTypes as T } from 'react'
import classnames from 'classnames'
import {getDetails} from 'utils/googleApiHelpers'
import styles from './styles.module.css'

export class Detail extends React.Component {
  static childContextTypes = {
    router: T.object,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      loading: true,
      place: {},
      location: {}
    }
  }

  componentDidMount() {
    if (this.props.map) {
      this.getDetails(this.props.map)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.map &&
      (prevProps.map !== this.props.map ||
       prevProps.params.placeId !== this.props.params.placeId)) {
      this.getDetails(this.props.map);
  }
}

renderPhotos(place) {
  if (!place.photos || place.photos.length == 0) return;

  const cfg = {maxWidth: 100, maxHeight: 100}
  return (<div className={styles.photoStrip}>
    {place.photos.map(p => {
      const url = `${p.getUrl(cfg)}.png`
      return (<img key={url} src={url} />)
    })}
    </div>)
}

renderReviews(place) {
  if (!place.reviews || place.reviews.length == 0) return;

  return (<div>
    {place.reviews.map((p,index) => {
      return (
        <div key={index} className={styles.review}>
        <a href={p.author_url}>{p.author_name}</a>              
        <p>
        {p.text}
        </p>
        </div>
        )
    })}
    </div>)
}

getDetails(map) {
  const {google, params} = this.props;
  const {placeId} = params;

  this.setState({
    loading: true
  }, () => {
    getDetails(google, map, placeId)
    .then((place) => {
      const {location} = place.geometry;
      const loc = {
        lat: location.lat(),
        lng: location.lng()
      }

      this.setState({
        place,
        location: loc,
        loading: false
      })
    })
  });
}


render() {
  if (this.state.loading) {
    return (<div className={styles.wrapper}>
      Loading...
      </div>)
  }

  const {place} = this.state;

  return (
    <div className={styles.wrapper}>
    <div className={styles.header}>
    <h2>{place.name}</h2>
    </div>
    <div className={styles.details}>
    {this.renderPhotos(place)}
    </div>
    <div className={styles.details}>
    <h2>Tel Phone: {place.formatted_phone_number}</h2>
    <div>
    {place.types.map((p,index) => {
      return (
        <span key={index} >
        {p}
        </span>
        )
    })}
    </div>
    <a href={place.website}><h2>Official Website</h2></a>
    </div>
    <div className={styles.details}>
    {this.renderReviews(place)}
    </div>
    </div>
    )
}
}

export default Detail