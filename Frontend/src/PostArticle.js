import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For redirecting after successful post
import './PostArticle.css';

function PostArticle() {
    const [title, setTitle] = useState('');
    const [categories, setCategories] = useState([]); // Assume categories are fetched from an API
    const [category, setCategory] = useState('');
    const [summary, setSummary] = useState('');
    const [image, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    // Simulate fetching categories from an API
    useEffect(() => {
        // Replace this with actual API call
        setCategories([{ id: 1, name: 'Technology' }, { id: 2, name: 'Education' }]);
    }, []);

    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
        setSuccessMessage(`File ${event.target.files[0].name} ready for upload.`);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('user_id', JSON.parse(localStorage.getItem('user')).id);
        formData.append('title', title);
        formData.append('category_id', category);
        formData.append('summary', summary);
        if (image) {
            formData.append('article_image', image);
        }

        try {
            const response = await axios.post('http://localhost:5000/add_article', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Article posted:', response.data);
            setSuccessMessage('Article successfully posted!');
            setErrorMessage('');
            navigate('/HomePage'); // Redirect to articles page or another success page
        } catch (error) {
            console.error('Failed to post article:', error);
            setErrorMessage('Failed to post article.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="form-container">
            <h2>Post a New Article</h2>
            {errorMessage && <p className="error">{errorMessage}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <label>
                    Title:
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Category:
                    <select value={category} onChange={e => setCategory(e.target.value)} required>
                        <option value="">Select a Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Summary:
                    <textarea
                        value={summary}
                        onChange={e => setSummary(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Upload Image:
                    <input
                        type="file"
                        onChange={handleFileChange}
                    />
                </label>
                <button className='postbtn' type="submit">Post Article</button>
            </form>
        </div>
    );
}

export default PostArticle;
