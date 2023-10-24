import { Router } from 'express';
import { UrlModel } from '../db/urlModel.js';

const idRouter = Router();

idRouter.get('/:id', async (req, res) => {
  const { id: slug } = req.params;

  const decodedSlug = decodeURIComponent(slug); // Decode the URL parameter
  try {
    const url = await UrlModel.findOne({ slug: decodedSlug }); // Use the decodedSlug in the query
    if (url) {
      await UrlModel.updateOne(
        { slug: decodedSlug },
        { $inc: { clicks: 1 } } // Use $inc to increment clicks by 1
      );
      res.redirect(url.url);
    } else {
      res.redirect(`/?error=${decodedSlug} not found`);
    }
  } catch (error) {
    res.redirect('/?error=Link not found');
  }
});

export { idRouter };
