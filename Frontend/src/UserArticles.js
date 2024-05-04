import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserArticles.css';

function UserArticles() {
    const [articles, setArticles] = useState([]);

    const navigate = useNavigate();
    const checkLoggedIn = () => {
        if (!localStorage.getItem('user')) {
            navigate('/SignIn');
        }
    };
    const user_id = JSON.parse(localStorage.getItem('user')).id;
    
    useEffect(() => {
        checkLoggedIn();
    }, [navigate]);

    useEffect(() => {
        fetchUserArticles();
    }, []);

    const fetchUserArticles = async () => {
        try {
            // Adjusted URL to the correct endpoint
            const response = await axios.get(`http://localhost:5000//userArticles/${user_id}`);
            setArticles(response.data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    const deleteArticle = async (articleId) => {
        try {
            await axios.delete(`http://localhost:5000/delete_article/${articleId}`);
            setArticles(articles.filter(article => article.id !== articleId));  // Update the state
        } catch (error) {
            console.error('Error deleting article:', error);
        }
    };

    const updateArticle = async (articleId, title, summary) => {
        try {
            await axios.post(`http://localhost:5000/update_article/${articleId}`, { title, summary });
            fetchUserArticles();  // Refresh list after update
        } catch (error) {
            console.error('Error updating article:', error);
        }
    };

    return (
        <div>
            {articles.map(article => (
                <div className='articleUser' key={article.id}>
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
                    </div>
                    <div className='userbtn'>
                        <button className='btndelete' onClick={() => deleteArticle(article.id)}>Delete</button>
                        <button className='btnupdate' onClick={() => updateArticle(article.id, article.title, article.summary)}>Update</button>
                    </div>
    
                </div>
            ))}
        </div>
    );
}

export default UserArticles;
