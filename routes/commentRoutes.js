const router = require("./messageRoutes");


router.post('/posts/postId/comments', async (req, res) =>{
    try {
        const { content } = req.body;
        const postId = req.params.postId;
        const userId = req.user.id; 
    
        const comment = new Comment({
          content,
          post: postId,
          author: userId,
        });
    
        await comment.save();
    
        res.json(comment);
      } catch (error) {
        console.error('Error creating a comment:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });



  module.exports = router