import React, { useState } from 'react';
import { Star, MessageCircle, RefreshCw, Edit, Trash2, Calendar } from 'lucide-react';
import './BusinessCard.css'; 

const BusinessCard = ({
  business,
  onRegenerateHeadline,
  onEdit,
  onDelete,
  isRegenerating
}) => {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="star full" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="star half" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="star empty" />);
    }

    return stars;
  };

  return (
    <div
      className="business-card"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`actions ${showActions ? 'visible' : 'hidden'}`}>
        <button onClick={() => onEdit(business)} className="action-button edit" title="Edit business">
          <Edit className="icon blue" />
        </button>
        <button onClick={() => onDelete(business.id)} className="action-button delete" title="Delete business">
          <Trash2 className="icon red" />
        </button>
      </div>

      <div className="header">
        <h3>{business.name}</h3>
        <p><Calendar className="icon small" /> Added {formatDate(business.createdAt)}</p>
      </div>

      <div className="stats">
        <div className="stat rating">
          <div className="label"><Star className="icon yellow" /> Google Rating</div>
          <div className="value">
            <span>{business.rating}</span>
            <div className="stars">{renderStars(business.rating)}</div>
          </div>
        </div>
        <div className="stat reviews">
          <div className="label"><MessageCircle className="icon blue" /> Reviews</div>
          <div className="value">
            <span>{business.reviews}</span>
            <span className="text">total reviews</span>
          </div>
        </div>
      </div>

      <div className="headline">
        <div className="headline-header">
          <h4>Latest SEO Headline</h4>
          <button onClick={() => onRegenerateHeadline(business)} disabled={isRegenerating}>
            <RefreshCw className={`icon small ${isRegenerating ? 'spin' : ''}`} />
            {isRegenerating ? 'Generating...' : 'Regenerate'}
          </button>
        </div>
        <p>{business.headline}</p>
      </div>

      <div className="location-badge">
        <span className="dot" />
        {business.location}
      </div>
    </div>
  );
};

BusinessCard.defaultProps = {
  isRegenerating: false
};

export default BusinessCard;
