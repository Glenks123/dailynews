import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import Article from './Article';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export type IArticle = {
  headline: string;
  link: string;
  shortText: string;
};

function App() {
  const [articles, setArticles] = useState<IArticle[] | undefined>();
  const [loading, isLoading] = useState<boolean>(true);

  const getArticles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/');
      setArticles(response.data.newsArticle);
      isLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getArticles();
  }, []);

  return (
    <div className="App">
      <h1
        style={{
          textAlign: 'center',
          marginTop: '50px',
          fontWeight: 'lighter',
          fontSize: '50px',
        }}
      >
        The Daily News
      </h1>
      {loading ? (
        <Spinner
          style={{
            marginTop: '50px',
            position: 'fixed',
            left: '50%',
          }}
          animation="border"
          variant="primary"
        />
      ) : (
        <div
          style={{
            marginTop: '50px',
            display: 'table',
            marginRight: 'auto',
            marginLeft: 'auto',
          }}
        >
          {articles?.map((article: IArticle) => {
            return (
              <Article
                headline={article.headline}
                shortText={article.shortText}
                link={article.link}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
