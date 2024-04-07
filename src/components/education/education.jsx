import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './education.css'; // Ensure this is the correct path to your stylesheet

export function Education() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8001/education');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching education data:', error);
      }
    };
    fetchData();
  }, []);

  const addComment = async (postId, commentText) => {
    try {
      await axios.post(`http://localhost:8001/education/${postId}/comment`, { text: commentText });
      setData(data.map(entry =>
        entry._id === postId
          ? { ...entry, Comments: [...entry.Comments, { text: commentText, datePosted: new Date() }] }
          : entry
      ));
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await axios.delete(`http://localhost:8001/education/${postId}/comment/${commentId}`);
      setData(data.map(entry =>
        entry._id === postId
          ? { ...entry, Comments: entry.Comments.filter(comment => comment._id !== commentId) }
          : entry
      ));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div>
      {data.length > 0 ? (
        data.map((item) => (
          <div className="service-entry" key={item._id}>
            <div className="entry-content">
              <h2>{item.Subject}</h2>
              <p>{item.Description}</p>
              <p>Services: {item.HelpType}</p>
              <address>
                {item.City}, {item.State} {item.Pincode}
              </address>
              {item.Location && (
                <p>
                  Location: Latitude {item.Location.latitude.toFixed(6)}, Longitude {item.Location.longitude.toFixed(6)}
                </p>
              )}
              {item.FileData && (
                <a href={`http://localhost:8001/files/${item._id}`} download>
                  Download File
                </a>
              )}
            </div>
            <div className="comments-container">
              <div className="comments-header">
                <h3>Comments</h3>
              </div>
              {item.Comments && item.Comments.map((comment, index) => (
                <div key={index} className="comment">
                  <p>{comment.text}</p>
                  <button
                    onClick={() => handleDeleteComment(item._id, comment._id)}
                    className="delete-comment"
                    aria-label="Delete comment"
                  >
                    &#x1F5D1;
                  </button>
                </div>
              ))}
              <div className="comment-form">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const commentText = e.target.elements.commentText.value;
                  addComment(item._id, commentText);
                  e.target.elements.commentText.value = ''; // Clear input after submission
                }}>
                  <input type="text" name="commentText" required placeholder="Leave a comment" />
                  <button type="submit">Add Comment</button>
                </form>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No education data available.</p>
      )}
    </div>
  );
}

export default Education;
