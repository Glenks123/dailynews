import React from 'react';
import { IArticle } from './App';

const Article: React.FC<IArticle> = ({ headline, shortText, link }) => {
  return (
    <div style={{ width: '50rem', height: '10rem', marginTop: '20px' }}>
      <h2 style={{ fontWeight: 'lighter' }}>{headline}</h2>
      <p>
        {shortText}
        <p
          style={{ color: 'blue' }}
          onClick={() => {
            window.location.href = link;
          }}
        >
          Read More
        </p>
      </p>
      <hr style={{ marginTop: '50px' }} />
    </div>
  );
};

export default Article;
