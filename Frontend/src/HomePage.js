import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomePage.css';

function HomePage() {
    const [articles, setArticles] = useState([]); // Initialize state with an empty array

    useEffect(() => {
        fetchArticles(); // Fetch articles when the component mounts
    }, []);

    const fetchArticles = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/articles'); // Fetch articles from the server
            await fetchUsernames(data); // Fetch usernames for each article
        } catch (error) {
            console.error('Failed to fetch articles:', error);
            setArticles([]);  // Fallback to an empty array in case of error
        }
    };

    const fetchUsernames = async (articles) => {
        const updatedArticles = await Promise.all(articles.map(async article => {
            const response = await axios.get(`http://localhost:5000/get_user/${article.user_id}`);
            article.username = response.data.username;  // Add username directly to each article
            return article;
        }));
        setArticles(updatedArticles);
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
                    <p>By: {article.username}</p>
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
                            <div className='commentsection'>
                                <input className='addcomment' name="comment" placeholder="Add a comment" />
                                <button className='submitbtn' type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default HomePage;
