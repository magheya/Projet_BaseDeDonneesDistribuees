import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For redirecting after successful post
import './PostArticle.css';

function PostArticle() {
    const [title, setTitle] = useState('');
    const [categories, setCategories] = useState([{ id: 'new', name: 'Add New Category' }]);
    const [category, setCategory] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [summary, setSummary] = useState('');
    const [image, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();
    const checkLoggedIn = () => { // Redirect to sign-in page if user is not logged in
        if (!localStorage.getItem('user')) {
            navigate('/SignIn');
        }
    };
    useEffect(() => {
        checkLoggedIn();
    }, [navigate]);

    useEffect(() => {
        axios.get('http://localhost:5000/categories') // Fetch existing categories
            .then(response => {
                const existingCategories = response.data;
                setCategories(existingCategories.concat(categories));
            })
            .catch(error => {
                console.error('Failed to fetch categories', error);
            });
    }, []);

    const handleCategoryChange = (event) => { // Handle category selection
        const selectedCategory = event.target.value; 
        if (selectedCategory === 'new') {
            setCategory('');
            setNewCategoryName('');
        } else {
            setCategory(selectedCategory);
        }
    };

    const addNewCategory = async () => { // Add new category
        if (!newCategoryName.trim()) {
            alert('Category name is required');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/add_category', { name: newCategoryName });
            const newCat = response.data;
            setCategories([...categories, { id: newCat.id, name: newCat.name }]);
            setCategory(newCat.id);
            setNewCategoryName('');
        } catch (error) {
            console.error('Error adding new category:', error);
            alert('Failed to add new category');
        }
    };

    const handleFileChange = (event) => { // Handle file selection
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
            <h2 className='posttext'>Post a New Article</h2>
            {errorMessage && <p className="error">{errorMessage}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <label>
                    Title:
                    <input className='titleinput'
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Category:
                    <select value={category} onChange={handleCategoryChange} required>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                    </select>
                    {category === '' && (
                            <>
                                <input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="New category name" required />
                                <button type="button" onClick={addNewCategory}>Add</button>
                            </>
                    )}
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
                    <input className='fileinput'
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
