import { useState } from 'react';
import axios from 'axios';

const AddCommentForm = ({ articleName, onArticleUpdated }) => {
    const [name, setName] = useState('');
    const [commentText, setCommentText] = useState('');

    const addComment = async () => {
        const response = await axios.post(`/api/articles/${articleName}/comments`, {
            postedBy: name,
            text: commentText,
        });
        const updatedArticle = response.data;
        onArticleUpdated(updatedArticle);
        setName('');
        setCommentText('');
    }

    return (
        <div id="add-comment-form">
            <h3>Add a Comment</h3>
            <label>
                Name:
                <input
                    value={name}
                    onChange={e => {
                        // Check if the input value is not a string
                        if (typeof e.target.value !== 'string') {
                            // Handle the case where the input is not a string
                            console.error('Input is not a string');
                        } else {
                            // If it is a string, update the state
                            setName(e.target.value);
                        }
                    }}
                    type="text" />
            </label>

            <label>
                Comment:
                <textarea
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    rows="4"
                    cols="50" />
            </label>
            <button onClick={addComment}>Add Comment</button>
        </div>
    )
}

export default AddCommentForm;