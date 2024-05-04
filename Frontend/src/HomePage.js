import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomePage.css';

function HomePage() {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/articles');
            setArticles(response.data);  // Adjust according to actual response structure
        } catch (error) {
            console.error('Failed to fetch articles:', error);
            setArticles([]); // Fallback to an empty array in case of error
        }
    };

    const addComment = async (articleId, comment) => {
        try {
            const response = await axios.post(`http://localhost:5000/add_comment/${articleId}`, { content: comment }, {
                headers: { 'Content-Type': 'application/json' }
            });
            // Optimistic UI Update
            const newArticles = articles.map(article => {
                if (article.id === articleId) {
                    return { ...article, comments: [...article.comments, comment] };
                }
                return article;
            });
            setArticles(newArticles);
            alert('Comment added successfully');
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment');
        }
    };

    return (
        <div className="card-container">
            {articles.map(article => (
                <div key={article.id} className="card">
                    <h3>{article.title}</h3>
                    <p>{article.summary || 'No summary available'}</p>
                    <p>Published on: {new Date(article.publish_date).toLocaleDateString()}</p>
                    {article.images && article.images.map((image, index) => (
                        <img key={index} src={`http://localhost:5000/static/uploads/${image}`} alt="Article" />
                    ))}
                    <div>
                        <ul>
                            {article.comments && article.comments.map((comment, index) => (
                                <li key={index}>{comment}</li>
                            ))}
                        </ul>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const comment = e.target.elements.comment.value;
                            addComment(article.id, comment);
                            e.target.elements.comment.value = '';  // Clear input after submission
                        }}>
                            <input name="comment" placeholder="Add a comment" />
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default HomePage;
