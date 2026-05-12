import { getAllQuestions } from "../../lib/fetch";

export default async function handler(req, res) {
  try {
    const { currentPage = 1, cat_slug = 'all', pageSize = 10 } = req.query;
    const result = await getAllQuestions({
      currentPage: parseInt(currentPage),
      cat_slug,
      pageSize: parseInt(pageSize)
    });
    res.status(200).json(result);
  } catch (error) {
    console.error('API /api/qna error:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
}